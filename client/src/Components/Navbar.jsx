import { useState } from "react";

import { HiMenuAlt4 } from "react-icons/hi";
import { AiOutlineClose } from "react-icons/ai";


import logo from "../../images/logo.png";


const NavbarItem = ({title, classProps}) => {
  return (
    <li className={`mx-4 cursor-pointer ${classProps}`}>
      {title}
    </li>
  )
}

const Navbar = () => {

  const [toggle, setToggle] = useState(false);

  return (
    <nav className="w-full flex md:justify-center justify-between items-center p-4">
      <div className="md:flex-[0.5] flex-initial justify-center items-center">
        <img src={logo} alt="logo" className="w-32 cursor-pointer" />
      </div>
      <ul className="md:flex flex-row hidden list-none justify-between items-center  flex-[0.2_1_auto] text-white">
        {["Market", "Tutorials", "Exchange", "Wallets"].map( (item, index) => (
          <NavbarItem key = {item + index} title = {item} />
        ))}
        <NavbarItem title={`Login`} classProps={`bg-[#2952e3] text-center rounded-full hover:bg-[#2546bd] cursor-pointer py-2 px-7`} />
      </ul>
      {
        toggle ? <AiOutlineClose fontSize={28} onClick={() => setToggle(false)} className="text-white cursor-pointer md:hidden"/> : <HiMenuAlt4 fontSize={28} onClick={() => setToggle(true)} className="text-white cursor-pointer md:hidden" />
      }

      {
        toggle && 
        <ul className="fixed -right-2 top-0 z-10 h-screen p-3 shadow-2xl w-[70vw] md:hidden list-none flex flex-col justify-start items-end rounded-md blue-glassmorphism animate-slide-in">
          <AiOutlineClose fontSize={28} onClick={() => setToggle(false)} className="text-white cursor-pointer mb-6"/>
          {["Markets", "Tutorials"," Exchange", "Wallets"].map( (item, index) => (
            <NavbarItem key={item + index} title={item} classProps={`text-lg text-white my-2`} />
          ))}
        </ul>
      }
    </nav>
  );
}

export default Navbar