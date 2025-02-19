"use client"

import { cache, useState } from 'react'
import { Dialog } from '@headlessui/react';
import WarningIcon from '@mui/icons-material/Warning';
import { ethers } from 'ethers';
import { useConnectWallet } from '@web3-onboard/react';


const DAI_ADDR = "0xFF34B3d4Aee8ddCd6F9AFFFB6Fe49bD371b8a357";
const USDC_ADDR = "0x94a9D9AC8a22534E3FaCa9F4e7F2E2cf85d5E4C8";



const getQuote = cache(async function getPrice(sellTokenAddr:string, buyTokenAddr:string, amount:number){
    amount = amount * 10**18;    
      
    // This is a placeholder. Get your live API key from the 0x Dashboard (https://dashboard.0x.org/apps)
    const headers = {"0x-api-key": "a89700a3-518d-4e73-8125-d5a1a44b2527"};
    
    // Fetch the swap price.
    const response = await fetch(
    `https://sepolia.api.0x.org/swap/v1/price?sellToken=${sellTokenAddr}&buyToken=${buyTokenAddr}&sellAmount=${amount}`, { headers }
    );

    if (response.status !== 200) {console.log("0x quote obtained"); return null;}

    const response_json = await response.json();
    return response_json;
})


interface Quote {
    buyAmount: number,
    estimatedGas: number,
    allowanceTarget: string
}

export default function TokenSwap() {
    const [{ wallet }] = useConnectWallet();
    const [isOpen, setIsOpen] = useState(true)
    const [sellAmount, setSellAmount] = useState<number>();
    const [lastQuote, setLastQuote] = useState<Quote>()


    const handleAmountChange = (event:React.FormEvent<HTMLInputElement>) => {
        setSellAmount(Number(event.currentTarget.value));
    }

    const handleQuote = () => {
        if (!sellAmount) return;
        getQuote(DAI_ADDR, USDC_ADDR, sellAmount).then((res) => {
            setLastQuote({
                buyAmount: res.buyAmount / 10*6,
                estimatedGas: res.estimatedGas,
                allowanceTarget: res.allowanceTarget
            });
        })
    }



    const approveAndSwap = async () => {
        if (!wallet) {
            alert("Connect a wallet first");
            return;
        }

        if (!sellAmount || !lastQuote) {
            alert("Quote the prices first");
            return;
        }

        const erc20abi= [{ "inputs": [ { "internalType": "string", "name": "name", "type": "string" }, { "internalType": "string", "name": "symbol", "type": "string" }, { "internalType": "uint256", "name": "max_supply", "type": "uint256" } ], "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "owner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "spender", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" } ], "name": "Approval", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "from", "type": "address" }, { "indexed": true, "internalType": "address", "name": "to", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" } ], "name": "Transfer", "type": "event" }, { "inputs": [ { "internalType": "address", "name": "owner", "type": "address" }, { "internalType": "address", "name": "spender", "type": "address" } ], "name": "allowance", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" } ], "name": "approve", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "account", "type": "address" } ], "name": "balanceOf", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "amount", "type": "uint256" } ], "name": "burn", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "account", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" } ], "name": "burnFrom", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "decimals", "outputs": [ { "internalType": "uint8", "name": "", "type": "uint8" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "subtractedValue", "type": "uint256" } ], "name": "decreaseAllowance", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "addedValue", "type": "uint256" } ], "name": "increaseAllowance", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "name", "outputs": [ { "internalType": "string", "name": "", "type": "string" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "symbol", "outputs": [ { "internalType": "string", "name": "", "type": "string" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "totalSupply", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "recipient", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" } ], "name": "transfer", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "sender", "type": "address" }, { "internalType": "address", "name": "recipient", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" } ], "name": "transferFrom", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "nonpayable", "type": "function" }]
        const signer = new ethers.providers.Web3Provider(wallet.provider, 'any').getSigner();
        const sellTokenContract = new ethers.Contract(DAI_ADDR, erc20abi, signer);

        // // allowance
        try {
            const approveTx = await sellTokenContract.approve(lastQuote.allowanceTarget, sellAmount);
            const approveReceipt = await approveTx.wait();
            console.log(approveReceipt);
        } catch(error) {
            console.log((error as Error).message);
            return;
        }

        // swap
        const amount = sellAmount * 10 ** 18;
        // This is a placeholder. Get your live API key from the 0x Dashboard (https://dashboard.0x.org/apps)
        const headers = {"0x-api-key": "a89700a3-518d-4e73-8125-d5a1a44b2527"};
        const response = await fetch(
            `https://sepolia.api.0x.org/swap/v1/quote?sellToken=${DAI_ADDR}&buyToken=${USDC_ADDR}&sellAmount=${amount}`, { headers }
        );

        const response_json = await response.json();
        console.log(response_json);

        const swapTx = await  signer.sendTransaction({
            chainId: response_json.chainId,
            from: response_json.from,
            gasPrice: response_json.gasPrice,
            to: response_json.to,
            data: response_json.data            
        });
        const  swapReceipt = await swapTx.wait();
        console.log(swapReceipt);
    }

    return (
        <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
        <Dialog.Panel className={"element max-w-md absolute z-50 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-4 rounded"}>
            <Dialog.Title className={"font-bold text-xl"}>0x Token Swap</Dialog.Title>
            <Dialog.Description className={"flex"}>
            <WarningIcon className='text-yellow-500 me-2'/> <span className='text-sm font-light'>Rives only accepts USDC tokens, swap your tokens.</span>
            </Dialog.Description>

            <form className='flex flex-col'>
                <div className='grid grid-cols-2 py-2'>
                    <span className='place-self-center'>DAI</span>
                    <input type='number' id='sellToken' className='rounded w-sm text-black' value={sellAmount} onChange={handleAmountChange}></input>
                </div>


                <div className='grid grid-cols-2 py-2'>
                    <span className='place-self-center'>USDC</span>
                    <input disabled id='buyToken' className='rounded w-sm text-black' value={lastQuote?.buyAmount}></input>
                </div>
            </form>

            <div className='flex flex-col space-y-2'>
                <span>Estimated Gas: {lastQuote?.estimatedGas}</span>

                
                <div className='grid grid-cols-2 space-x-2'>
                    <button disabled={!sellAmount || sellAmount === 0} className='p-2 border hover-color' onClick={handleQuote}>
                        Quote
                    </button>

                    <button disabled={!lastQuote} className='p-2 border hover-color' onClick={approveAndSwap}>
                        Swap
                    </button>
                </div>
            </div>        
        </Dialog.Panel>
        </Dialog>
    )
}