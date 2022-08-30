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
                addressTo : transaction.receiver,
                addressFrom : transaction.sender,
                timestamp : new Date(transaction.timestamp.toNumber() * 1000).toLocaleString(),
                message : transaction.message,
                keyword : transaction.keyword,
                amount : parseInt(transaction.amount_hex) * (10 ** 18)
            }))

            setTransactions(structuredTransaction);
            console.log(availableTransactions);
        } catch (error) {
            console.log(error);
        }
    }

    const checkIfWalletIsConnected = async () => {


        try {
            if(!ethereum) return alert("Please connect metamask!");
            const account = await ethereum.request({method : "eth_accounts"});
    
            if(account.length) {
                setConnectedAccount[account[0]];
                getAllTransactions();
            }
            else {
                console.log("No Transactions found!");
            }
        } catch (error) {
            console.log(error);

            throw new Error("No Ethereum Object");
            
        }

    }

    const checkIfTransactionExsit = async () => {
        try {
            const transactionContract = getEthereumContract();
            const currenttransactionCount = await transactionContract.getTransactionCounts();
            
            window.localStorage.setItem("transactionCount", currenttransactionCount);

        } catch (error) {
            console.log(error);

            throw new Error("No Ethereum Object");
        }
    }

    const connectWallet = async () => {
        try {
            if(!ethereum) return alert("Please connect metamask!");
            const account = await ethereum.request({method : "eth_requestAccounts"});

            setConnectedAccount(account[0]);
        } catch (error) {
            console.log(error);

            throw new Error("No Ethereum Object");
        }

    }


    const sendTransactions = async () => {
        try {
            if(!ethereum) return alert("Please connect metamask!");

            const {addressTo, amount, keyword, message } = formData;
            const transactionContract = getEthereumContract();
            const parsedAmount = ethers.utils.parseEther(amount)

            await ethereum.request({
                method : 'eth_sendTransaction',
                params : [{
                    from :  connectedAccount,
                    to : addressTo,
                    gas : '0x5208', //21000 Gwei
                    value : parsedAmount._hex,

                }]
            })

            const transactionHash = await transactionContract.addToBlockChain(addressTo, parsedAmount, message, keyword);

            setLoading(true);
            console.log(`Loading - ${transactionHash.hash}`);
            await transactionHash.wait();
            console.log(`Success - ${transactionHash.hash}`);
            setLoading(false);

            const transactionsCount = await transactionContract.getTransactionCounts();

            setTransactionCount(transactionsCount.toNumber());
            window.location.reload();

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
        <TransactionContext.Provider value = {{ connectWallet, connectedAccount, formData, setFormData, handleChange, sendTransactions, transactions, loading }}>
            {children}
        </TransactionContext.Provider>
    )
}
