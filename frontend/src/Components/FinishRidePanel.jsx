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

        if (response.status === 200) {
            setFinishRidePanel(false);
            navigate('/captain-home');
        }
    }


    if (!savedRide) return null;

    return (
        <div className={`${finishRidePanel ? "translate-y-0" : "translate-y-full"} fixed w-full z-[1000] bottom-0 bg-white px-3 py-6 rounded-t-3xl shadow-2xl transition-all duration-500 h-[85vh] overflow-y-scroll`}>
            <h5 className='p-1 text-center w-[90%] w-full mb-5' onClick={() => {
                setFinishRidePanel(false)
            }}><i className="text-3xl text-gray-200 ri-arrow-down-wide-line"></i></h5>

            <div className='flex items-center justify-between mt-4'>
                <h4 className='text-xl font-semibold'>Finish this Ride</h4>
                {/* <h5 className='p-2 bg-green-100 text-green-700 rounded font-medium text-sm'>IN_PROGRESS</h5> */}
                {/* Keeping it simple as per "Finish" context, but Layout below matches screenshot aesthetics */}
            </div>

            <div className='flex justify-between items-center border-b-2 border-slate-100 py-5'>
                <div className='flex items-center gap-3'>
                    <img className='h-12 w-12 rounded-full object-cover' src="https://i.pinimg.com/236x/af/26/28/af26280b0ca305be47df0b799ed1b12b.jpg" alt="" />
                    <div >
                        <h2 className='text-lg font-medium'>{savedRide?.userId.fullName.firstName}</h2>
                        <p className='text-gray-500 text-sm font-semibold'>{savedRide?.paymentMethod || 'Cash'}</p>
                    </div>
                </div>
                <div>
                    <h4 className='text-xl font-bold text-green-600'>₹{savedRide?.fare}</h4>
                    <p className='text-xs text-gray-500 text-right'>Fare</p>
                </div>
            </div>

            <div className='flex flex-col gap-2 pt-5'>
                <div className='flex items-center gap-5 p-3 border-b-2 border-gray-100'>
                    <i className="ri-map-pin-user-fill text-lg"></i>
                    <div>
                        <h3 className='text-lg font-medium'>{savedRide?.origin}</h3>
                        <p className='text-sm text-gray-600 -mt-1'>Pickup</p>
                    </div>
                </div>
                <div className='flex items-center gap-5 p-3'>
                    <i className="ri-map-pin-2-fill text-lg"></i>
                    <div>
                        <h3 className='text-lg font-medium'>{savedRide?.destination}</h3>
                        <p className='text-sm text-gray-600 -mt-1'>Destination</p>
                    </div>
                </div>

                {/* Additional Stats similar to screenshot */}
                <div className='flex items-center justify-between mt-4 px-4 gap-4'>
                    <div className='text-center'>
                        <span className='text-gray-500 text-xs font-semibold uppercase'>Distance</span>
                        <h4 className='text-lg font-bold'>{(savedRide?.distance / 1000).toFixed(1)} KM</h4>
                    </div>
                    <div className='text-center'>
                        <span className='text-gray-500 text-xs font-semibold uppercase'>Duration</span>
                        <h4 className='text-lg font-bold'>{Math.round(savedRide?.duration / 60)} min</h4>
                    </div>
                </div>

            </div>

            <div className='mt-10 w-full'>
                <button
                    onClick={finishRide}
                    className='w-full bg-green-600 text-white text-lg font-semibold p-3 rounded-lg flex justify-center items-center gap-2'>
                    Finish Ride <i className="ri-checkbox-circle-line"></i>
                </button>
            </div>
        </div>
    )
};


export default FinishRidePanel
