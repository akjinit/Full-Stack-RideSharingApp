import axios from 'axios';
import React from 'react'
import { Link, useNavigate } from 'react-router-dom';

const FinishRidePanel = (props) => {
    const { finishRidePanel, setFinishRidePanel, savedRide } = props;
    const navigate = useNavigate();

    async function finishRide() {
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/rides/end-ride`, {
            params: {
                rideId: savedRide?._id,
            },
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })

        if(response.status === 200){
            setFinishRidePanel(false);
            navigate('/captain-home');
        }
    }


    if (!savedRide) return null;

    return (
        <div className={`${finishRidePanel ? "" : "translate-y-full"
            } w-full fixed z-10 bottom-0 bg-white px-5 py-9 rounded-t-2xl transition`}>

            <h3 className="text-2xl font-semibold mb-5">
                Finish this ride
            </h3>

            <div className='border-yellow-300 border-4 rounded-lg p-4 flex items-center my-2 justify-between'>
                <div className='flex items-center gap-3'>
                    <img
                        className="h-10 w-10 object-cover rounded-full"
                        src="sample-user.webp"
                        alt=""
                    />
                    <h2 className='text-lg font-medium'>
                        {savedRide.userId.fullName.firstName}{" "}
                        {savedRide.userId.fullName.lastName}
                    </h2>
                </div>
                <h5 className='text-lg font-semibold'>
                    {(savedRide.distance / 1000).toFixed(2)} KM
                </h5>
            </div>

            <div className="flex flex-col gap-5">
                <div>
                    <div className="flex gap-5 p-2 border-b border-gray-300">
                        <img src="map-location.svg" className="w-5" alt="" />
                        <h3 className="text-lg font-medium">
                            {savedRide.origin}
                        </h3>
                    </div>

                    <div className="flex gap-5 p-2 border-b-2 border-gray-300">
                        <img src="map-user.svg" className="w-5" alt="" />
                        <h3 className="text-lg font-medium">
                            {savedRide.destination}
                        </h3>
                    </div>

                    <div className="flex gap-5 p-2 border-b-2 border-gray-300">
                        <img src="cash-fill.svg" className="w-5" alt="" />
                        <div>
                            <h3 className="text-lg font-medium">
                                ₹{savedRide.fare}
                            </h3>
                            <p className="text-gray-600 text-sm">
                                {savedRide.paymentMethod || "Cash / Card"}
                            </p>
                        </div>
                    </div>
                </div>

                <div className='flex flex-col mt-6 gap-3'>
                    <Link

                    >
                        Finish Ride
                    </Link>

                    <button
                        onClick={finishRide}
                        className="w-full text-center bg-green-600 p-3 text-white font-semibold rounded"
                    >
                        Finish Ride
                    </button>

                    <p className='text-xs font-semibold text-red-500'>
                        Click on finish ride only if payment received
                    </p>
                </div>
            </div>
        </div>
    );
};


export default FinishRidePanel
