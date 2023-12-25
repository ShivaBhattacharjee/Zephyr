import React, { useEffect } from "react";
import ShareBg from "../assets/share.svg";
import { ArrowRight } from "lucide-react";
import { useNickname } from "../context/NickName";
import Toast from "../../utils/toast";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const { setNickname } = useNickname();
  const navigate = useNavigate();
  const [nicknameInput, setNicknameInput] = React.useState("");

  useEffect(() => {
    const storedNickname = localStorage.getItem("nickname");
    if (storedNickname) {
      navigate("/room");
    } else {
      navigate("/");
    }
  }, [navigate]);

  const handleContinue = (e) => {
    e.preventDefault();
    if (nicknameInput.length < 3)
      return Toast.ErrorShowToast("Nickname must be atleast 3 characters long");
    setNickname(nicknameInput);
    navigate("/room");
  };
  return (
    <div className=" w-full lg:w-1/2 lg:m-auto p-4 flex flex-col gap-5 justify-center items-center min-h-screen">
      <h1 className=" uppercase p-8 text-3xl font-bold text-center absolute top-0 right-0 lg:left-0 lg:top-20">
        Zephyr
      </h1>
      <img
        src={ShareBg}
        alt="file-sharing-background"
        className="w-80 lg:w-[400px]"
      />
      <form onSubmit={handleContinue} className="flex flex-col gap-3">
        <input
          type="text"
          placeholder="Enter a nickname ......."
          onChange={(e) => setNicknameInput(e.target.value)}
          className=" p-4 w-full focus:outline-none font-semibold rounded-lg bg-transparent border-2 duration-200 border-white/30 focus:border-white"
        />
        <p className=" opacity-70 font-bold text-sm">
          Choose a distinctive nickname for self-identification in a room.
        </p>
        <button
          className={`${
            nicknameInput.length < 3 ? "bg-white/30" : "bg-white"
          } flex justify-center items-center gap-2 w-full text-black p-4 rounded-lg font-semibold text-lg duration-200 hover:bg-transparent hover:border hover:border-white hover:text-white`}
        >
          Continue <ArrowRight />
        </button>
      </form>
    </div>
  );
};

export default Home;
