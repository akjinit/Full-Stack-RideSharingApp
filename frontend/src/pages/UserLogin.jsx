import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserDataContext } from "../context/UserContext";
import axios from "axios";

const UserLogin = () => {
  const [email, setEmail] = useState("akshatjha5787@gmail.com");
  const [password, setPassword] = useState("57878787");
  const [userData, setUserData] = useState("{}");

  const navigate = useNavigate();
  const { user, setUser } = useContext(UserDataContext);

  const submitHandler = async (e) => {
    e.preventDefault();

    const newUserLoginData = {
      email,
      password,
    };

    const response = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/users/login`,
      newUserLoginData
    );
    if (response.status === 200) {
      const data = response.data;
      setUser(data.user);
      localStorage.setItem('token',data.token);
      navigate("/home");
    }

    setEmail("");
    setPassword("");
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
          <h3
            className="
          text-lg text-medium
          mb-2"
          >
            What's your email
          </h3>

          <input
            required
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            className="bg-[#eeeeee] w-full mb-7 text-lg placeholder:text-base rounded px-2 py-2  "
            placeholder="email@example.com"
          />

          <h3
            className="
        text-lg text-medium
        mb-2 
        "
          >
            Enter password
          </h3>

          <input
            type="password"
            className="bg-[#eeeeee] w-full mb-7 text-lg placeholder:text-base rounded px-2 py-2 "
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

        <p>New here?</p>
        <Link to={"/signup"} className="text-blue-600">
          Create new account
        </Link>
      </div>

      <div>
        <Link
          to={"/captain-login"}
          className="bg-[#33ba72] flex justify-center w-full mb-7 text-lg text-white  px-2 py-2 rounded"
        >
          Sign in as Captain
        </Link>
      </div>
    </div>
  );
};

export default UserLogin;
