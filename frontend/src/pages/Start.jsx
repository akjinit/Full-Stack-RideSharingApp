import React from "react";
import { Link } from "react-router-dom";

const Start = () => {
  return (
    <div>
      <div className="bg-center bg-cover bg-[url(background.png)] h-screen pt-5  w-full flex justify-between flex-col ">
        <h1 className="ml-5 text-4xl font-bold text-black" >rideShare</h1>
        <div className="bg-white py-4 px-4 pb-7">
          <h2 className="text-3xl font-bold ">Get Started with rideShare</h2>
          <Link to={'/login'} className="justify-center bg-black w-full flex text-white py-3 px-10 rounded mt-4">
            Continue
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Start;
