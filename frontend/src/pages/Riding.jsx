import React from "react";
import { Link } from "react-router-dom";

const Riding = () => {
  return (
    <div className="h-screen ">

      <div className="h-1/2">
        <Link to="/home">
          <img
            src="home-line.svg"
            className="fixed left-2 top-2 w-9 bg-gray-100 rounded-full p-2"
            alt=""
          />
        </Link>
        <img
          src="https://miro.medium.com/v2/resize:fit:1400/0*gwMx05pqII5hbfmX.gif"
          alt=""
          className="h-full w-full object-cover "
        />
      </div>
      <div className="ride h-1/2 p-4">
        <h3 className="text-2xl font-semibold mb-5"> Ride Ongoing </h3>

        <div className="captain-details flex justify-between">
          <img src="car.png" className="w-28 " alt="" />

          <div className="text-right">
            <h2 className="text-lg font-medium">Sarthak </h2>
            <h4 className="text-2xl font-semibold -mt-1 -mb-1">MP04 AB 9890</h4>
            <p className="text-sm text-gray-500">Volkswagen</p>
          </div>
        </div>

        <div className="flex flex-col justify-center gap-5">
          <div className="flex gap-5 p-2 border-b-2 border-gray-300">
            <img src="map-user.svg" className="w-5" alt="" />
            <div>
              <h3 className="text-lg font-medium">562/11-A</h3>
              <p className="text-gray-600 text-sm">
                Kaikodhali, Bengaluru, Karnataka
              </p>
            </div>
          </div>
          <div className="flex gap-5 p-2">
            <img src="cash-fill.svg" className="w-5" alt="" />
            <div>
              <h3 className="text-lg font-medium">562/11-A</h3>
              <p className="text-gray-600 text-sm">Card, Cash</p>
            </div>
          </div>
        </div>

        <button className="w-full mt-2 bg-green-400 p-2 text-white font-semibold rounded">
          Make a Payment
        </button>
      </div>
    </div>
  );
};

export default Riding;
