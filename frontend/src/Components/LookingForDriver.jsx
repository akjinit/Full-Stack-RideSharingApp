import React from "react";

const LookingForDriver = (props) => {
  const lookingForDriverPanel = props.lookingForDriverPanel;
  return (
    <div
      className={` ${
        lookingForDriverPanel ? "" : "translate-y-full"
      } w-full  fixed z-10 bottom-0 bg-white px-5 py-9 rounded-2xl transition`}
    >
      
      <h3 className="text-2xl font-semibold "> Looking for a driver </h3>
      <div className="flex flex-col justify-center gap-5">
        <img src="car.png" className="w-40 m-auto" alt="" />

        <div>
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
    </div>
  );
};

export default LookingForDriver;
