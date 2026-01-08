import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useLocation } from 'react-router-dom';

import FinishRidePanel from '../Components/FinishRidePanel';
import { useEffect } from 'react';

const CaptainRiding = () => {
    const [finishRidePanel, setFinishRidePanel] = useState(false);
    const location = useLocation();
    const { ride, otpVerified } = location.state || {};
    const [savedRide, setSavedRide] = useState();
    if (!ride) {
        return <div className="h-screen flex items-center justify-center">No Ride Found</div>;
    }

    useEffect(() => {
        setSavedRide(ride);
    }, [])
    
    return (
        <div className="h-screen">
            <div className="h-4/5 relative">
                <div className="w-full px-3 fixed flex items-center justify-between z-10">
                    <img
                        className="w-30"
                        src="https://download.logo.wine/logo/Uber/Uber-Logo.wine.png"
                        alt=""
                    />

                    <Link to="/home">
                        <img
                            src="logout-box.svg"
                            className="w-9 bg-gray-100 rounded-full p-2"
                            alt=""
                        />
                    </Link>
                </div>

                <img
                    src="https://miro.medium.com/v2/resize:fit:1400/0*gwMx05pqII5hbfmX.gif"
                    alt=""
                    className="h-full w-full object-cover"
                />

                {/* Ride Info Overlay */}
                <div className="absolute bottom-5 left-0 right-0 px-4">
                    <div className="bg-white rounded-xl shadow-lg p-4">
                        <div className="flex justify-between">
                            <h3 className="font-semibold">
                                {ride.userId.fullName.firstName} {ride.userId.fullName.lastName}
                            </h3>
                            <span>{(ride.distance / 1000).toFixed(2)} KM</span>
                        </div>

                        <p className="text-sm mt-1">From: {ride.origin}</p>
                        <p className="text-sm">To: {ride.destination}</p>

                        <div className="flex justify-between mt-2">
                            <span className="font-semibold">₹{ride.fare}</span>
                            {otpVerified && <span className="text-green-600">OTP Verified</span>}
                        </div>
                    </div>
                </div>


            </div>

            <div
                onClick={() => setFinishRidePanel(true)}
                className="h-1/5 p-6 rounded-t-2xl flex items-center justify-between bg-yellow-400"
            >
                <h4 className="font-semibold text-2xl">{(ride.duration / 1000).toFixed(2)} KM</h4>
                <button className="bg-green-400 px-10 py-3 text-white font-semibold rounded-lg">
                    Complete Ride
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
