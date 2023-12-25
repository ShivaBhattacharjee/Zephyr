import React from "react";
import { useNickname } from "../context/NickName";
import Navbar from "../components/Navbar";
import { ArrowLeft, ArrowUpToLine } from "lucide-react";
import { Link } from "react-router-dom";

const SendFile = () => {
  const { nickname } = useNickname();
  return (
    <div className=" p-4 overflow-hidden lg:w-1/2 lg:m-auto">
      <Navbar />
      <Link
        to={"/home"}
        className=" gap-2 font-semibold text-lg absolute mt-5 flex items-center"
      >
        <ArrowLeft />
        Back
      </Link>
      <div className="flex flex-col gap-4 justify-center items-center min-h-[80vh]">
        <div className="flex animate-ping flex-col gap-2 border-2 border-white p-4 rounded-full w-64 h-64 duration-200 justify-center items-center">
          <div className="border-2 flex flex-col justify-center items-center border-white w-48 h-48 rounded-full animate-pin">
            <div className="flex fleco justify-center items-center border-2 border-white w-32 h-32 rounded-full"></div>
          </div>
        </div>
        <div className=" absolute bg-white p-4 rounded-full text-black w-24 h-24 shadow-white/20 shadow-xl flex justify-center items-center flex-col">
          <h1 className=" text-6xl font-semibold">{nickname.split("")[0]}</h1>
        </div>
      </div>

      <button className=" overflow-hidden flex gap-3 items-center font-semibold text-lg absolute right-5 bg-white/30 text-black p-4 rounded-full -mt-24">
        <input type="file" className=" absolute opacity-0" />
        <ArrowUpToLine />
        Upload File
      </button>

      <div className="flex flex-col gap-2 justify-center items-center">
        <h1 className=" text-3xl opacity-50 tracking-widest uppercase font-bold">
          Zephyr
        </h1>
        <p className=" capitalize opacity-50 font-bold tracking-widest text-sm">
          Unleash the Breeze of Peer-to-Peer Sharing
        </p>
      </div>
    </div>
  );
};

export default SendFile;
