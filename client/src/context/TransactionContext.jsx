import React ,{ useState, useEffect } from 'react';
import {ethers } from "ethers";

import { contractABI , contractAddress } from '../utils/constants';

export const TransactionContext = React.createContext();

const { ethereum } = window;

const getEthereumContract = () => {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const transactionContract = new ethers.Contract(contractAddress, contractABI, signer);

    return transactionContract;
}



export const TransactionProvider = ({children}) => {

    const [connectedAccount, setConnectedAccount] = useState("");
    const [formData, setFormData] = useState({ addressTo : "", amount : "", keyword : "", message : ""});
    const [loading, setLoading] = useState(false);
    const [transactionCount, setTransactionCount] = useState(localStorage.getItem('transactionCount'))
    const [transactions, setTransactions] = useState([])

    const handleChange = ( e, name ) => {
        setFormData((prevState) =>  ({ ...prevState, [name] : e.target.value}));
    }

    const getAllTransactions = async () => {
        try {
            if(!ethereum) return alert("Please connect metamask!");
            const transactionContract = getEthereumContract();

            const availableTransactions = await transactionContract.listAllTransaction();

            const structuredTransaction = availableTransactions.map((transaction) => ({
                addressTo : transaction.reciever,
                addressFrom : transaction.sender,
                timestamp : new Date(transaction.timestamp.toNumber() * 1000).toLocaleString(),
                message : transaction.message,
                keyword : transaction.keyword,
                amount : parseInt(transaction.amount._hex) / (10 ** 18)
            }))

            setTransactions(structuredTransaction);
            console.log(availableTransactions);
        } catch (error) {
            console.log(error);
        }
    }

    const checkIfWalletIsConnected = async () => {
        try {
            if (!ethereum) return alert("Please install MetaMask.");

            const accounts = await ethereum.request({ method: "eth_accounts" });

            if (accounts.length) {
                setConnectedAccount(accounts[0]);
                getAllTransactions();
            } else {
                console.log("No accounts found");
            }
        } catch (error) {
            console.log(error);

            throw new Error("No Ethereum Object");
            
        }

    }

    const checkIfTransactionExsit = async () => {
        try {
            if (ethereum) {
                const transactionsContract = getEthereumContract();
                const currentTransactionCount = await transactionsContract.getTransactionCounts();
        
                window.localStorage.setItem("transactionCount", currentTransactionCount);
            }

        } catch (error) {
            console.log(error);

            throw new Error("No Ethereum Object");
        }
    }

    const connectWallet = async () => {
        try {
            if (!ethereum) return alert("Please install MetaMask.");

            const accounts = await ethereum.request({ method: "eth_requestAccounts", });

            setConnectedAccount(accounts[0]);
            window.location.reload();
        } catch (error) {
            console.log(error);

            throw new Error("No Ethereum Object");
        }

    }


    const sendTransactions = async () => {
        try {
            if (ethereum) {
                const { addressTo, amount, keyword, message } = formData;
                const transactionsContract = getEthereumContract();
                const parsedAmount = ethers.utils.parseEther(amount);
        
                await ethereum.request({
                  method: "eth_sendTransaction",
                  params: [{
                    from: connectedAccount,
                    to: addressTo,
                    gas: "0x5208",
                    value: parsedAmount._hex,
                  }],
                });
        
                const transactionHash = await transactionsContract.addToBlockChain(addressTo, parsedAmount, message, keyword);
        
                setLoading(true);
                console.log(`Loading - ${transactionHash.hash}`);
                await transactionHash.wait();
                console.log(`Success - ${transactionHash.hash}`);
                setLoading(false);
        
                const transactionsCount = await transactionsContract.getTransactionCounts();
        
                setTransactionCount(transactionsCount.toNumber());
                window.location.reload();
              } else {
                console.log("No ethereum object");
              }

        } catch (error) {
            console.log(error);
            throw new Error("No ethereum Object!");
        }
    }


    useEffect(() => {
        checkIfWalletIsConnected();
        checkIfTransactionExsit();
    }, [transactionCount]);

    return (
        <TransactionContext.Provider value = {{ connectWallet, connectedAccount, formData, setFormData, handleChange, sendTransactions, transactions, loading, transactionCount }}>
            {children}
        </TransactionContext.Provider>
    )
}
