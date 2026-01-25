import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { SocketDataContext } from "../context/SocketContext";
import { useContext } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import L from 'leaflet';
import axios from "axios";

const vehicleImageMap = {
  car: "car.png",
  motorcycle: "motorbike.webp",
  auto: "auto.webp"
};

// Component to handle map recentering
const MapRecenter = ({ captainLocation, userLocation }) => {
  const map = useMap();

  useEffect(() => {
    if (captainLocation) {
      map.setView([captainLocation.lat, captainLocation.lng], 14);
    } else if (userLocation) {
      map.setView([userLocation.lat, userLocation.lng], 14);
    }
  }, [captainLocation, userLocation, map]);

  return null;
};

const Riding = () => {
  const navigate = useNavigate();

  const [ride, setRide] = useState(null);
  const [captainLocation, setCaptainLocation] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const { sendMessage, recieveMessage, socket } = useContext(SocketDataContext);

  const leafLetIcons = {
    location: L.icon({
      iconUrl: "./location-marker.png",
      iconSize: [70, 70],
      iconAnchor: [35, 35],
    }),
    car: L.icon({
      iconUrl: "car.png",
      iconSize: [60, 40],
      iconAnchor: [30, 20],
    }),
    motorcycle: L.icon({
      iconUrl: "motorbike.webp",
      iconSize: [60, 40],
      iconAnchor: [30, 20],
    }),
    auto: L.icon({
      iconUrl: "auto.webp",
      iconSize: [60, 40],
      iconAnchor: [30, 20],
    })
  };

  // Get real route from OSRM
  const getOSRMRoute = async (startLat, startLng, endLat, endLng) => {
    try {
      // Validate coordinates
      if (!startLat || !startLng || !endLat || !endLng || 
          isNaN(startLat) || isNaN(startLng) || isNaN(endLat) || isNaN(endLng)) {
        return [];
      }

      const url = `https://router.project-osrm.org/route/v1/driving/${startLng},${startLat};${endLng},${endLat}?overview=full&geometries=geojson`;
      
      const response = await axios.get(url);
      
      if (response.data && response.data.routes && response.data.routes.length > 0) {
        const route = response.data.routes[0];
        const coordinates = route.geometry.coordinates.map(coord => [coord[1], coord[0]]);
        return coordinates;
      }
      return [];
    } catch (err) {
      console.log("Error fetching OSRM route:", err.message);
      return [];
    }
  }

  // Fetch ride from backend on refresh
  const fetchRideData = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/rides/active-ride/user`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (response.data) {
        setRide(response.data);
        
        // Set captain location if available
        if (response.data.captainId?.location?.coordinates) {
          const [lng, lat] = response.data.captainId.location.coordinates;
          setCaptainLocation({ lat, lng });
        }
        
        // Also get captain location from ride doc
        if (response.data.captainLocation?.coordinates) {
          const [lng, lat] = response.data.captainLocation.coordinates;
          if (lng && lat) {
            setCaptainLocation({ lat, lng });
          }
        }
      } else {
        navigate("/home");
      }
    } catch (err) {
      console.log("Error fetching ride data:", err.message);
      navigate("/home");
    }
  }

  // Update user location on ride document
  const updateLocationOnRide = async (lat, lng) => {
    if (!ride?._id) return;
    
    try {
      await axios.post(`${import.meta.env.VITE_BASE_URL}/rides/update-user-location`, {
        rideId: ride._id,
        latitude: lat,
        longitude: lng
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        }
      });
    } catch (err) {
      console.log("Error updating user location:", err);
    }
  }

  useEffect(() => {
    // Fetch ride data from backend
    const fetchAndSetupRide = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/rides/active-ride/user`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (response.data) {
          setRide(response.data);
          
          // Set captain location if available from ride doc
          if (response.data.captainLocation?.coordinates) {
            const [lng, lat] = response.data.captainLocation.coordinates;
            if (lng && lat) {
              setCaptainLocation({ lat, lng });
            }
          }
        } else {
          navigate("/home");
        }
      } catch (err) {
        console.log("Error fetching ride data:", err.message);
        navigate("/home");
      }
    };

    // Get user's current location from geolocation - non-blocking
    const getAndSetUserLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setUserLocation({
              lat: position.coords.latitude,
              lng: position.coords.longitude
            });
          },
          (error) => {
            console.log("Geolocation error:", error.message);
          },
          { timeout: 2000, maximumAge: 0 }
        );
      }
    };

    // Start both operations immediately - don't wait for either
    fetchAndSetupRide();
    getAndSetUserLocation();
  }, [navigate]);

  // Periodically fetch ride to get updated captain location
  useEffect(() => {
    const fetchInterval = setInterval(() => {
      fetchRideData();
    }, 5000); // Fetch every 5 seconds

    return () => clearInterval(fetchInterval);
  }, []);

  // Update user location on ride document and geolocation
  useEffect(() => {
    if (userLocation) {
      updateLocationOnRide(userLocation.lat, userLocation.lng);
    }
  }, [userLocation, ride?._id]);

  // Update user location periodically from geolocation
  useEffect(() => {
    if (navigator.geolocation) {
      // Update location every 3 seconds
      const locationInterval = setInterval(() => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setUserLocation({
              lat: position.coords.latitude,
              lng: position.coords.longitude
            });
          },
          (error) => {
            console.log("Geolocation error:", error.message);
          },
          { timeout: 2000, maximumAge: 0 }
        );
      }, 3000);

      return () => clearInterval(locationInterval);
    }
  }, []);

  useEffect(() => {
    if (socket) {
      recieveMessage('captain-location-update', (data) => {
        setCaptainLocation({
          lat: data.latitude,
          lng: data.longitude
        });
      });

      recieveMessage('ride-ended', (rideData) => {
        setRide(rideData);
        setTimeout(() => {
          navigate('/home');
        }, 3000);
      });
    }
  }, [socket, recieveMessage, navigate]);

  // Monitor ride status and navigate when completed
  useEffect(() => {
    if (ride && ride.status === 'completed') {
      // Show completion message for 2 seconds then navigate
      setTimeout(() => {
        navigate('/home');
      }, 2000);
    }
  }, [ride?.status, navigate]);

  // Generate polyline from ride origin to destination
  useEffect(() => {
    const generateRoute = async () => {
      if (ride) {
        let originLat, originLng, destLat, destLng;

        // Try to get coordinates from ride
        if (ride.originCoordinates && ride.originCoordinates.latitude && ride.originCoordinates.longitude) {
          originLat = ride.originCoordinates.latitude;
          originLng = ride.originCoordinates.longitude;
        }

        if (ride.destinationCoordinates && ride.destinationCoordinates.latitude && ride.destinationCoordinates.longitude) {
          destLat = ride.destinationCoordinates.latitude;
          destLng = ride.destinationCoordinates.longitude;
        }

        // If coordinates are missing, try to fetch from maps service via backend
        if (!originLat || !originLng || !destLat || !destLng) {
          try {
            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/rides/ride-coordinates/${ride._id}`, {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            });
            if (response.data) {
              originLat = response.data.originLat;
              originLng = response.data.originLng;
              destLat = response.data.destLat;
              destLng = response.data.destLng;
            }
          } catch (err) {
            console.log("Could not fetch coordinates from backend:", err.message);
          }
        }

        // Generate route if we have valid coordinates
        if (originLat && originLng && destLat && destLng) {
          console.log("Generating route from", originLat, originLng, "to", destLat, destLng);
          const coordinates = await getOSRMRoute(
            originLat,
            originLng,
            destLat,
            destLng
          );
          console.log("Route coordinates:", coordinates);
          setRouteCoordinates(coordinates);
        } else {
          console.log("Missing coordinates for route generation");
        }
      }
    };

    generateRoute();
  }, [ride]);

  if (!ride) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-lg mb-4 text-gray-600">Loading ride details...</p>
          <div className="inline-block">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </div>
    );
  }

  // Determine map center - priority: captainLocation > userLocation > ride origin
  let mapCenter = [22.961074, 88.433524];
  if (captainLocation) {
    mapCenter = [captainLocation.lat, captainLocation.lng];
  } else if (userLocation) {
    mapCenter = [userLocation.lat, userLocation.lng];
  }

  // Show ride completion modal
  if (ride.status === 'completed') {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-900 bg-opacity-75">
        <div className="bg-white rounded-2xl p-8 text-center shadow-2xl">
          <div className="text-6xl mb-4">✓</div>
          <h2 className="text-3xl font-bold mb-2 text-gray-900">Ride Completed!</h2>
          <p className="text-gray-600 mb-4">Thank you for riding with us</p>
          <div className="bg-yellow-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-600">Total Distance</p>
            <p className="text-2xl font-bold text-gray-900">{(ride.distance / 1000).toFixed(2)} KM</p>
          </div>
          <div className="bg-green-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-600">Total Fare</p>
            <p className="text-2xl font-bold text-green-600">₹{Math.round(ride.fare)}</p>
          </div>
          <p className="text-sm text-gray-500">Redirecting to home...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen">
      {/* MAP */}
      <div className="h-1/2 relative">
        <Link to="/home">
          <img
            src="home-line.svg"
            className="fixed left-2 top-2 w-9 bg-gray-100 rounded-full p-2 z-10"
            alt=""
          />
        </Link>

        <MapContainer
          center={mapCenter}
          zoom={14}
          className="h-full w-full"
        >
          <TileLayer
            attribution="© OpenStreetMap"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Recenter map when locations change */}
          <MapRecenter captainLocation={captainLocation} userLocation={userLocation} />

          {/* User location */}
          {userLocation && (
            <Marker position={[userLocation.lat, userLocation.lng]} icon={leafLetIcons.location}>
            </Marker>
          )}

          {/* Captain location */}
          {captainLocation && (
            <Marker position={[captainLocation.lat, captainLocation.lng]} icon={leafLetIcons[ride?.vehicleType]}>
            </Marker>
          )}

          {/* Route polyline */}
          {routeCoordinates.length > 0 && (
            <Polyline positions={routeCoordinates} color="blue" weight={4} />
          )}
        </MapContainer>
      </div>

      {/* RIDE INFO */}
      <div className="h-1/2 p-4 overflow-y-auto">
        {!ride ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">Loading ride information...</p>
          </div>
        ) : (
          <>
            <h3 className="text-2xl font-semibold mb-5">
              {ride.status === 'in_progress' ? 'Ride Ongoing' : 'Ride Status: ' + ride.status}
            </h3>

            {/* Captain details */}
            <div className="flex justify-between items-center">
              <img src={vehicleImageMap[ride.vehicleType]} className="w-28" alt="" />

              <div className="text-right">
                <h2 className="text-lg font-medium">
                  {ride.captainId?.fullName?.firstName || "Captain"}
                </h2>
                <h4 className="text-2xl font-semibold -mt-1 -mb-1">
                  {ride.captainId?.vehicle?.plate || "—"}
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

            <button className="mb-5 w-full mt-4 bg-green-400 p-3 text-white font-semibold rounded">
              Make a Payment
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Riding;
