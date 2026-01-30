import axios from "axios";
import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CaptainDataContext } from "../context/CaptainContext";

const CaptainLogin = () => {
  const [email, setEmail] = useState("vishalsharma@gmail.com");
  const [password, setPassword] = useState("7777777");
  const { captain, setCaptain } = useContext(CaptainDataContext);
  const navigate = useNavigate();


  const submitHandler = async (e) => {
    e.preventDefault();

    const newCaptain = {
      email,
      password,
    };

    const response = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/captains/login`,
      newCaptain
    );

    if (response.status === 200) {
      const data = response.data;
      console.log("Captain logged in:", data.captain);
      setCaptain(data.captain);
      localStorage.setItem("token", data.token);
      navigate("/captain-home");
    }
  };

  return (
    <div className="p-7 flex h-screen flex-col justify-between">
      <div>
        <h1 className="text-4xl font-bold mb-3 text-black">rideShare</h1>
        <form action="" onSubmit={submitHandler}>
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
            className="bg-[#eeeeee] w-full mb-7 text-lg placeholder:text-base rounded px-2 py-2 "
            placeholder="email@example.com"
          />

          <h3 className="text-lg text-medium mb-2">Enter password</h3>

          <input
            type="password"
            className="bg-[#eeeeee] w-full mb-7 text-lg placeholder:text-base rounded px-2 py-2  "
            placeholder="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
          <button className="bg-black w-full mb-7 text-lg text-white  px-2 py-2 rounded">
            Login
          </button>
        </form>

        <p>Join a fleet?</p>
        <Link to={"/captain-signup"} className="text-blue-600">
          Register as a Captain
        </Link>
      </div>

      <div>
        <Link
          to={"/login"}
          className="bg-amber-400 flex justify-center w-full mb-7 text-lg text-white  px-2 py-2 rounded"
        >
          Sign in as User
        </Link>
      </div>
    </div>
  );
};

export default CaptainLogin;
