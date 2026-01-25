import React from "react";

const LookingForDriver = (props) => {
  const lookingForDriverPanel = props.lookingForDriverPanel;
  const ride = props.ride;

  const vehicleImageMap = {
    car: "car.png",
    motorcycle: "motorbike.webp",
    auto: "auto.webp"
  };

 
  return (
    <div
      className={` ${lookingForDriverPanel ? "" : "translate-y-full"
        } w-full  fixed z-10 bottom-0 bg-white px-5 py-9 rounded-2xl transition`}
    >
      <h3 className="text-2xl font-semibold mb-5">Finding Drivers</h3>
      {ride ? (
        <div className="flex flex-col justify-center gap-5">
          <div className="flex justify-center mb-3">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-yellow-400"></div>
          </div>
          <img src={vehicleImageMap[ride.vehicleType] || "car.png"} className="w-30 mt-4 m-auto" alt="" />

          <div>
            <div className="flex gap-5 p-2 border-b border-gray-300">
              <img src="map-location.svg" className="w-5" alt="" />
              <div>
                <h3 className="text-lg font-medium">{ride.origin}</h3>

              </div>
            </div>
            <div className="flex gap-5 p-2 border-b-2 border-gray-300">
              <img src="map-user.svg" className="w-5" alt="" />
              <div>
                <h3 className="text-lg font-medium">{ride.destination}</h3>

              </div>
            </div>
            <div className="flex gap-2 p-2 border-b-2 border-gray-300">
              <img src="cash-fill.svg" className="w-5" alt="" />
              <div>
                <h3 className="text-lg font-medium">{"₹" + ride.fare}</h3>
                <p className="text-gray-600 text-sm">Card, Cash</p>
              </div>
              <div className="ml-auto text-right gap-1">
                <h3 className="text-black font-medium text-medium">{(ride.duration / 60).toFixed(2) + " minutes"}</h3>
                <h3 className="text-black font-medium text-medium">{(ride.distance / 1000).toFixed(2) + " kilometers"}</h3>
              </div>
            </div>
          </div>
        </div>) : (<div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>)}
    </div>
  );
};

export default LookingForDriver;
