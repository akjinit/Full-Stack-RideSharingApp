import React, { useState } from "react";
import { Link } from "react-router-dom";

const CaptainLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [captainData, setCaptainData] = useState("{}");

  const submitHandler = (e) => {
    e.preventDefault();

    setCaptainData({
      email,
      password,
    });
  };

  return (
    <div className="p-7 flex h-screen flex-col justify-between">
      <div>
        <img className="w-23 mb-3" src="/uber_driver.svg" alt="" />
        <form action="" onSubmit={submitHandler}>
          <h3 className="text-lg text-medium mb-2">What's our Captain's email</h3>

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
