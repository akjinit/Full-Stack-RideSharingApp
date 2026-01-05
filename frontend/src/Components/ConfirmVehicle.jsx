import React from "react";

const ConfirmVehicle = (props) => {
  const confirmVehiclePanel = props.confirmVehiclePanel;
  const setConfirmVehiclePanel = props.setConfirmVehiclePanel;
  const setlookingForDriverPanel = props.setlookingForDriverPanel;
  const selectedVehicle = props.selectedVehicle;

  const fareDetails = props.fareDetails;
  const pickup = props.pickup;
  const destination = props.destination;
  const createRide = props.createRide;

  const vehicleImageMap = {
    car: "car.png",
    motorcycle: "motorbike.webp",
    auto: "auto.webp"
  };

  return (
    <div
      className={` ${
        confirmVehiclePanel ? "" : "translate-y-full"
      } w-full  fixed z-10 bottom-0 bg-white px-5 py-9 rounded-2xl transition`}
    >
      <h3 className="text-2xl font-semibold "> Confirm Your Ride </h3>
      <div className="flex flex-col justify-center gap-5">
        <img src={vehicleImageMap[selectedVehicle]} className="w-30 mt-4 m-auto" alt="" />

        <div>
          <div className="flex gap-5 p-2 border-b border-gray-300">
            <img src="map-location.svg" className="w-5" alt="" />
            <div>
              <h3 className="text-lg font-medium">{pickup}</h3>
              
            </div>
          </div>
          <div className="flex gap-5 p-2 border-b-2 border-gray-300">
            <img src="map-user.svg" className="w-5" alt="" />
            <div>
              <h3 className="text-lg font-medium">{destination}</h3>
             
            </div>
          </div>
          <div className="flex gap-5 p-2 border-b-2 border-gray-300">
            <img src="cash-fill.svg" className="w-5" alt="" />
            <div>
              <h3 className="text-lg font-medium">{`₹${fareDetails[selectedVehicle]}`}</h3>
              <p className="text-gray-600 text-sm">Card, Cash</p>
            </div>
          </div>
        </div>

        <button
          onClick={() => {
            setConfirmVehiclePanel(false);
            setlookingForDriverPanel(true);
            createRide(selectedVehicle);
          }}
          className="w-full bg-green-400 p-2 text-white font-semibold"
        >
          Confirm
        </button>
      </div>
    </div>
  );
};

export default ConfirmVehicle;
