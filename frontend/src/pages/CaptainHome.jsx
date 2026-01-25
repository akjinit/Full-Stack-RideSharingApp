import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import CaptainDetails from "../Components/CaptainDetails";
import RidePopup from "../Components/RidePopup";
import ConfirmRidePopup from "../Components/ConfirmRidePopup";
import { CaptainDataContext } from "../context/CaptainContext";
import { SocketDataContext } from "../context/SocketContext";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from 'leaflet'

const icon = L.icon({
  iconUrl: './location-marker.png',
  iconSize: [40, 40],
  iconAnchor: [20, 20]
});

import axios from 'axios'


const CaptainHome = () => {
  const [ridePopupPanel, setRidePopupPanel] = useState(false);
  const [confirmRidePopupPanel, setConfirmRidePopupPanel] = useState(false);
  const { sendMessage, recieveMessage, socket } = useContext(SocketDataContext);
  const [ride, setRide] = useState(null);
  const { captain } = useContext(CaptainDataContext);
  const navigate = useNavigate();
  const [location, setLocation] = useState({ lat: 22.961074, lng: 88.433524 });
  const [captainDetailsPanelOpen, setCaptainDetailsPanelOpen] = useState(true);

  const fetchActiveRide = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/rides/active-ride/captain`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (response.data) {
        setRide(response.data);
        if (response.data.status === 'in_progress') {
          navigate('/captain-riding', { state: { ride: response.data } });
        } else {
          setConfirmRidePopupPanel(true);
        }
      }
    } catch (err) {
      // No active ride found, which is normal
      console.log("No active ride found");
    }
  }

  const updateLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        setLocation({
          lat: latitude,
          lng: longitude
        })

        if (captain?._id) {
          sendMessage('update-location-captain', { captainId: captain._id, latitude, longitude, rideId: ride?._id });
        }
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
    // Check for active ride on mount
    if (captain?._id) {
      fetchActiveRide();
      sendMessage('join', { userType: "captain", userId: captain._id });
    }
  }, [captain]);

  useEffect(() => {
    if (socket) {
      recieveMessage('new-ride-request', (ride) => {
        console.log("New ride request received:", ride);
        setRide(ride);
        setRidePopupPanel(true);
      });
    }
  }, [socket, recieveMessage]);

  useEffect(() => {
    updateLocation();
    const locationInterval = setInterval(() => {
      updateLocation();
    }, 5000);

    return () => clearInterval(locationInterval);
  }, [ride]);




  return (
    <div className="h-screen relative">
      <div className="h-3/5">
        <div className="w-full px-3 fixed flex items-center justify-between">
          <img
            className="w-30  "
            src="https://download.logo.wine/logo/Uber/Uber-Logo.wine.png"
            alt=""
          />

          <Link to="/captain/logout" className="h-10 w-10 bg-white flex items-center justify-center rounded-full">
            <i className="text-lg font-medium ri-logout-box-r-line"></i>
          </Link>
        </div>
        <div className="h-screen w-screen absolute z-0">
          {/* image for temp use */}
          <MapContainer
            center={[location.lat, location.lng]}
            zoom={14}
            className="h-full w-full "
          >

            <TileLayer
              attribution="© OpenStreetMap"
              className=""
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <Marker position={[location.lat, location.lng]} icon={icon}>
            </Marker>

          </MapContainer>

        </div>
      </div>

      <div className={`h-2/5 p-6 rounded-t-2xl fixed w-full z-10 bottom-0 bg-white transition-transform duration-500 ${captainDetailsPanelOpen ? 'translate-y-0' : 'translate-y-[80%]'}`}>

        <div
          onClick={() => setCaptainDetailsPanelOpen(!captainDetailsPanelOpen)}
          className="absolute top-0 left-0 w-full flex justify-center py-2 cursor-pointer hover:bg-gray-100 rounded-t-2xl"
        >
          <i className={`text-3xl text-gray-400 ri-arrow-${captainDetailsPanelOpen ? 'down' : 'up'}-wide-line`}></i>
        </div>

        <CaptainDetails />
      </div>
      <RidePopup ride={ride} acceptRideHandler={acceptRideHandler} setRidePopupPanel={setRidePopupPanel} ridePopupPanel={ridePopupPanel} />
      <ConfirmRidePopup ride={ride} confirmRidePopupPanel={confirmRidePopupPanel} setConfirmRidePopupPanel={setConfirmRidePopupPanel} />
    </div>
  );
};

export default CaptainHome;
