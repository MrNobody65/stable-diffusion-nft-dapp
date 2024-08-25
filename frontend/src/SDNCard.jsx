import contract from "../../blockchain/artifacts/contracts/StableDiffusionNFT.sol/StableDiffusionNFT.json"
import { BrowserProvider, Contract } from 'ethers';

function SDNCard(props) {

    async function burnSDN(tokenId) {
        const provider = new BrowserProvider(window.ethereum);
        const signer = await provider.getSigner()
        const contractABI = contract.abi
        const contractAddress = import.meta.env.VITE_SC_ADDRESS
        const SDNContract = new Contract(contractAddress, contractABI, signer)

        const burnTxn = await SDNContract.burn(tokenId)
        await burnTxn.wait()
    }

    return (
        <div className='SDN-container'>
            <img src={props.img} />
            <button className="delete-button" onClick={async () => {
                await burnSDN(props.id)
                props.getBurned(true)
            }}>x</button>
        </div>
    )
}

export default SDNCard