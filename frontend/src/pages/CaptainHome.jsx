import React, { useState } from "react";
import { Link } from "react-router-dom";
import CaptainDetails from "../Components/CaptainDetails";
import RidePopup from "../Components/RidePopup";
import ConfirmRidePopup from "../Components/ConfirmRidePopup";

const CaptainHome = () => {
  const [ridePopupPanel, setRidePopupPanel] = useState(true);
  const [confirmRidePopupPanel, setConfirmRidePopupPanel] = useState(false);

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

      <div className="rider h-2/5 p-6 rounded-2xl">
        <CaptainDetails />
      </div>
      <RidePopup ridePopupPanel={ridePopupPanel} setConfirmRidePopupPanel={setConfirmRidePopupPanel} setRidePopupPanel={setRidePopupPanel} />
      <ConfirmRidePopup confirmRidePopupPanel={confirmRidePopupPanel} setConfirmRidePopupPanel={setConfirmRidePopupPanel} />
    </div>
  );
};

export default CaptainHome;
