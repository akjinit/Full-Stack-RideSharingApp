import React, { useState } from "react";
import { Link } from "react-router-dom";

const UserSignup = () => {
  const [email, setEmail] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [password, setPassword] = useState("");
  const [userData, setUserData] = useState("{}");

  const submitHandler = (e) => {
    e.preventDefault();
    setUserData({
      fullName: {
        firstname,
        lastname,
      },
      email,
      password,
    });

    setFirstname("");
    setLastname("");
    setPassword("");
    setEmail("");
  };

  return (
    <div className="p-7 flex h-screen flex-col justify-between">
      <div>
        <img
          className="w-23 mb-7"
          src="https://download.logo.wine/logo/Uber/Uber-Logo.wine.png"
          alt=""
        />
        <form action="" onSubmit={submitHandler}>
          <h3 className="text-lg text-medium mb-2">What's your name</h3>
          <div className="flex name gap-4 mb-5">
            <input
              required
              type="text"
              value={firstname}
              onChange={(e) => {
                setFirstname(e.target.value);
              }}
              className="bg-[#eeeeee] w-1/2 text-base placeholder:text-base rounded px-2 py-2  "
              placeholder="First name"
            />

            <input
              type="text"
              value={lastname}
              onChange={(e) => {
                setLastname(e.target.value);
              }}
              className="bg-[#eeeeee] w-1/2 text-base placeholder:text-base rounded px-2 py-2  "
              placeholder="Last name"
            />
          </div>

          <h3 className="text-lg text-medium mb-2">What's your email</h3>

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
          <button className="bg-black w-full mb-5 text-lg text-white  px-2 py-2 rounded">
            SignUp
          </button>
        </form>

        <p>Already have an account?</p>
        <Link to={"/login"} className="text-blue-600">
          Login here
        </Link>
      </div>

      <p className="text-[9px] tracking-tight">
        Limited-period offer- Discount on first 5 trips (cab or moto) completed
        within 15 days of signing up. The offer is valid only for first-time
        users only. The promotion shall apply automatically to eligible rides.
        Download the Uber app now to request your first ride. Discounts
        applicable - (i) For cab rides- 25% discount (maximum discount of INR 75
        per ride) (ii) For moto rides- 50% discount (maximum discount of INR 50
        per ride)
      </p>
    </div>
  );
};

export default UserSignup;
