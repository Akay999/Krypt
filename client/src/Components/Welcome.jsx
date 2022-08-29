import { AiFillPlayCircle } from "react-icons/ai";
import { SiEthereum } from "react-icons/si";
import { BsInfoCircle } from "react-icons/bs";
import { Loader } from "./";

import "./Welcome.css";
import { useContext } from "react";
import { TransactionContext } from "../context/TransactionContext";

const commonProp = "text-white border flex-[1_1_auto] w-20 text-center py-3 sm:py-5";

const Input = ({placeholder, value, type, name, onClickHandler}) => (
  <input 
  placeholder={placeholder}
  type = {type}
  value= {value}
  step="0.00001"
  onChange={(e) => onClickHandler(e, name)}
  className="bg-transparent border-none text-white my-2 white-glassmorphism p-3 rounded-none"
  />
)

const Welcome = () => {

  const { connectWallet, connectedAccount, formData, handleChange, sendTransactions } = useContext(TransactionContext);

  const handleSubmit = (e) => {
    const {addressTo, amount, keyword, message } = formData;
    e.preventDefault;

    if(!addressTo || !amount || !keyword || !message ) return;
    sendTransactions();
  }

  return (
    <section className="flex md:flex-row flex-col w-full justify-center gap-10 sm:gap-0 items-center py-10">
      <div className="flex text-white flex-col justify-center sm:items-start flex-[0.5]">
        <div className="text-gradient my-3">
          <span className="text-5xl sm:text-6xl">Send the crypto</span> <br/>
          <span className="text-4xl sm:text-5xl">across the world</span>
        </div>
        <div className="my-3">
          <span>Explore the crypto world. Buy and sell</span> <br />
          <span>cryptocurrencies easily on Krypt</span>
        </div>
        {!connectedAccount && (
            <div className="w-ful my-5 btn">
            <span onClick={connectWallet}>Connect Wallet</span>
        </div>
        )}
        <div className="my-6 flex flex-col w-full">
          <div className="flex flex-row px-2 w-full">
            {["Reliability", "Security", "Ethereum"].map( (item, index) => (
              <div className={`${index == 0 ? "rounded-tl-lg" : index == 2 ? "rounded-tr-lg" : ""} ${commonProp}`}>
                {item}
              </div>
            ))}
          </div>

          <div className="flex flex-row px-2 w-full">
            {["Web 3.0", "Low Fees", "Blockchain"].map( (item, index) => (
              <div className={`${index == 0 ? "rounded-bl-lg" : index == 2 ? "rounded-br-lg" : ""} ${commonProp}`}>
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>

      <hr className="md:hidden my-5 w-80"/>

      <div className="flex flex-col gap-6 flex-[0.2_1_auto] justify-center items-center">
        <div className="text-white md:w-80 w-[60vw] eth-card h-[12rem] md:h-40 p-3 rounded-lg flex flex-col justify-between">
          <div className="w-full flex flex-row justify-between items-center">
            <div className="border-2 p-2 text-xl rounded-full">
              <SiEthereum />
            </div>
            <div className="text-xl">
              <BsInfoCircle />
            </div>
          </div>

          <div className="flex flex-col">
            <h4 className='text-sm opacity-90'>Address</h4>
            <h2 className="text-xl">0xdddfsfd....adsfd</h2>
          </div>
        </div>

        <div className="my-4 md:mt-0 p-5 blue-glassmorphism rounded-3xl md:w-96 w-full flex justify-center flex-col">
          <Input placeholder="Address to" name="addressTo" type="text" onClickHandler={handleChange} />
          <Input placeholder="Amount (ETH)"  name="amount" type="number" onClickHandler={handleChange} />
          <Input placeholder="Message"  name="message" type="text" onClickHandler={handleChange} />
          <Input placeholder="Keyword"  name="keyword" type="text" onClickHandler={handleChange} />

          <hr className="my-3" />

          {false ? <Loader /> : <div type="button" onClick={handleSubmit} className="w-full border my-3 rounded-full p-3 text-white text-center cursor-pointer">
              Submit
          </div> }
          
        </div>
      </div>
    </section>
  );
}

export default Welcome;