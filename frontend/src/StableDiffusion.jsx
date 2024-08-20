import React, { useState, useRef } from 'react';
import Loading from "./Loading.jsx";
import Card from "./Card.jsx"

import axios from 'axios';
import { pinata } from "./utils/config.js"
import contract from "../../blockchain/artifacts/contracts/StableDiffusionNFT.sol/StableDiffusionNFT.json"
import { ethers } from 'ethers'

function StableDiffusion() {
    const [isLoading, setIsLoading] = useState(false);
    const [prompt, setPrompt] = useState("");
    const [images, setImages] = useState(null);

    const prev_prompt = useRef("")

    function inputPrompt(event) {
        setPrompt(event.target.value)
    }

    async function generate() {
        setIsLoading(true);
        const result = await axios.get(`http://${import.meta.env.VITE_BACKEND_HOST}:${import.meta.env.VITE_BACKEND_PORT}/?prompt=${prompt}`);
        setImages(result.data);
        setIsLoading(false);
        prev_prompt.current = prompt;
        setPrompt("");
    };

    async function uploadImageToIPFS(image) {
        const uploadImg = await pinata.upload.base64(image)

        const metadata = JSON.stringify({
            prompt: prev_prompt.current,
            image: `https://${import.meta.env.VITE_GATEWAY_URL}/ipfs/${uploadImg.IpfsHash}`
        })

        const uploadMetadata = await pinata.upload.json(metadata)

        return uploadMetadata.IpfsHash
    }

    async function mintSDN(image) {
        const cid = await uploadImageToIPFS(image)
        if (cid) {
            const provider = new ethers.InfuraProvider('sepolia', import.meta.env.VITE_INFURA_API_KEY)

            const privateKey = import.meta.env.VITE_PRIVATE_KEY
            const signer = new ethers.Wallet(privateKey, provider)

            const abi = contract.abi
            const contractAddress = import.meta.env.VITE_SC_ADDRESS

            const mySDNContract = new ethers.Contract(contractAddress, abi, signer)

            let SDNTxn = await mySDNContract.safeMint(signer.address, `https://${import.meta.env.VITE_GATEWAY_URL}/ipfs/${cid}`)
            SDNTxn.wait()
        }
    }

    return (
        <>
            <div className="SD-container">
                <h1>Stable Diffusion NFT</h1>
                <div className="prompt-container">
                    <input type="text" placeholder='Enter your prompt' value={prompt} onChange={(event) => inputPrompt(event)} />
                    <button onClick={generate}>Generate</button>
                </div>

                {isLoading ? <Loading /> : images ?
                    <div className="images-container">
                        <Card img={images[0]} onClickHandler={mintSDN} />
                        <Card img={images[1]} onClickHandler={mintSDN} />
                        <Card img={images[2]} onClickHandler={mintSDN} />
                        <Card img={images[3]} onClickHandler={mintSDN} />
                    </div>
                    : null}
            </div>

        </>
    )
}

export default StableDiffusion