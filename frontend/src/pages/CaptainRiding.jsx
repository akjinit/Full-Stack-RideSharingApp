import React, { useState, useEffect, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useLocation } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import L from 'leaflet';
import FinishRidePanel from '../Components/FinishRidePanel';
import axios from 'axios';

// Component to handle map recentering
const MapRecenterCaptain = ({ captainLocation, userLocation }) => {
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

const CaptainRiding = () => {
    const [finishRidePanel, setFinishRidePanel] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { ride: initialRide, otpVerified } = location.state || {};
    const [savedRide, setSavedRide] = useState(initialRide);
    const [captainLocation, setCaptainLocation] = useState(null);
    const [userLocation, setUserLocation] = useState(null);
    const [routeCoordinates, setRouteCoordinates] = useState([]);

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

    // Generate simple route coordinates (fallback)
    const generateSimpleRoute = (startLat, startLng, endLat, endLng, steps = 50) => {
        // Validate coordinates
        if (!startLat || !startLng || !endLat || !endLng ||
            isNaN(startLat) || isNaN(startLng) || isNaN(endLat) || isNaN(endLng)) {
            return [];
        }

        const coordinates = [];
        for (let i = 0; i <= steps; i++) {
            const lat = startLat + (endLat - startLat) * (i / steps);
            const lng = startLng + (endLng - startLng) * (i / steps);
            coordinates.push([lat, lng]);
        }
        return coordinates;
    }

    // Fetch active ride from backend on refresh
    const fetchActiveRide = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/rides/active-ride/captain`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            if (response.data) {
                setSavedRide(response.data);

                // Set user location if available
                if (response.data.userId?.location?.coordinates) {
                    const [lng, lat] = response.data.userId.location.coordinates;
                    setUserLocation({ lat, lng });
                }

                // Also get user location from ride doc
                if (response.data.userLocation?.coordinates) {
                    const [lng, lat] = response.data.userLocation.coordinates;
                    if (lng && lat) {
                        setUserLocation({ lat, lng });
                    }
                }
            }
        } catch (err) {
            console.log("No active ride found");
            navigate("/captain-home");
        }
    }

    // Update captain location on ride document
    const updateLocationOnRide = async (lat, lng) => {
        if (!savedRide?._id) return;

        try {
            await axios.post(`${import.meta.env.VITE_BASE_URL}/rides/update-captain-location`, {
                rideId: savedRide._id,
                latitude: lat,
                longitude: lng
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                }
            });
        } catch (err) {
            console.log("Error updating captain location:", err);
        }
    }

    useEffect(() => {
        if (initialRide) {
            setSavedRide(initialRide);

            // Set user location if available
            if (initialRide.userId?.location?.coordinates) {
                const [lng, lat] = initialRide.userId.location.coordinates;
                setUserLocation({ lat, lng });
            }

            // Also get user location from ride doc
            if (initialRide.userLocation?.coordinates) {
                const [lng, lat] = initialRide.userLocation.coordinates;
                if (lng && lat) {
                    setUserLocation({ lat, lng });
                }
            }
        } else {
            // Refresh case - fetch from backend
            fetchActiveRide();
        }

        // Get captain's current location
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                setCaptainLocation({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                });
            });
        }
    }, [initialRide]);

    // Periodically fetch ride to get updated user location
    useEffect(() => {
        const fetchInterval = setInterval(() => {
            fetchActiveRide();
        }, 5000); // Fetch every 5 seconds

        return () => clearInterval(fetchInterval);
    }, []);

    // Update captain location on ride document
    useEffect(() => {
        if (captainLocation) {
            updateLocationOnRide(captainLocation.lat, captainLocation.lng);
        }
    }, [captainLocation]);

    if (!savedRide) {
        return <div className="h-screen flex items-center justify-center">
            <div className="text-center">
                <p className="text-lg mb-2">Loading ride...</p>
                <div className="animate-spin">⏳</div>
            </div>
        </div>;
    }

    // Determine map center - priority: captainLocation > userLocation > ride origin
    let mapCenter = [22.961074, 88.433524];
    if (captainLocation) {
        mapCenter = [captainLocation.lat, captainLocation.lng];
    } else if (userLocation) {
        mapCenter = [userLocation.lat, userLocation.lng];
    }

    // Generate polyline from ride origin to destination
    useEffect(() => {
        const generateRoute = async () => {
            if (savedRide) {
                let originLat, originLng, destLat, destLng;

                // Try to get coordinates from ride
                if (savedRide.originCoordinates && savedRide.originCoordinates.latitude && savedRide.originCoordinates.longitude) {
                    originLat = savedRide.originCoordinates.latitude;
                    originLng = savedRide.originCoordinates.longitude;
                }

                if (savedRide.destinationCoordinates && savedRide.destinationCoordinates.latitude && savedRide.destinationCoordinates.longitude) {
                    destLat = savedRide.destinationCoordinates.latitude;
                    destLng = savedRide.destinationCoordinates.longitude;
                }

                // If coordinates are missing, try to fetch from maps service via backend
                if (!originLat || !originLng || !destLat || !destLng) {
                    try {
                        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/rides/ride-coordinates/${savedRide._id}`, {
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
                    const coordinates = await getOSRMRoute(
                        originLat,
                        originLng,
                        destLat,
                        destLng
                    );
                    setRouteCoordinates(coordinates);
                }
            }
        };

        generateRoute();
    }, [savedRide]);

    return (
        <div className="h-screen flex flex-col">
            {/* Map Section */}
            <div className="flex-1 relative">
                <div className="w-full px-3 fixed flex items-center justify-end z-10 top-0 bg-white bg-opacity-90 py-3 shadow-md">
                    <Link to="/captain-home">
                        <button className="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded-lg transition">
                            End Ride
                        </button>
                    </Link>
                </div>

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
                    <MapRecenterCaptain captainLocation={captainLocation} userLocation={userLocation} />

                    {/* User location */}
                    {userLocation && (
                        <Marker position={[userLocation.lat, userLocation.lng]} icon={leafLetIcons.location}>
                            <Popup>User Location</Popup>
                        </Marker>
                    )}

                    {/* Captain location */}
                    {captainLocation && (
                        <Marker position={[captainLocation.lat, captainLocation.lng]} icon={leafLetIcons[savedRide?.vehicleType]}>
                            <Popup>Your Location</Popup>
                        </Marker>
                    )}

                    {/* Route polyline */}
                    {routeCoordinates.length > 0 && (
                        <Polyline positions={routeCoordinates} color="blue" weight={4} />
                    )}
                </MapContainer>
            </div>

            {/* Ride Info Section */}
            <div className="bg-white rounded-t-2xl shadow-2xl p-5">
                {/* Header */}
                <div className="flex justify-between items-center mb-4 pb-3 border-b-2 border-gray-200">
                    <div>
                        <h3 className="font-bold text-lg">
                            {savedRide.userId?.fullName?.firstName} {savedRide.userId?.fullName?.lastName}
                        </h3>
                        <p className="text-sm text-gray-600">{savedRide.userId?.email}</p>
                    </div>
                    <span className={`px-4 py-2 rounded-full text-sm font-bold text-white ${savedRide.status === 'in_progress' ? 'bg-green-500' : 'bg-blue-500'
                        }`}>
                        {savedRide.status?.toUpperCase()}
                    </span>
                </div>

                {/* Route Info */}
                <div className="mb-4 space-y-3">
                    <div className="flex gap-3">
                        <span className="text-xl">📍</span>
                        <div>
                            <p className="text-xs text-gray-500 font-semibold">PICKUP</p>
                            <p className="text-sm font-medium">{savedRide.origin}</p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <span className="text-xl">🎯</span>
                        <div>
                            <p className="text-xs text-gray-500 font-semibold">DESTINATION</p>
                            <p className="text-sm font-medium">{savedRide.destination}</p>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-3 mb-4 py-3 border-y border-gray-200">
                    <div className="text-center">
                        <p className="text-xs text-gray-500 font-semibold">DISTANCE</p>
                        <p className="font-bold text-lg">{(savedRide.distance / 1000).toFixed(2)} km</p>
                    </div>
                    <div className="text-center">
                        <p className="text-xs text-gray-500 font-semibold">DURATION</p>
                        <p className="font-bold text-lg">{Math.round(savedRide.duration / 60)} min</p>
                    </div>
                    <div className="text-center">
                        <p className="text-xs text-gray-500 font-semibold">FARE</p>
                        <p className="font-bold text-lg text-green-600">₹{Math.round(savedRide.fare)}</p>
                    </div>
                </div>

                {/* Finish Ride Button */}
                <button
                    onClick={() => setFinishRidePanel(true)}
                    className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-lg transition">
                    Finish Ride
                </button>
            </div>

            <FinishRidePanel
                savedRide={savedRide}
                finishRidePanel={finishRidePanel}
                setFinishRidePanel={setFinishRidePanel}
            />
        </div>
    );
};


export default CaptainRiding
