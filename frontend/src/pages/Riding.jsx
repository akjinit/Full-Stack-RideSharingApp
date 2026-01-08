import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { SocketDataContext } from "../context/SocketContext";
import { useContext } from "react";

const vehicleImageMap = {
  car: "car.png",
  motorcycle: "motorbike.webp",
  auto: "auto.webp"
};

const Riding = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [ride, setRide] = useState(null);
  const { sendMessage, recieveMessage, socket } = useContext(SocketDataContext);


  useEffect(() => {
    if (location.state?.ride) {
      setRide(location.state.ride);
    } else {
      // refresh or direct access
      navigate("/home");
    }
  }, []);


  useEffect(() => {
    if (socket) {
      recieveMessage('ride-ended', (ride) => {
        navigate('/home');
      });
    }
  }, [socket]);


  if (!ride) {
    return (
      <div className="h-screen flex items-center justify-center">
        Loading ride...
      </div>
    );
  }
  console.log(ride)
  return (
    <div className="h-screen">
      {/* MAP */}
      <div className="h-1/2">
        <Link to="/home">
          <img
            src="home-line.svg"
            className="fixed left-2 top-2 w-9 bg-gray-100 rounded-full p-2"
            alt=""
          />
        </Link>

        <img
          src="https://miro.medium.com/v2/resize:fit:1400/0*gwMx05pqII5hbfmX.gif"
          alt=""
          className="h-full w-full object-cover"
        />
      </div>

      {/* RIDE INFO */}
      <div className="h-1/2 p-4">
        <h3 className="text-2xl font-semibold mb-5">
          Ride Ongoing
        </h3>

        {/* Captain details */}
        <div className="flex justify-between items-center">
          <img src={vehicleImageMap[ride.vehicleType]} className="w-28" alt="" />

          <div className="text-right">
            <h2 className="text-lg font-medium">
              {ride.captainId?.fullName.firstName || "Captain"}
            </h2>
            <h4 className="text-2xl font-semibold -mt-1 -mb-1">
              {ride.captainId.vehicle.plate || "—"}
            </h4>
            <p className="text-sm text-gray-500">
              {ride?.vehicleType || "Vehicle"}
            </p>
          </div>
        </div>

        {/* Route */}
        <div className="flex flex-col gap-5 mt-4">
          <div className="flex gap-5 p-2 border-b-2 border-gray-300">
            <img src="map-user.svg" className="w-5" alt="" />
            <div>
              <h3 className="text-lg font-medium">
                {ride.destination}
              </h3>
            </div>
          </div>

          {/* Payment */}
          <div className="flex gap-5 p-2">
            <img src="cash-fill.svg" className="w-5" alt="" />
            <div>
              <h3 className="text-lg font-medium">
                ₹{ride.fare}
              </h3>
              <p className="text-gray-600 text-sm">
                {ride.paymentMethod || "Cash / Card"}
              </p>
            </div>
          </div>
        </div>

        <button className=" mb-5 w-full mt-4 bg-green-400 p-3 text-white font-semibold rounded">
          Make a Payment
        </button>
      </div>
    </div>
  );
};

export default Riding;
