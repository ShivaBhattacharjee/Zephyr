import React, { useEffect, useState } from "react";
import { useNickname } from "../context/NickName";
import { Github, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import EditProfileModal from "./EditProfileModal";
const Navbar = () => {
  const { nickname } = useNickname();
  const navigate = useNavigate();
  useEffect(() => {
    if (!nickname) {
      navigate("/");
    }
  }, [nickname, navigate]);

  const [openEditProfileModal, setOpenEditProfileModal] = useState(false);
  return (
    <nav className="flex flex-col lg:w-1/2 lg:m-auto">
      <div className="flex flex-wrap justify-between items-center">
        <div>
          <h1 className=" font-bold text-2xl tracking-normal truncate w-52">
            Yahallo , {nickname}
          </h1>
          <span className=" text-sm font-bold mt-2 bg-white/30 w-20 justify-center tracking-wider flex p-1 rounded-full">
            v1.0.0
          </span>
        </div>
        <div className="flex duration-200 cursor-pointer gap-5">
          <Github
            onClick={() =>
              window.open("https://github.com/shivabhattacharjee/zephyr")
            }
            size={30}
            className=" duration-200 hover:scale-125"
          />
          <Settings
            onClick={() => setOpenEditProfileModal(!openEditProfileModal)}
            size={30}
            className=" duration-200 hover:rotate-[360deg]"
          />
        </div>
      </div>

      <div
        className={`fixed z-50 bg-white/5 backdrop-blur-md h-full duration-300 w-full right-0 ease-in-out ${
          openEditProfileModal ? "-bottom-0" : "-bottom-[4600px]"
        }`}
      >
        <h1 className=" float-right cursor-pointer lg:absolute lg:right-96 p-5">
          <Settings
            onClick={() => setOpenEditProfileModal(!openEditProfileModal)}
            size={30}
            className=" duration-200 hover:rotate-[-360deg]"
          />
        </h1>
        <EditProfileModal setOpenEditProfileModal={setOpenEditProfileModal} />
      </div>
    </nav>
  );
};

export default Navbar;
