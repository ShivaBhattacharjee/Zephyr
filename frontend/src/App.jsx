import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home, Room, SendFile } from "./pages";
import { Toaster } from "react-hot-toast";
const App = () => {
  return (
    <section className=" bg-black overflow-hidden min-h-screen w-full text-white">
      <BrowserRouter>
        <Toaster />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Room />} />
          <Route path="/home/send-file" element={<SendFile />} />
          <Route path="/*" element={<h1>Not Found</h1>} />
        </Routes>
      </BrowserRouter>
    </section>
  );
};

export default App;
