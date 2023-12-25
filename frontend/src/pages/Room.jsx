import React from "react";
import Navbar from "../components/Navbar";
import { Merge, Plus } from "lucide-react";
import roomfloating from "../assets/roomfloating.svg";

const Room = () => {
  return (
    <div className=" p-4">
      <Navbar />
      <div className="flex flex-col gap-4 justify-center items-center min-h-[80vh]">
        <img src={roomfloating} alt="roomfloating" className="" />
        <button className="flex bg-white gap-3 text-black p-4 font-semibold text-2xl text-center items-center justify-center rounded-full w-full">
          <Merge />
          Join Room
        </button>
        <button className="flex bg-white gap-3 text-black p-4 font-semibold text-2xl text-center items-center justify-center rounded-full w-full">
          <Plus />
          Create Room
        </button>
      </div>

      <div className="flex flex-col gap-2 justify-center items-center">
        <h1 className=" text-3xl opacity-50 tracking-widest uppercase font-bold">
          Zephyr
        </h1>
        <p className=" opacity-50 font-bold tracking-widest text-sm">
          Unleash the Breeze of Peer-to-Peer Sharing
        </p>
      </div>
    </div>
  );
};

export default Room;
