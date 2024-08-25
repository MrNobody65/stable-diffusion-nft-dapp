import React, { useState, useEffect, useRef, useContext } from 'react';
import Loading from "./Loading.jsx";
import Card from "./Card.jsx"
import { ConnectedContext } from './App.jsx';

import axios from 'axios';
import { pinata } from "./utils/config.js"
import contract from "../../blockchain/artifacts/contracts/StableDiffusionNFT.sol/StableDiffusionNFT.json"
import { BrowserProvider, Contract } from 'ethers';

import { Buffer } from 'buffer';
window.Buffer = Buffer

function StableDiffusion() {
    const [isLoading, setIsLoading] = useState(false)
    const [prompt, setPrompt] = useState("")
    const [images, setImages] = useState(null)
    const [notAllowTxn, setNotAllowTxn] = useState(false)

    const prev_prompt = useRef("")

    const { connected } = useContext(ConnectedContext)

    useEffect(() => {
        if (connected) setNotAllowTxn(false)
    }, [connected])

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
        const img_bstr = window.atob(image);
        let n = img_bstr.length;
        const img_u8arr = new Uint8Array(n);
        while (n--) {
            img_u8arr[n] = img_bstr.charCodeAt(n);
        }
        const img_file = new File([img_u8arr], 'sdn.png', { type: 'image/png' })

        const uploadImg = await pinata.upload.file(img_file)

        const metadata = {
            prompt: prev_prompt.current,
            image: `https://${import.meta.env.VITE_GATEWAY_URL}/ipfs/${uploadImg.IpfsHash}`
        }

        const uploadMetadata = await pinata.upload.json(metadata)

        return uploadMetadata.IpfsHash
    }

    async function mintSDN(image) {
        if (connected) {
            const cid = await uploadImageToIPFS(image)
            if (cid) {
                const provider = new BrowserProvider(window.ethereum);
                const signer = await provider.getSigner()
                const contractABI = contract.abi
                const contractAddress = import.meta.env.VITE_SC_ADDRESS
                const SDNContract = new Contract(contractAddress, contractABI, signer)
                const mintTxn = await SDNContract.safeMint(signer.address, `https://${import.meta.env.VITE_GATEWAY_URL}/ipfs/${cid}`)
                await mintTxn.wait()
            }
        }
        else setNotAllowTxn(true)
    }

    return (
        <>
            <div className="SD-container">
                <h1>Stable Diffusion NFT</h1>
                {notAllowTxn ? <p className='error'>Please connect to MetaMask to start minting SDN.</p> : null}
                <div className="prompt-container">
                    <input type="text" placeholder='Enter your prompt' value={prompt} onChange={(event) => inputPrompt(event)} />
                    <button onClick={generate} disabled={isLoading}>Generate</button>
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