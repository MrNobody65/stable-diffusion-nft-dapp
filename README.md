# stable-diffusion-nft-dapp

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->
## About The Project
This project is a **Web3** application that allow users to generate images with a *light-weight* stable diffusion model and mint custom non-fungible tokens (NFT) with them on **Sepolia** testnet called **Stable Diffusion NFT** (SDN). All the transactions are signed via [MetaMask](https://metamask.io).

The project source code contains 3 main components:
* The SDN smart contract's Solidity code using **Hardhat** environment and **Openzepplin** library. This smart contract is deployed on **Sepolia** testnet at address `0xBb109De9658D44dE25a6e50e04BFaADcAeE915D8`. You can find its verified code and transaction by using block explorer such as [Etherscan](https://etherscan.io/address/0xBb109De9658D44dE25a6e50e04BFaADcAeE915D8).

* The backend code using **FastAPI** framework and **Diffusers** library that provides *light-weight* model for image generation.

* The frontend code using **Reactjs** to create a dynamic web page and **ethers.js** to interact with smart contract abi and **MetaMask**


### Built With
* [![MetaMask][MetaMask-logo]][MetaMask-url]
* [![Hardhat][Hardhat-logo]][Hardhat-url]
* [![Diffusers][Diffusers-logo]][Diffusers-url]
* [![FastAPI][FastAPI-logo]][FastAPI-url]
* [![Ethers.js][Ethers.js-logo]][Ethers.js-url]
* [![React][React-logo]][React-url]

<!-- GETTING STARTED -->
## Getting Started

### Prerequisites
* Install Nodejs from this [site](https://nodejs.org/en).

### Installation
1. Clone the repository from Github:
    ```sh
    git clone https://github.com/MrNobody65/stable-diffusion-nft-dapp.git
    ```
2. Create and activate python virtual environment for backend with `conda`
    ```sh
    conda create -p venv python==3.11.0
    conda activate ./venv
    ```
3. Install dependencies for backend
    
    ***Note:*** *You must run two below commands in the same order with this docs to make sure the code will work.* 
    ```sh
    pip install -r requirements-python.txt
    pip install -r requirements-others.txt  
    ```

4. Create `nodejs` enviroment for frontend with `npm`
    ```sh
    npm init
    ```

5. Create `.env` files based on `.env.example` for each folder and enter the required variables.

6. Run the application
* Firstly, run the backend with the below command
    ```
    python main.py
    ```
* Secondly, run the frontend with the below command
    
    ***Note:*** *This frontend is not used for deployment but it can still be used to interact with SDN smart contract on **Sepolia** testnet.*
    ```
    npm run dev
    ``` 

<!-- MARKDOWN LINKS & IMAGES -->
[MetaMask-logo]: https://img.shields.io/badge/metamask-e1af00?style=for-the-badge
[MetaMask-url]: https://metamask.io
[Hardhat-logo]: https://img.shields.io/badge/hardhat-e1fa00?style=for-the-badge
[Hardhat-url]: https://hardhat.org
[Diffusers-logo]: https://img.shields.io/badge/diffusers-e1ff00?style=for-the-badge
[Diffusers-url]: https://huggingface.co/docs/diffusers/index
[FastAPI-logo]: https://img.shields.io/badge/fastapi-FFFFFF?style=for-the-badge&logo=fastapi&logoColor=%23009688
[FastAPI-url]: https://fastapi.tiangolo.com
[Ethers.js-logo]: https://img.shields.io/badge/ethers.js-ffffff?style=for-the-badge
[Ethers.js-url]: https://docs.ethers.org/v6/
[React-logo]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=%2361DAFB
[React-url]: https://react.dev