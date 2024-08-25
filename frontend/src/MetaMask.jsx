import React, { useState, useEffect, useContext } from 'react'
import { ConnectedContext } from './App.jsx';

function MetaMask() {
    const [currentAccount, setCurrentAccount] = useState([]);
    const [isInstalled, _] = useState(window.ethereum ? true : false)
    const [isConnected, setIsConnected] = useState(false)

    const { setConnected } = useContext(ConnectedContext)

    useEffect(() => {
        getAccount()
    }, [])

    useEffect(() => {
        setConnected(isConnected)
    }, [isConnected])

    window.ethereum.on("accountsChanged", getAccount)

    async function getAccount() {
        const accounts = await window.ethereum.request({ method: "eth_accounts" })
        if (accounts.length !== 0) {
            setCurrentAccount(accounts[0])
            setIsConnected(true)
        }
        else setIsConnected(false)
    }

    async function connectwalletHandler() {
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" })
        setCurrentAccount(accounts[0])
        if (accounts.length !== 0) setIsConnected(true)
        else setIsConnected(false)
    }

    async function disconnectWallet() {
        await window.ethereum.request({
            method: "wallet_revokePermissions",
            params: [
                {
                    eth_accounts: {},
                },
            ],
        })
    }

    return (
        <div className="MetaMask-container">
            <h1>MetaMask</h1>
            <div className="connect-container">
                {
                    isInstalled ?
                        (isConnected ?
                            <div className='connect-info-container'>
                                <p><strong>Address:</strong> {currentAccount}</p>
                                <button onClick={disconnectWallet}>Disconnect</button>
                            </div>
                            : <button onClick={connectwalletHandler}>Connect</button>)
                        : <p className='error'>Please install MetaMask extension on your browser and reload the page</p>
                }
            </div>
        </div >
    )
}

export default MetaMask