import React, { useEffect } from "react";
import { useNickname } from "../context/NickName";
import { Github, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const { nickname } = useNickname();
  const navigate = useNavigate();
  useEffect(() => {
    if (!nickname) {
      navigate("/");
    }
  }, [nickname, navigate]);
  return (
    <nav className="flex lg:w-1/4 m-auto flex-col">
      <div className="flex flex-wrap justify-between items-center">
        <div>
          <h1 className=" font-bold text-2xl tracking-normal">
            Hello , {nickname}
          </h1>
          <span className=" text-sm font-bold mt-2 bg-white/30 w-20 justify-center tracking-wider flex p-1 rounded-full">
            v1.0.0
          </span>
        </div>
        <div className="flex duration-200 cursor-pointer gap-5">
          <Github
            onClick={() => window.open("https://github.com/shivabhattacharjee")}
            size={30}
            className=" duration-200 hover:scale-125"
          />
          <Settings size={30} className=" duration-200 hover:rotate-[360deg]" />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
