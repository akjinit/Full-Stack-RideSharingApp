import React, { useContext, useState } from "react";
import LocationSearchPanel from "../Components/LocationSearchPanel";
import VehiclePanel from "../Components/VehiclePanel";
import ConfirmVehicle from "../Components/ConfirmVehicle";
import WaitingForDriver from "../Components/WaitingForDriver";
import LookingForDriver from "../Components/LookingForDriver";
import axios from "axios";
import { useEffect } from "react";
import { SocketDataContext } from "../context/SocketContext";
import { UserDataContext } from "../context/UserContext";
import { useNavigate, Link } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from 'leaflet'


const vehicleImageMap = {
  location: "./location-marker.png",
  car: "car.png",
  motorcycle: "motorbike.webp",
  auto: "auto.webp"
};


const leafLetIcons = {};

for (const key in vehicleImageMap) {
  leafLetIcons[key] = L.icon({
    iconUrl: vehicleImageMap[key],
    iconSize: key !== "location" ? [60, 40] : [70, 70],
    iconAnchor: key !== "location" ? [30, 20] : [35, 35],
  })
}


const Home = () => {
  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");
  const [pickupPanelOpen, setpickupPanelClose] = useState(true); //for the pickup panel -> true minimised

  const [vehiclePanelOpen, setvehiclePanelOpen] = useState(false);
  const [confirmVehiclePanel, setConfirmVehiclePanel] = useState(false);
  const [lookingForDriverPanel, setlookingForDriverPanel] = useState(false);
  const [waitingForDriver, setWatingForDriver] = useState(false);

  const [pickupInputFocused, setPickupInputFocused] = useState(false);
  const [destinationInputFocused, setDestinationInputFocused] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [fare, setFare] = useState({});
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [location, setLocation] = useState({ lat: 22.961074, lng: 88.433524 });
  const [drivers, setDrivers] = useState([]);
  const navigate = useNavigate();
  const { sendMessage, recieveMessage, socket } = useContext(SocketDataContext);

  const { user } = useContext(UserDataContext);
  const [ride, setRide] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  console.log(user);
  const updateLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        setLocation({
          lat: latitude,
          lng: longitude
        })
      }, (err) => {
        console.error("Error getting location:", err);
      });
    }
  }

  const fetchActiveRide = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/rides/active-ride/user`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (response.data) {
        setRide(response.data);
        console.log(response.data);
      }
    } catch (err) {
      console.log("Error fetching active ride:", err.message);
    }
  }

  const fetchNearbyDrivers = async (location) => {
    try {
      const captains = await axios.get(`${import.meta.env.VITE_BASE_URL}/users/get-nearby-captains`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        params: {
          lat: location.lat,
          lng: location.lng
        }
      });
      setDrivers(captains.data);
    }
    catch (err) {
      console.log("Error fetching location:", err);
    }
  }

  const createRide = async (vehicleType) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/rides/create`, {
        origin: pickup,
        destination,
        vehicleType,
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setRide(response.data);
    }
    catch (err) {
      console.log("Error creating ride frontend:", err);
    }
  }

  const fetchSuggestions = async (query) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/maps/get-suggestions`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        params: {
          input: query,
        }
      });
      const addresses = response.data.map((item) => item.description);
      setSuggestions(addresses);
    } catch (err) {
      console.log("Error fetching suggestions:", err);
    }
  }

  const fetchFareEstimate = async (origin, destination) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/rides/fare-estimate`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        params: {
          origin,
          destination,
        }
      });

      return response.data;
    } catch (err) {
      console.log("Error fetching fare estimate:", err);
    }
  }

  // Initial load - check for active ride immediately
  useEffect(() => {
    if (user?._id) {
      fetchActiveRide();
      updateLocation();
    }
  }, [user]);

  // Handle ride status display
  useEffect(() => {
    if (ride) {
      if (ride.status === 'requested') {
        setlookingForDriverPanel(true);
        setWatingForDriver(false);
      } else if (ride.status === 'accepted') {
        setlookingForDriverPanel(false);
        setWatingForDriver(true);
      } else if (ride.status === 'in_progress') {
        navigate('/riding');
      }
    }
  }, [ride, navigate]);

  useEffect(() => {  //socket effects
    if (user?._id) {
      sendMessage('join', { userType: "user", userId: user._id });
    }
    if (socket) {
      recieveMessage('ride-accepted', (ride) => {
        setlookingForDriverPanel(false);
        setWatingForDriver(true);
        setRide(ride);
      });

      recieveMessage('ride-started', (ride) => {
        setWatingForDriver(false);

        navigate('/riding');
      });
    }
  }, [socket, user]);   //all socket stuff


  useEffect(() => {
    updateLocation();
    const locationInterval = setInterval(() => {
      updateLocation();
    }, 10000);

    return () => clearInterval(locationInterval);
  }, []);


  useEffect(() => {
    // Only poll nearby drivers if not actively riding
    const driverInterval = setInterval(() => {
      if (!ride || (ride && ride.status === 'requested')) {
        fetchNearbyDrivers(location);
      }
    }, 10000);

    return () => clearInterval(driverInterval);
  }, [ride, location]);



  useEffect(() => {  //pickup recomendation
    if (!pickup) {
      return;
    }

    const timer = setTimeout(async () => {
      fetchSuggestions(pickup);
    }, 500);

    return () => {
      clearTimeout(timer);
    }
  }, [pickup]);


  useEffect(() => {//destination recomendation
    if (!destination) {
      return;
    }

    const timer = setTimeout(async () => {
      fetchSuggestions(destination);
    }, 500);

    return () => {
      clearTimeout(timer);
    }
  }, [destination]);


  const submitHandler = (e) => {
    e.preventDefault();
  };

  return (
    <div className="relative h-screen">
      <img
        className="w-30 absolute left-5 top-5"
        src="https://download.logo.wine/logo/Uber/Uber-Logo.wine.png"
        alt=""
      />

      <Link to="/user/logout" className="fixed right-2 top-2 h-10 w-10 bg-white flex items-center justify-center rounded-full">
        <i className="text-lg font-medium ri-logout-box-r-line"></i>
      </Link>

      <div className="h-screen w-screen absolute z-0">
        {/* image for temp use */}
        <MapContainer
          center={[location.lat, location.lng]}
          zoom={14}
          className="h-full w-full "
        >

          <TileLayer
            attribution="© OpenStreetMap"
            className=""
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <Marker position={[location.lat, location.lng]} icon={leafLetIcons.location}>
          </Marker>


          {drivers.map((d) => {
            return (<Marker key={d._id} position={[d.location.coordinates[1], d.location.coordinates[0]]} icon={leafLetIcons[d.vehicle.vehicleType]}></Marker>)
          })}

          {/* captainId,
              vehicle,
              lat: latitude,
              lng: longitude,
              lastSeen: Date.now() */}

        </MapContainer>


      </div>

      <div className=" flex  flex-col justify-end h-screen bottom-0 absolute w-full">
        <div className=" min-h-[20%] p-4 bg-white relative rounded-t-2xl">
          <img
            onClick={() => {
              setpickupPanelClose(true);
            }}
            src="arrow-down-wide-line.svg"
            className={`w-6 absolute left-[47%] top-1  ${pickupPanelOpen ? "hidden" : ""
              }`}
            alt=""
          />

          <h4 className="text-[28px] font-semibold tracking-tighter">
            Find a trip
          </h4>
          <form
            onSubmit={(e) => {
              submitHandler(e);
            }}
          >
            <input
              className="bg-[#eee] px-12 py-3 text-base rounded-lg w-full mt-3"
              type="text"
              placeholder="Add a picup location"
              onClick={() => {
                setpickupPanelClose(false);
              }}

              onFocus={() => {
                setPickupInputFocused(true);
                setDestinationInputFocused(false);
              }}
              value={pickup}
              onChange={(e) => {
                setPickup(e.target.value);
              }}
            />
            <input
              className="bg-[#eee] px-12 py-3 text-base rounded-lg w-full mt-3"
              type="text"
              placeholder="Enter your destination"
              onClick={() => {
                setpickupPanelClose(false);
              }}
              onFocus={() => {
                setDestinationInputFocused(true)
                setPickupInputFocused(false);
              }
              }

              value={destination}
              onChange={(e) => {
                setDestination(e.target.value);
              }}
            />
          </form>
        </div>
        <div className={`bg-white h-[70%] flex flex-col ${pickupPanelOpen ? "hidden" : ""}`}>
          <button className="  bg-black p-2 mx-3.5 rounded-md mb-2 text-white font-semibold" onClick={async () => {
            const fareDetails = await fetchFareEstimate(pickup, destination);
            setFare(fareDetails);
            setvehiclePanelOpen(true);
            setpickupPanelClose(true);
          }} >

            Confirm Pickup
          </button>
          <LocationSearchPanel
            pickupInputFocused={pickupInputFocused}
            destinationInputFocused={destinationInputFocused}
            suggestions={suggestions}
            setPickup={setPickup}
            setDestination={setDestination}
          />
        </div>
      </div>

      <VehiclePanel
        setvehiclePanelOpen={setvehiclePanelOpen}
        vehiclePanelOpen={vehiclePanelOpen}
        setConfirmVehiclePanel={setConfirmVehiclePanel}
        fareDetails={fare}
        setSelectedVehicle={setSelectedVehicle}
      />

      <ConfirmVehicle
        selectedVehicle={selectedVehicle}
        fareDetails={fare}
        pickup={pickup}
        destination={destination}

        confirmVehiclePanel={confirmVehiclePanel}
        setConfirmVehiclePanel={setConfirmVehiclePanel}
        setlookingForDriverPanel={setlookingForDriverPanel}
        createRide={createRide}
      />

      <WaitingForDriver
        waitingForDriver={waitingForDriver}
        ride={ride}
      />
      <LookingForDriver
        lookingForDriverPanel={lookingForDriverPanel}
        ride={ride}
      />
    </div>
  );
};

export default Home;
