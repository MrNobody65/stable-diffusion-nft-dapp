import React, { useState, useRef } from 'react';
import axios from 'axios';
import { pinata } from "./utils/config.js"
import Loading from "./Loading.jsx";
import contract from "../../blockchain/artifacts/contracts/StableDiffusionNFT.sol/StableDiffusionNFT.json"
import { ethers } from 'ethers'
import { Buffer } from 'buffer';

window.Buffer = Buffer

function App() {

  const [isLoading, setIsLoading] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [image, setImage] = useState(null);

  const cid = useRef()
  const metadataCid = useRef()
  const prev_prompt = useRef("")

  function inputPrompt(event) {
    setPrompt(event.target.value)
  }

  async function generate() {
    setIsLoading(true);
    const result = await axios.get(`http://${import.meta.env.VITE_BACKEND_HOST}:${import.meta.env.VITE_BACKEND_PORT}/?prompt=${prompt}`);
    setImage(result.data);
    setIsLoading(false);
    prev_prompt.current = prompt;
    setPrompt("");
  };

  async function uploadImageToIPFS() {
    const uploadImg = await pinata.upload.base64(image)
    cid.current = uploadImg.IpfsHash

    const metadata = JSON.stringify({
      prompt: prev_prompt.current,
      image: `https://${import.meta.env.VITE_GATEWAY_URL}/ipfs/${cid.current}`
    })

    const uploadMetadata = await pinata.upload.json(metadata)
    metadataCid.current = uploadMetadata.IpfsHash

    return true
  }

  async function mintSDN() {
    const isUploaded = await uploadImageToIPFS()
    if (isUploaded) {
      const provider = new ethers.InfuraProvider('sepolia', import.meta.env.VITE_INFURA_API_KEY)

      const privateKey = import.meta.env.VITE_PRIVATE_KEY
      const signer = new ethers.Wallet(privateKey, provider)

      const abi = contract.abi
      const contractAddress = import.meta.env.VITE_SC_ADDRESS

      const mySDNContract = new ethers.Contract(contractAddress, abi, signer)

      let SDNTxn = await mySDNContract.safeMint(signer.address, `https://${import.meta.env.VITE_GATEWAY_URL}/ipfs/${metadataCid.current}`)
      SDNTxn.wait()
    }
  }

  return (
    <>
      <div>
        <input type="text" placeholder='Enter your prompt' value={prompt} onChange={(event) => inputPrompt(event)} />
        <button onClick={generate}>Generate</button>
        <button onClick={mintSDN}>Mint</button>
      </div>
      {isLoading ? <Loading /> : image ? <img src={`data:image/png;base64,${image}`} /> : null}
    </>
  )
}

export default App
