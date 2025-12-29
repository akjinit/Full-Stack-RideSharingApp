import React from "react";
import { Link } from "react-router-dom";

const Start = () => {
  return (
    <div>
      <div className="bg-center bg-cover bg-[url(https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/c5310f182519763.652f3606b64b0.jpg)] h-screen pt-5  w-full flex justify-between flex-col ">
        <img
          className="ml-5 w-20"
          src="https://download.logo.wine/logo/Uber/Uber-Logo.wine.png"
          alt=""
        />
        <div className="bg-white py-4 px-4 pb-7">
          <h2 className="text-3xl font-bold ">Get Started with Uber</h2>
          <Link to={'/login'} className="justify-center bg-black w-full flex text-white py-3 px-10 rounded mt-4">
            Continue
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Start;
