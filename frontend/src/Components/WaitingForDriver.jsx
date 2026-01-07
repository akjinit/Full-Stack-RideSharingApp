import React from "react";

const WaitingForDriver = (props) => {
  const waitingForDriver = props.waitingForDriver;
  const setWatingForDriver = props.setWatingForDriver;
  const ride = props.ride;

  const vehicleImageMap = {
    car: "car.png",
    motorcycle: "motorbike.webp",
    auto: "auto.webp"
  };

  const captain = ride?.captainId;
  return (
    <div
      className={` ${waitingForDriver ? "" : "translate-y-full"
        } w-full  fixed z-10 bottom-0 bg-white px-5 py-9 rounded-2xl transition`}
    >
      <h3 className="text-2xl font-semibold "> Waiting for {`${captain?.fullName.firstName}`} </h3>

      <div className="captain-details flex justify-between py-1 my-3 border-black border-3 bg-yellow-300 rounded-2xl px-2">

        <img src={vehicleImageMap[ride?.vehicleType]} className="w-28 " alt="" />
        <div className="text-right">
          <h2 className="text-lg font-medium">{`${captain?.fullName.firstName} ${captain?.fullName.lastName}`} </h2>
          <h4 className="text-2xl font-semibold -mt-1 -mb-1">{`${captain?.vehicle.plate}`}</h4>
          <p className="text-sm text-gray-500">Volkswagen</p>
        </div>
      </div>
      <div className="flex items-center text-xl gap-3 justify-end">
        <h3 className=" font-semibold "> OTP  </h3>
        <p className="text-gray-700 t">
          {ride?.OTP?.split('').join('-')}
        </p>
      </div>

      <div className="flex flex-col justify-center gap-5">
        <div className="flex gap-5 p-2 border-b border-gray-300">
          <img src="map-location.svg" className="w-5" alt="" />
          <div>
            <h3 className="text-lg font-medium">{ride?.origin}</h3>

          </div>
        </div>
        <div className="flex gap-5 p-2 border-b-2 border-gray-300">
          <img src="map-user.svg" className="w-5" alt="" />
          <div>
            <h3 className="text-lg font-medium">{ride?.destination}</h3>
          </div>
        </div>
        <div className="flex gap-5 p-2 border-b-2 border-gray-300">
          <img src="cash-fill.svg" className="w-5" alt="" />
          <div>
            <h3 className="text-lg font-medium">{`₹${ride?.fare}`}</h3>
            <p className="text-gray-600 text-sm">Card, Cash</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WaitingForDriver;
