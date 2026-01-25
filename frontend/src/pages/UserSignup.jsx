import axios from "axios";
import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserDataContext } from "../context/UserContext";

const UserSignup = () => {
  const [email, setEmail] = useState("");
  const [firstName, setfirstName] = useState("");
  const [lastName, setlastName] = useState("");
  const [password, setPassword] = useState("");
  const [userData, setUserData] = useState("{}");

  const navigate = useNavigate();

  const { user, setUser } = useContext(UserDataContext);

  const submitHandler = async (e) => {
    e.preventDefault();
    const newUser = {
      fullName: {
        firstName,
        lastName,
      },
      email,
      password,
    };

    const response = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/users/register`,
      newUser
    );

    if (response.status === 201) {
      const data = response.data;
      setUser(data.user);
      localStorage.setItem("token", data.token);
      navigate("/home");
    }

    setfirstName("");
    setlastName("");
    setPassword("");
    setEmail("");
  };

  return (
    <div className="p-7 flex h-screen flex-col justify-between">
      <div>
        <h1 className="text-4xl font-bold mb-7 text-black">rideShare</h1>
        <form action="" onSubmit={submitHandler}>
          <h3 className="text-lg text-medium mb-2">What's your name</h3>
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
        Download the rideShare app now to request your first ride. Discounts
        applicable - (i) For cab rides- 25% discount (maximum discount of INR 75
        per ride) (ii) For moto rides- 50% discount (maximum discount of INR 50
        per ride)
      </p>
    </div>
  );
};

export default UserSignup;
