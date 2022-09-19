import React from 'react'
import {ethers} from 'ethers'
import { contractABI, contractAddress } from '../utils/constants'
import { useEffect } from 'react';
import { useState } from 'react';
export  const TransactionContext = React.createContext() ;

// we have eth obj cuz we installed metamask
const {ethereum} = window

const getEthContract = () =>  {
    const provider = new ethers.providers.Web3Provider(ethereum) ;
    const signer = provider.getSigner() ;
    
    const transactionContract = new ethers.Contract(contractAddress, contractABI, signer) ;
    console.log({
        provider, 
        signer,
        transactionContract
    })

}

export const TransactionProvider = ({children}) => {


    const [connectedAccount, setConnectedAccount] = useState('')

    const checkIfWalletIsConnected = async () => {
        if (!ethereum) return alert("Please install meatmask") ;
        const accounts = await ethereum.request({method: 'eth_accounts'})
        console.log(accounts)

    }

    const connectWallet = async () => {
        try {
            if (!ethereum) return alert("Cannot connect to wallet, please install metamask")

            const accounts = await ethereum.request({method: 'eth_requestAccounts'})
            setConnectedAccount(accounts[0])
            
        } catch (e) {
            console.log(e) 
            throw new Error('no eth object')
        }
    }

    useEffect(() => {
        checkIfWalletIsConnected() 
    },[])
    return (
        <TransactionContext.Provider value={{connectWallet}} >
            {children}
        </TransactionContext.Provider>
    )
}