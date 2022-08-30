import { BsShieldFillCheck } from "react-icons/bs";
import { BiSearchAlt } from "react-icons/bi";
import { RiHeart2Fill } from "react-icons/ri";

const ServiceCard = ({color, icon, title, subtitle}) => (
  <div className="flex  flex-row justify-start items-center p-3 m-2 cursor-pointer hover:shadow-xl white-glassmorphism">
    <div className={`w-10 h-10 rounded-full flex justify-center items-center ${color}`}>
      {icon}
    </div>

    <div className="ml-5 flex flex-col flex-1">
      <h3 className="mt-2 text-white text-lg">{title}</h3>
      <p className="mt-2 text-white text-sm md:w-9/12">{subtitle}</p>
    </div>
  </div>
)
const Services = () => {
  return (
    <div className="flex flex-col md:flex-row w-full justify-center items-center gradient-bg-services">
      <div  className="flex md:flex-row items-center justify-between md:p-20 py-12 px-4">
        <div className="flex flex-1 flex-col justify-start items-start">
          <h1 className="text-white sm:text-6xl text-4xl py-2 text-gradient">
            Services that we
            <br />
            continue to improve
          </h1>
        </div>
      </div>
      <div className="flex-1 flex flex-col justify-start items-center">
        <ServiceCard color="bg-[#2952e3]"
        title="Security Guranteed" 
        icon = {<BsShieldFillCheck fontSize={21} className="text-white"/>}
        subtitle = "Security is guarnteed. we always maintain the privacy and maintain the quality of the product."
        />
        <ServiceCard color="bg-[#8945F8]"
        title="Best exchange rates" 
        icon = {<BiSearchAlt fontSize={21} className="text-white"/>}
        subtitle = "Security is guarnteed. we always maintain the privacy and maintain the quality of the product."
        />
        <ServiceCard color="bg-[#F84550]"
        title="Fastest Transactions" 
        icon = {<RiHeart2Fill fontSize={21} className="text-white"/>}
        subtitle = "Security is guarnteed. we always maintain the privacy and maintain the quality of the product."
        />
      </div>
    </div>
  );
}

export default Services