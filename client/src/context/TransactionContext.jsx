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

    const handleChange = ( e, name ) => {
        setFormData((prevState) =>  ({ ...prevState, [name] : e.target.value}));
    }

    const checkIfWalletIsConnected = async () => {


        try {
            if(!ethereum) return alert("Please connect metamask!");
            const account = await ethereum.request({method : "eth_accounts"});
    
            if(account.length) {
                setConnectedAccount[account[0]];
    
                //get all transactions.
            }
            else {
                console.log("No Transactions found!");
            }
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
            setLoading(false);
            console.log(`Success - ${transactionHash.hash}`);

            const transactionCount = await transactionContract.getTransactionCounts();

            setTransactionCount(transactionCount.toNumber());

        } catch (error) {
            console.log(error);
            throw new Error("No ethereum Object!");
        }
    }


    useEffect(() => {
        checkIfWalletIsConnected();
    }, []);

    return (
        <TransactionContext.Provider value = {{ connectWallet, connectedAccount, formData, setFormData, handleChange, sendTransactions }}>
            {children}
        </TransactionContext.Provider>
    )
}
