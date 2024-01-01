import React, { useEffect, useState } from "react";
import { useNickname } from "../context/NickName";
import Navbar from "../components/Navbar";
import { ArrowLeft, ArrowUpToLine } from "lucide-react";
import { Link } from "react-router-dom";
import fileshare from "../assets/file.svg";
import io from "socket.io-client";
import { FadeLoader } from "react-spinners";

const SendFile = () => {
  const { nickname } = useNickname();
  const [connectedDevices, setConnectedDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFileName, setSelectedFileName] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [senderNickname, setSenderNickname] = useState("");

  // Declare socket state
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Initialize socket
    const newSocket = io("http://localhost:8080");
    setSocket(newSocket);

    newSocket.on("connect", () => {
      newSocket.emit("setNickname", nickname);
    });

    newSocket.on("updateUsers", (users) => {
      setConnectedDevices(users);
      setLoading(false);
      setError(null);
    });

    newSocket.on("nicknameError", (errorMessage) => {
      setError(errorMessage);
    });

    newSocket.on("connect_error", (error) => {
      console.error("Socket connection error:", error.message);
      setError("Unable to connect to the server.");
    });

    return () => {
      newSocket.disconnect();
    };
  }, [nickname, loading]);

  const handleFileUpload = async (event) => {
    const fileInput = event.target;
    if (!fileInput.files || fileInput.files.length === 0) {
      return;
    }

    const file = fileInput.files[0];
    setSelectedFileName(file.name);

    // Ensure recipientSocketIds is correctly obtained from connectedDevices
    const recipientSocketIds = connectedDevices.filter(
      (device) => device !== nickname
    );

    try {
      await Promise.all(
        recipientSocketIds.map(async (recipientSocketId) => {
          const formData = new FormData();
          formData.append("file", file);

          await fetch("http://localhost:8080/upload", {
            method: "POST",
            body: formData,
            headers: {
              "Recipient-Socket-Id": recipientSocketId,
              "x-socket-id": socket.id,
            },
          });
        })
      );

      setSenderNickname(socket.id || localStorage.getItem("nickname"));
      setUploadProgress(0);
    } catch (error) {
      console.error("Error during file upload:", error.message);
      setError(error.message);
    }
  };

  return (
    <div className="p-4 overflow-hidden lg:w-[90%] lg:m-auto">
      <Navbar />
      {loading ? (
        <div className="min-h-screen flex-col gap-3 tracking-wider font-semibold flex justify-center items-center">
          <FadeLoader color="#fff" />
          <h1 className="uppercase">Establishing p2p</h1>
          {error && (
            <div className="bg-red-500 text-white p-2 mt-2 rounded-md">
              {error}
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col justify-center">
          <Link
            to={"/home"}
            className="gap-2 lg:absolute lg:top-20 cursor-pointer lg:left-[28%] font-semibold text-lg  mt-5 z-20 flex items-center"
          >
            <ArrowLeft />
            Back
          </Link>

          <div className="flex relative flex-col min-h-screen items-center text-center gap-3 mt-5">
            <h1 className=" text-xl font-semibold tracking-wide">
              P2P FILE SHARING WITH ZEPHYR
            </h1>
            {error && (
              <div className="bg-red-500 absolute -top-0 z-50 font-semibold text-2xl w-full text-white p-2 mt-2 rounded-md">
                {error}
              </div>
            )}
            <p className=" text-sm text-red-500/70 text-start font-semibold">
              Please make sure the devices are connected to the same wifi
              network
            </p>

            <img
              src={fileshare}
              alt=""
              className="w-[90%] mt-16 lg:mt-36 lg:w-80 opacity-70"
            />

            <div className="absolute mt-7 top-20 lg:w-1/2 lg:m-auto bg-white/5 border-2 border-white/10 shadow-white/15 p-4 overflow-y-scroll shadow-sm backdrop-blur-lg w-[98%] h-96 rounded-lg">
              <div className="flex flex-wrap mt-16 flex-row justify-center items-center gap-7">
                {connectedDevices.length < 1 ? (
                  <h1 className="text-white text-2xl font-semibold">
                    No devices connected
                  </h1>
                ) : (
                  <>
                    {connectedDevices.map((device) => (
                      <div
                        key={device}
                        className="flex justify-center items-center flex-col font-bold text-lg"
                      >
                        <div className="w-16 flex-col h-16 shadow-white/5 shadow-2xl flex justify-center items-center font-bold text-2xl bg-white text-black rounded-full">
                          {device?.toUpperCase()?.split("")[0]}
                        </div>
                        <h1 className="truncate max-w-28">{device}</h1>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </div>
            <button
              className={` ${
                connectedDevices.length > 1 ? "bg-white" : "bg-white/30"
              } text-black overflow-hidden flex gap-3 p-4 mt-28 lg:mt-10 font-semibold rounded-lg  `}
            >
              {connectedDevices.length > 1 && (
                <>
                  <input
                    onChange={handleFileUpload}
                    type="file"
                    className="absolute opacity-0"
                  />
                </>
              )}
              <ArrowUpToLine />
              Upload File
            </button>

            <div className="border-2 min-h-full flex flex-col justify-center items-center overflow-y-scroll font-semibold mt-6 border-dashed w-full lg:w-[50%] lg:m-auto h-32 border-white/40 mb-10 lg:mb-20">
              {uploadProgress < 0 && (
                <span>{`${uploadProgress}% Uploaded`}</span>
              )}
              <span>{selectedFileName || "Choose File"}</span>
              {selectedFileName && <span>Sent by {senderNickname}</span>}
            </div>
            <div className="flex flex-col gap-2 justify-center items-center">
              <h1 className="text-3xl opacity-50 tracking-widest uppercase font-bold">
                Zephyr
              </h1>
              <p className="opacity-50 font-bold tracking-wide text-sm">
                Unleash the Breeze of Peer-to-Peer Sharing
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SendFile;
