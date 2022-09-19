import React from "react";
import { ethers } from "ethers";
import { contractABI, contractAddress } from "../utils/constants";
import { useEffect } from "react";
import { useState } from "react";
export const TransactionContext = React.createContext();

// we have eth obj cuz we installed metamask
const { ethereum } = window;

const getEthContract = () => {
  const provider = new ethers.providers.Web3Provider(ethereum);
  const signer = provider.getSigner();

  const transactionContract = new ethers.Contract(
    contractAddress,
    contractABI,
    signer
  );
//   console.log({
//     provider,
//     signer,
//     transactionContract,
//   });
  // transactionContract field contain all the functions and method that we have implement i n smart contract
  return transactionContract
};

export const TransactionProvider = ({ children }) => {
  const [currentAccount, setCurrentAccount] = useState("");

  const [formData, setFormData] = useState({addressTo: '', amount:'', keyword: '', message: ''})

  const [loading, setLoading] = useState(false) ;

  const [transactionCount, setTranSactionCount] = useState(localStorage.getItem('transactionCount')) ;

  const [transactions, setTransactions] = useState([]);

  const handleChange = (e, name) => {
    setFormData((prevState) => ({...prevState, [name]: e.target.value})) ;
  }

  const getAllTransactions = async() => {
    try {
      if (!ethereum) return alert("Please install meatmask");
      const transactionContract = getEthContract() ; 
      const availableTransactions = await transactionContract.getAllTransaction() ; 
      


      const structuredTransactions = availableTransactions.map((transaction) => ({
        addressTo: transaction.receiver,
        addressFrom: transaction.sender,
        timestamp: new Date(transaction.timestamp.toNumber() * 1000).toLocaleString(),
        message: transaction.message,
        keyword: transaction.keyword,
        amount: parseInt(transaction.amount._hex) / (10 ** 18)
      }));
      setTransactions(structuredTransactions)
      console.log(structuredTransactions)
      

    } catch(e) {
      console.log(e);
      throw new Error("no eth object");
    }
  }

  const checkIfWalletIsConnected = async () => {
    try {
      if (!ethereum) return alert("Please install meatmask");
      const accounts = await ethereum.request({ method: "eth_accounts" });
      console.log(accounts);

      if (accounts.length) {
        setCurrentAccount(accounts[0]);
        getAllTransactions()
      } else {
        console.log("No account found!");
      }
    } catch (e) {
      console.log(e);
    }
  };

  const connectWallet = async () => {
    try {
      if (!ethereum)
        return alert("Cannot connect to wallet, please install metamask");

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      setCurrentAccount(accounts[0]);
    } catch (e) {
      console.log(e);
      throw new Error("no eth object");
    }
  };

  const sendTransaction = async () => {
    try {
      if (!ethereum) {
        return alert("Please install metamask");
        
      }
      const {addressTo, amount, keyword, message} = formData; 
      console.log(addressTo , ' ' , amount , ' ' , keyword ,  '  ' , message)
      const transactionContract =  getEthContract() ;
      const parseAmount = ethers.utils.parseEther(amount) ; // pares to gwei
      
      await ethereum.request({
        method: 'eth_sendTransaction',
        params: [{
            from: currentAccount, 
            to: addressTo,
            gas: '0x5208' ,// == 21000 gwei == 0.000021 eth
            value: parseAmount._hex, 
        }]
      })

      const transactionHash = await  transactionContract.addToBlockChain(addressTo, parseAmount, message, keyword) ; 
      setLoading(true)
      console.log(`loading - ${transactionHash.hash}`) 
      await transactionHash.wait() ;
      setLoading(false) ;
      console.log(`success - ${transactionHash.hash}`) 

      const transactionCount= await transactionContract.getTransactionCount() ; 
      setTranSactionCount(transactionCount.toNumber())
    } catch (e) {
      console.log(e);
      throw new Error("no eth object");
    }
  };

  const checkIfTransactionExist = async ()  => {
    try {
      const transactionContract = getEthContract() ; 
      const transactionCount = await transactionContract.getTransactionCount() ; 
      window.localStorage.setItem("transactionCount", transactionCount)

    } catch(e) {
      console.log(e);
      throw new Error("no transaction object");
    }
  }

  useEffect(() => {
    checkIfWalletIsConnected();
    checkIfTransactionExist() ; 
  }, []);
  return (
    <TransactionContext.Provider value={{ connectWallet, currentAccount, formData, setFormData, handleChange, loading,sendTransaction, transactions }}>
      {children}
    </TransactionContext.Provider>
  );
};
