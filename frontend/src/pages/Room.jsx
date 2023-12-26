import React from "react";
import Navbar from "../components/Navbar";
import { ArrowDownUp } from "lucide-react";
import roomfloating from "../assets/roomfloating.svg";
import { Link } from "react-router-dom";

const Room = () => {
  return (
    <div className=" p-4">
      <Navbar />
      <div className="flex flex-col gap-4 justify-center items-center min-h-[80vh]">
        <img src={roomfloating} alt="roomfloating" className=" lg:w-[500px]" />
        <Link
          to={"/home/send-file"}
          className="flex lg:w-1/3  duration-200 hover:bg-transparent hover:border hover:border-white hover:text-white bg-white gap-3 text-black p-4 font-semibold text-2xl text-center items-center justify-center rounded-lg w-full"
        >
          <ArrowDownUp />
          Local Network
        </Link>
      </div>

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

export default Room;
