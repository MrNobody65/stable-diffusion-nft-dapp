import React, { useState, useEffect, useContext } from 'react'
import SDNCard from "./SDNCard.jsx"
import { ConnectedContext } from './App.jsx';

import axios from 'axios'
import contract from "../../blockchain/artifacts/contracts/StableDiffusionNFT.sol/StableDiffusionNFT.json"
import { BrowserProvider, Contract } from 'ethers';

function SDNCollection() {

    const [collection, setCollection] = useState([])
    const [burned, setBurned] = useState(false)
    const [notAllowTxn, setNotAllowTxn] = useState(false)

    const { connected } = useContext(ConnectedContext)

    async function getCollection() {
        const provider = new BrowserProvider(window.ethereum);
        const signer = await provider.getSigner()
        const contractABI = contract.abi
        const contractAddress = import.meta.env.VITE_SC_ADDRESS
        const SDNContract = new Contract(contractAddress, contractABI, signer)

        let tBalance = await SDNContract.balanceOf(signer.address)
        tBalance = Number(tBalance)

        let tCollection = []
        for (let i = 0; i < tBalance; i++) {
            let tokenIdByIndex = await SDNContract.tokenOfOwnerByIndex(signer.address, i)
            tokenIdByIndex = Number(tokenIdByIndex)
            const tokenUriByTokenId = await SDNContract.tokenURI(tokenIdByIndex)
            const tokenMetadata = await axios.get(tokenUriByTokenId)
            tCollection.push({ id: tokenIdByIndex, uri: tokenMetadata.data.image })
        }
        setCollection(tCollection)
    }

    useEffect(() => {
        if (connected) {
            getCollection()
            setNotAllowTxn(false)
        }
        else setCollection([])
    }, [connected])

    useEffect(() => {
        if (burned) {
            getCollection()
            setBurned(false)
        }
    }, [burned])

    return (
        <div className="collection-container">
            <h1>Your SDN Collection</h1>
            {notAllowTxn ? <p className='error'>Please connect to MetaMask to see your collection.</p> : null}
            <button onClick={() => {
                if (connected) getCollection()
                else setNotAllowTxn(true)
            }}>Refresh</button>
            <div className="collection">
                {collection.map((SDN) =>
                    <SDNCard key={SDN.id} id={SDN.id} img={SDN.uri} getBurned={setBurned} />
                )}
            </div>
        </div>
    )
}

export default SDNCollection