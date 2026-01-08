import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CaptainDetails from "../Components/CaptainDetails";
import RidePopup from "../Components/RidePopup";
import ConfirmRidePopup from "../Components/ConfirmRidePopup";
import { CaptainDataContext } from "../context/CaptainContext";
import { SocketDataContext } from "../context/SocketContext";
import axios from 'axios'


const CaptainHome = () => {
  const [ridePopupPanel, setRidePopupPanel] = useState(false);
  const [confirmRidePopupPanel, setConfirmRidePopupPanel] = useState(false);
  const { sendMessage, recieveMessage, socket } = useContext(SocketDataContext);
  const [ride, setRide] = useState(null);
  const { captain } = useContext(CaptainDataContext);

  const updateLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        sendMessage('update-location-captain', { captainId: captain._id, latitude, longitude });
      }, (err) => {
        console.error("Error getting location:", err);
      });
    }
  }


  const acceptRideHandler = async () => {
    setRidePopupPanel(false);

    const response = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/rides/accept-ride`,
      {
        rideId: ride._id,
        captainId: captain._id
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      }
    );

    console.log(response.data);
    setConfirmRidePopupPanel(true);
  }

  useEffect(() => {
    sendMessage('join', { userType: "captain", userId: captain._id });
    if (socket) {
      recieveMessage('new-ride-request', (ride) => {
        console.log("New ride request received:", ride);
        setRide(ride);
        setRidePopupPanel(true);
      });
    }
  }, [socket,captain]);





  useEffect(() => {
    updateLocation();
    const locationInterval = setInterval(() => {
      updateLocation();
    }, 10000);

    return () => clearInterval(locationInterval);
  }, []);

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

      <div className="rider  h-2/5 p-6 rounded-2xl">
        <CaptainDetails />
      </div>
      <RidePopup ride={ride} acceptRideHandler={acceptRideHandler} setRidePopupPanel={setRidePopupPanel} ridePopupPanel={ridePopupPanel} />
      <ConfirmRidePopup ride={ride}  confirmRidePopupPanel={confirmRidePopupPanel} setConfirmRidePopupPanel={setConfirmRidePopupPanel} />
    </div>
  );
};

export default CaptainHome;
