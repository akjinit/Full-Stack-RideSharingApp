import React, { useState } from "react";
import LocationSearchPanel from "../Components/LocationSearchPanel";
import VehiclePanel from "../Components/VehiclePanel";
import ConfirmVehicle from "../Components/ConfirmVehicle";
import WaitingForDriver from "../Components/WaitingForDriver";
import LookingForDriver from "../Components/LookingForDriver";
import axios from "axios";
import { useEffect } from "react";

const Home = () => {
  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");
  const [pickupPanelOpen, setpickupPanelClose] = useState(true); //for the pickup panel -> true minimised

  const [vehiclePanelOpen, setvehiclePanelOpen] = useState(false);
  const [confirmVehiclePanel, setConfirmVehiclePanel] = useState(false);
  const [lookingForDriverPanel, setlookingForDriverPanel] = useState(false);
  const [waitingForDriver, setWatingForDriver] = useState(false);

  const [pickupInputFocused, setPickupInputFocused] = useState(false);
  const [destinationInputFocused, setDestinationInputFocused] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [fare, setFare] = useState({});


  const fetchSuggestions = async (query) => {
    try {
      const response = await axios.get(`http://localhost:4000/maps/get-suggestions`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        params: {
          input: query,
        }
      });
      const addresses = response.data.map((item) => item.description);
      setSuggestions(addresses);
    } catch (err) {
      console.log("Error fetching suggestions:", err);
    }
  }

  const fetchFareEstimate = async (origin, destination) => {
    try {
      const response = await axios.get(`http://localhost:4000/rides/fare-estimate`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        params: {
          origin,
          destination,
        }
      });

      return response.data;
    } catch (err) {
      console.log("Error fetching fare estimate:", err);
    }
  }

  const createRide = async (vehicleType) => {
    try {
      const response = await axios.post(`http://localhost:4000/rides/create`, {
        pickup,
        destination,
        vehicleType,
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
    }
    catch (err) {
      console.log("Error creating ride frontend:", err);
    }
  }

  useEffect(() => {
    if (!pickup) {
      return;
    }

    const timer = setTimeout(async () => {
      fetchSuggestions(pickup);
    }, 700);

    return () => {
      clearTimeout(timer);
    }
  }, [pickup]);


  useEffect(() => {
    if (!destination) {
      return;
    }

    const timer = setTimeout(async () => {
      fetchSuggestions(destination);
    }, 700);

    return () => {
      clearTimeout(timer);
    }
  }, [destination]);


  const submitHandler = (e) => {
    e.preventDefault();
  };

  return (
    <div className="relative h-full">
      <img
        className="w-30 absolute "
        src="https://download.logo.wine/logo/Uber/Uber-Logo.wine.png"
        alt=""
      />

      <div className="h-screen w-screen">
        {/* image for temp use */}
        <img
          src="https://miro.medium.com/v2/resize:fit:1400/0*gwMx05pqII5hbfmX.gif"
          alt=""
          className="h-full w-full object-cover "
        />
      </div>

      <div className=" flex flex-col justify-end h-screen bottom-0 absolute w-full">
        <div className="min-h-[20%] p-4 bg-white relative rounded-t-2xl">
          <img
            onClick={() => {
              setpickupPanelClose(true);
            }}
            src="arrow-down-wide-line.svg"
            className={`w-6 absolute left-[47%] top-1  ${pickupPanelOpen ? "hidden" : ""
              }`}
            alt=""
          />

          <h4 className="text-[28px] font-semibold tracking-tighter">
            Find a trip
          </h4>
          <form
            onSubmit={(e) => {
              submitHandler(e);
            }}
          >
            <input
              className="bg-[#eee] px-12 py-3 text-base rounded-lg w-full mt-3"
              type="text"
              placeholder="Add a picup location"
              onClick={() => {
                setpickupPanelClose(false);
              }}

              onFocus={() => {
                setPickupInputFocused(true);
                setDestinationInputFocused(false);
              }}
              value={pickup}
              onChange={(e) => {
                setPickup(e.target.value);
              }}
            />
            <input
              className="bg-[#eee] px-12 py-3 text-base rounded-lg w-full mt-3"
              type="text"
              placeholder="Enter your destination"
              onClick={() => {
                setpickupPanelClose(false);
              }}
              onFocus={() => {
                setDestinationInputFocused(true)
                setPickupInputFocused(false);
              }
              }

              value={destination}
              onChange={(e) => {
                setDestination(e.target.value);
              }}
            />
          </form>
        </div>
        <div className={`bg-white h-[70%] flex flex-col ${pickupPanelOpen ? "hidden" : ""}`}>
          <button className="  bg-black p-2 mx-3.5 rounded-md mb-2 text-white font-semibold" onClick={async () => {
            const fareDetails = await fetchFareEstimate(pickup, destination);
            setFare(fareDetails);
            setvehiclePanelOpen(true);
            setpickupPanelClose(true);
          }} >

            Confirm Pickup
          </button>
          <LocationSearchPanel
            pickupInputFocused={pickupInputFocused}
            destinationInputFocused={destinationInputFocused}
            suggestions={suggestions}
            setPickup={setPickup}
            setDestination={setDestination}
          />
        </div>
      </div>

      {/* vehicles */}
      <VehiclePanel
        setvehiclePanelOpen={setvehiclePanelOpen}
        vehiclePanelOpen={vehiclePanelOpen}
        setConfirmVehiclePanel={setConfirmVehiclePanel}
        fareDetails={fare}
        createRide={createRide}
      />

      <ConfirmVehicle
        confirmVehiclePanel={confirmVehiclePanel}
        setConfirmVehiclePanel={setConfirmVehiclePanel}
        setlookingForDriverPanel={setlookingForDriverPanel}
      />

      <WaitingForDriver waitingForDriver={waitingForDriver} setWatingForDriver={setWatingForDriver} />
      <LookingForDriver setlookingForDriverPanel={setlookingForDriverPanel} lookingForDriverPanel={lookingForDriverPanel} />
    </div>
  );
};

export default Home;
