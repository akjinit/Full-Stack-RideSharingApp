import React from "react";
import { Link } from "react-router-dom";

const CaptainHome = () => {
  return (
    <div className="h-screen ">
      <div className="h-3/5">
        <div className="w-full px-3 fixed flex items-center justify-between">
          <img
            className="w-30  "
            src="https://download.logo.wine/logo/Uber/Uber-Logo.wine.png"
            alt=""
          />

          <Link to="/home">
            <img
              src="logout-box.svg"
              className=" w-9 bg-gray-100 rounded-full p-2"
              alt=""
            />
          </Link>
        </div>
        <img src="https://miro.medium.com/v2/resize:fit:1400/0*gwMx05pqII5hbfmX.gif" alt="" className="h-full w-full object-cover " />
      </div>

      <div className="rider h-2/5 p-5">
        <div className="rider-details flex justify-between items-center bg-yellow-200 rounded-2xl p-3">
          <div className="flex gap-2 items-center">
            <img src="sample-driver.jpg" className="h-10 w-10 rounded-full object-cover" alt="" />
            <h4 className="text-lg font-medium">Harsh Patel</h4>
          </div>

          <div>
            <h4 className="text-xl font-semibold">Rs 295.2</h4>
            <p className="text-sm text-gray-600"> Earned</p>
          </div>
        </div>

        <div className="ride-details flex gap-5 p-6 mt-6 bg-gray-300 rounded-2xl justify-around text-center">
          <div  className="flex flex-col items-center">
            <img src="time-line.svg" className="w-5"alt="" />
            <h5 className="text-lg font-medium">10.2</h5>
            <p className="text-[10px] text-gray-600">Hours Online</p>
          </div>
          <div className="flex flex-col items-center">
            <img src="pin-distance-line.svg" className="w-5"alt="" />
            <h5 className="text-lg font-medium">10.2</h5>
            <p className="text-[10px] text-gray-600">Distance Travelled</p>
          </div>
          <div className="flex flex-col items-center">
            <img src="booklet-line.svg" className="w-5"alt="" />
            <h5 className="text-lg font-medium">300</h5>
            <p className="text-[10px] text-gray-600">Average Earning</p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CaptainHome;
