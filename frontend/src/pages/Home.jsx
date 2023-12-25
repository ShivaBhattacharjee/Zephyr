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
      navigate("/home");
    } else {
      navigate("/");
    }
  }, [navigate]);

  const handleContinue = (e) => {
    e.preventDefault();
    if (nicknameInput.length < 3)
      return Toast.ErrorShowToast("Nickname must be atleast 3 characters long");
    setNickname(nicknameInput);
    navigate("/home");
  };
  return (
    <div className="lg:w-1/4 m-auto p-4 flex flex-col gap-5 justify-center items-center min-h-screen">
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

      <div className="flex absolute bottom-10 flex-col gap-2 justify-center items-center">
        <h1 className=" text-3xl opacity-50 tracking-widest uppercase font-bold">
          Zephyr
        </h1>
        <p className=" opacity-50 font-bold tracking-wide text-sm">
          Unleash the Breeze of Peer-to-Peer Sharing
        </p>
      </div>
    </div>
  );
};

export default Home;
