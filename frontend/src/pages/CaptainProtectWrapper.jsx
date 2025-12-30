import React, { useContext, useEffect, useState } from "react";
import { UserDataContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { CaptainDataContext } from "../context/CaptainContext";
import axios from "axios";

const CaptainProtectWrapper = ({ children }) => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const { captain, setCaptain } = useContext(CaptainDataContext);

  useEffect(() => {
    if (!token) navigate("/captain-login");
  }, [token]);

  axios
    .get(`${import.meta.env.VITE_BASE_URL}/captains/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => {
      if (response.status == 200) {
        setIsLoading(false);
        setCaptain(response.data.captain);
      }
    })
    .catch((err) => {
      console.log(err);
      localStorage.removeItem(token);
      navigate("/captain-login");
    });

  if (isLoading) {
    return <div>Loading</div>;
  }

  return <>{children}</>;
};

export default CaptainProtectWrapper;
