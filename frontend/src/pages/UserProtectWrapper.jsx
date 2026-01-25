import React, { useContext, useEffect, useState } from "react";
import { UserDataContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const UserProtectWrapper = ({ children }) => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const { user, setUser } = useContext(UserDataContext);

  useEffect(() => {
    const interval = setTimeout(async () => {
      if (!token) navigate("/login");

      else {
        axios
          .get(`${import.meta.env.VITE_BASE_URL}/users/profile`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((res) => {
            if (res.status == 200) {
              setUser(res.data);
              setIsLoading(false);
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    }, 5000);

    return () => {
      clearTimeout(interval);
    };
  }, [token]);

  return <>{isLoading ? <div>Loading...</div> : children}</>;
};

export default UserProtectWrapper;
