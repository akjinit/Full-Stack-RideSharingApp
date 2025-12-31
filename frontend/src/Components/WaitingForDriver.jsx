import React from "react";

const WaitingForDriver = (props) => {
  const waitingForDriver = props.waitingForDriver;
  const setWatingForDriver = props.setWatingForDriver;
  
  return (
    <div
      className={` ${
        waitingForDriver ? "" : "translate-y-full"
      } w-full  fixed z-10 bottom-0 bg-white px-5 py-9 rounded-2xl transition`}
    >
      <div className="captain-details flex justify-between">
        <img src="car.png" className="w-28 " alt="" />
        <div className="text-right">
          <h2 className="text-lg font-medium">Sarthak </h2>
          <h4 className="text-2xl font-semibold -mt-1 -mb-1">MP04 AB 9890</h4>
          <p className="text-sm text-gray-500">Volkswagen</p>
        </div>
      </div>

      <div className="flex flex-col justify-center gap-5">
        <div className="flex gap-5 p-2 border-b border-gray-300">
          <img src="map-location.svg" className="w-5" alt="" />
          <div>
            <h3 className="text-lg font-medium">562/11-A</h3>
            <p className="text-gray-600 text-sm">
              Kaikodhali, Bengaluru, Karnataka
            </p>
          </div>
        </div>
        <div className="flex gap-5 p-2 border-b-2 border-gray-300">
          <img src="map-user.svg" className="w-5" alt="" />
          <div>
            <h3 className="text-lg font-medium">562/11-A</h3>
            <p className="text-gray-600 text-sm">
              Kaikodhali, Bengaluru, Karnataka
            </p>
          </div>
        </div>
        <div className="flex gap-5 p-2 border-b-2 border-gray-300">
          <img src="cash-fill.svg" className="w-5" alt="" />
          <div>
            <h3 className="text-lg font-medium">562/11-A</h3>
            <p className="text-gray-600 text-sm">Card, Cash</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WaitingForDriver;
