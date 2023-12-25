import React, { useState } from "react";
import { useNickname } from "../context/NickName";
import Toast from "../../utils/toast";
import { useNavigate } from "react-router-dom";
import { Eraser, PenSquare } from "lucide-react";
export default function EditProfileModal({ setOpenEditProfileModal }) {
  const navigate = useNavigate();
  const { setNickname, nickname } = useNickname();
  const [newNickName, setnewNickName] = useState("");
  const updateDetails = (e) => {
    e.preventDefault();
    try {
      if (newNickName.length < 3) {
        Toast.ErrorShowToast("Nickname must be atleast 3 characters long");
      } else if (newNickName == nickname) {
        Toast.ErrorShowToast("Nickname must be different from previous one");
      } else {
        setNickname(newNickName);
        Toast.SuccessshowToast("Nickname updated");
        setOpenEditProfileModal(false);
      }
    } catch (err) {
      console.log(err);
      Toast.ErrorShowToast("Error updating nickname");
    }
  };

  const clearAllData = () => {
    try {
      localStorage.clear();
      Toast.SuccessshowToast("Cleared all data");
      navigate("/");
    } catch (err) {
      console.log(err);
      Toast.ErrorShowToast("Error clearing data");
    }
  };

  return (
    <div className=" bg-black lg:w-1/3 z-10 m-auto lg:right-0 lg:left-0 border-t-2 fixed bottom-0 border-white/30  rounded-t-2xl p-4 h-[45%] shadow-lg shadow-white w-full">
      <div className="flex min-h-full justify-center flex-col gap-6">
        <form className="flex gap-5 flex-col">
          <label
            htmlFor="nickname"
            className=" font-semibold text-xl tracking-normal"
          >
            Edit Nickname :{" "}
          </label>
          <input
            type="text"
            className=" p-3 duration-200 bg-transparent border-2 border-white/30 font-semibold focus:outline-none focus:border-white rounded-lg"
            placeholder="Enter a new nickname"
            onChange={(e) => setnewNickName(e.target.value)}
          />
          <button
            onClick={updateDetails}
            className={` flex items-center justify-center gap-3 duration-200 ${
              newNickName.length > 3 && newNickName != nickname
                ? "bg-white cursor-not-allowed"
                : "bg-white/30 cursor-pointer"
            } text-black p-3 rounded-lg font-semibold text-lg`}
          >
            <PenSquare />
            Update
          </button>
        </form>

        <button
          onClick={clearAllData}
          className=" flex gap-3 justify-center items-center bg-red-600 p-3 rounded-md font-semibold text-xl"
        >
          <Eraser />
          Clear all Data
        </button>
      </div>
    </div>
  );
}
