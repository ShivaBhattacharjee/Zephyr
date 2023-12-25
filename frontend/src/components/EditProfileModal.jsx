import React, { useState } from "react";
import { useNickname } from "../context/NickName";
import Toast from "../../utils/toast";
import { useNavigate } from "react-router-dom";
export default function EditProfileModal({ setOpenEditProfileModal }) {
  const navigate = useNavigate();
  const { setNickname, nickname } = useNickname();
  const [newNickName, setnewNickName] = useState("");
  const updateDetails = () => {
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
      const userConfirmed = window.confirm(
        "Are you sure you want to clear all data?"
      );
      if (userConfirmed) {
        localStorage.clear();
        Toast.SuccessshowToast("Cleared all data");
        navigate("/");
      }
    } catch (err) {
      console.log(err);
      Toast.ErrorShowToast("Error clearing data");
    }
  };

  return (
    <div className=" bg-black border-t-2 absolute bottom-0 border-white/30  rounded-t-2xl p-4 h-[45%] shadow-lg shadow-white w-full">
      <div className="flex min-h-full justify-center flex-col gap-6">
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
          className={` duration-200 ${
            newNickName.length > 3 && newNickName != nickname
              ? "bg-white"
              : "bg-white/30"
          } text-black p-3 rounded-lg font-semibold text-lg`}
        >
          Update
        </button>

        <button
          onClick={clearAllData}
          className=" bg-red-600 p-3 rounded-md font-semibold text-xl"
        >
          Clear all Data
        </button>
      </div>
    </div>
  );
}
