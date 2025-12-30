import React, { useState } from "react";
import LocationSearchPanel from "../Components/LocationSearchPanel";
import VehiclePanel from "../Components/VehiclePanel";
import ConfirmVehicle from "../Components/ConfirmVehicle";

const Home = () => {
  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");
  const [pickupPanelOpen, setpickupPanelClose] = useState(true); //for the pickup panel -> true minimised

  const [vehiclePanelOpen, setvehiclePanelOpen] = useState(false);
  const [confirmVehiclePanel, setConfirmVehiclePanel] = useState(false);

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
            className={`w-6 absolute left-[47%] top-1  ${
              pickupPanelOpen ? "hidden" : ""
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
              value={destination}
              onChange={(e) => {
                setDestination(e.target.value);
              }}
            />
          </form>
        </div>
        <div className={`bg-white h-[70%] ${pickupPanelOpen ? "hidden" : ""}`}>
          <LocationSearchPanel
            setvehiclePanelOpen={setvehiclePanelOpen}
            setpickupPanelClose={setpickupPanelClose}
          />
        </div>
      </div>

      {/* vehicles */}
      <VehiclePanel
        setvehiclePanelOpen={setvehiclePanelOpen}
        vehiclePanelOpen={vehiclePanelOpen}
        setConfirmVehiclePanel={setConfirmVehiclePanel}
      />

      <ConfirmVehicle
        confirmVehiclePanel={confirmVehiclePanel}
        setConfirmVehiclePanel={setConfirmVehiclePanel}
      />
    </div>
  );
};

export default Home;
