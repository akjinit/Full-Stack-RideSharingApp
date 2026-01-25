import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CaptainDataContext } from "../context/CaptainContext";
import axios from "axios";

const CaptainSignup = () => {
  const [email, setEmail] = useState("");
  const [firstName, setfirstName] = useState("");
  const [lastName, setlastName] = useState("");
  const [password, setPassword] = useState("");
  const [vehicleColor, setVehicleColor] = useState("");
  const [vehiclePlate, setVehiclePlate] = useState("");
  const [vehicleCapacity, setVehicleCapacity] = useState("");
  const [vehicleType, setVehicleType] = useState("");

  const { captain, setCaptain } = useContext(CaptainDataContext);
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    const newCaptain = {
      fullName: {
        firstName,
        lastName,
      },
      email,
      password,
      vehicle: {
        color: vehicleColor,
        plate: vehiclePlate,
        capacity: vehicleCapacity,
        vehicleType,
      },
    };

    const response = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/captains/register`,
      newCaptain
    );

    if (response.status === 201) {
      const data = response.data;
      setCaptain(data.captain);
      localStorage.setItem("token", data.token);
      navigate("/captain-home");
    }

    setfirstName("");
    setlastName("");
    setPassword("");
    setEmail("");
    setVehicleColor("");
    setVehiclePlate("");
    setVehicleCapacity("");
    setVehicleType("");
  };

  return (
    <div className="p-7 flex h-screen flex-col justify-between">
      <div>
        <h1 className="text-4xl font-bold mb-3 text-black">rideShare</h1>
        <form action="" onSubmit={submitHandler}>
          <h3 className="text-lg text-medium mb-2">
            What's our Captain's name
          </h3>
          <div className="flex name gap-4 mb-5">
            <input
              required
              type="text"
              value={firstName}
              onChange={(e) => {
                setfirstName(e.target.value);
              }}
              className="bg-[#eeeeee] w-1/2 text-base placeholder:text-base rounded px-2 py-2  "
              placeholder="First name"
            />

            <input
              type="text"
              value={lastName}
              onChange={(e) => {
                setlastName(e.target.value);
              }}
              className="bg-[#eeeeee] w-1/2 text-base placeholder:text-base rounded px-2 py-2  "
              placeholder="Last name"
            />
          </div>

          <h3 className="text-lg text-medium mb-2">
            What's our Captain's email
          </h3>

          <input
            required
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            className="bg-[#eeeeee] w-full mb-5 text-base placeholder:text-base rounded px-2 py-2 "
            placeholder="email@example.com"
          />

          <h3 className="text-lg text-medium mb-2">Enter password</h3>

          <input
            type="password"
            className="bg-[#eeeeee] w-full mb-5 text-base placeholder:text-base rounded px-2 py-2  "
            placeholder="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />

          <h3 className="text-lg font-semibold mb-4">Vehicle Information</h3>

          <div className="flex gap-4 mb-5">
            <input
              required
              type="text"
              value={vehicleColor}
              onChange={(e) => {
                setVehicleColor(e.target.value);
              }}
              className="bg-[#eeeeee] w-1/2 text-base placeholder:text-base rounded px-2 py-2 "
              placeholder="Vehicle Color"
            />

            <input
              required
              type="text"
              value={vehiclePlate}
              onChange={(e) => {
                setVehiclePlate(e.target.value);
              }}
              className="bg-[#eeeeee] w-1/2 text-base placeholder:text-base rounded px-2 py-2 "
              placeholder="Vehicle Plate"
            />
          </div>

          <div className="flex gap-4 mb-5">
            <input
              required
              type="number"
              value={vehicleCapacity}
              onChange={(e) => {
                setVehicleCapacity(e.target.value);
              }}
              className="bg-[#eeeeee] w-1/2 text-base placeholder:text-base rounded px-2 py-2 "
              placeholder="Vehicle Capacity"
            />

            <select
              required
              value={vehicleType}
              onChange={(e) => {
                setVehicleType(e.target.value);
              }}
              className="bg-[#eeeeee] w-1/2 text-base placeholder:text-base rounded px-2 py-2 "
            >
              <option value="">Select Vehicle Type</option>
              <option value="car">Car</option>
              <option value="bike">Bike</option>
              <option value="auto">Auto</option>
            </select>
          </div>

          <button className="bg-black w-full mb-5 text-lg text-white  px-2 py-2 rounded">
            Create Captain Account
          </button>
        </form>

        <p className="mt-2">Already have an account?</p>
        <Link to={"/captain-login"} className="text-blue-600">
          Login here
        </Link>
      </div>

      <p className="mt-10 text-[9px] pb-3 tracking-tight">
        Join the millions of riders who trust rideShare for their everyday travel
        needs. Get doorstep pickup and dropoff to your chosen destination at the
        tap of a button. Select from a wide range of affordable options, such as
        rideShare Auto, rideShare Moto, and Cabs.
      </p>
    </div>
  );
};

export default CaptainSignup;
