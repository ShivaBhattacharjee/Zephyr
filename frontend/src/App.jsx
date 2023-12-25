import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home, Room } from "./pages";
import { Toaster } from "react-hot-toast";
const App = () => {
  return (
    <section className=" bg-black min-h-screen w-full text-white">
      <BrowserRouter>
        <Toaster />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Room />} />
          <Route path="/*" element={<h1>Not Found</h1>} />
        </Routes>
      </BrowserRouter>
    </section>
  );
};

export default App;
