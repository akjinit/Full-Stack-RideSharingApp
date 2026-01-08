import axios from 'axios';
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';



const ConfirmRidePopup = (props) => {
    const [OTP, setOTP] = useState('');
    const confirmRidePopupPanel = props.confirmRidePopupPanel;
    const setConfirmRidePopupPanel = props.setConfirmRidePopupPanel;
    const ride = props.ride;
    const user = ride?.userId;
    const token = localStorage.getItem('token');
    const navigate = useNavigate();

    const submitHandler = async function (e) {
        e.preventDefault();
        if (OTP.length != 4) {
            return;
        }

        setConfirmRidePopupPanel(false);
        console.log(OTP);

        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/rides/start-ride`, {
            params: {
                rideId: ride?._id,
                OTP: OTP
            },
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        if (response.status == 200) {
            navigate('/captain-riding', {
                state: {
                    ride,
                    otpVerified: true
                }
            });
        }
    }


    return (
        <div className={` ${confirmRidePopupPanel ? "" : "translate-y-full"} w-full h-screen  fixed z-10 bottom-0 bg-white px-5 py-9 rounded-2xl transition`}>
            <h3 className="text-2xl font-semibold mb-5 "> Confirm this ride to start now </h3>
            <div className='border-yellow-300 border-4 rounded-lg p-4 flex items-center my-2 justify-between'>
                <div className='flex items-center gap-3'>
                    <img className="h-10 w-10 object-cover rounded-full " src="sample-user.webp" alt="" />
                    <h2 className='text-lg font-medium'>{`${user?.fullName.firstName} ${user?.fullName.lastName}`}</h2>
                </div>
                <h5 className='text-lg font-semibold'>{`${(ride?.distance / 1000).toFixed(2)} KM `}</h5>
            </div>
            <div className="flex flex-col justify-center gap-5">

                <div>
                    <div className="flex gap-5 p-2 border-b border-gray-300">
                        <img src="map-location.svg" className="w-5" alt="" />
                        <div>
                            <h3 className="text-lg font-medium">{ride?.origin}</h3>
                        </div>
                    </div>
                    <div className="flex gap-5 p-2 border-b-2 border-gray-300">
                        <img src="map-user.svg" className="w-5" alt="" />
                        <div>
                            <h3 className="text-lg font-medium">{ride?.destination}</h3>
                        </div>
                    </div>
                    <div className="flex gap-5 p-2 border-b-2 border-gray-300">
                        <img src="cash-fill.svg" className="w-5" alt="" />
                        <div>
                            <h3 className="text-lg font-medium">₹{ride?.fare}</h3>
                            <p className="text-gray-600 text-sm">Card, Cash</p>
                        </div>
                    </div>
                </div>

                <form onSubmit={submitHandler}>
                    <input required type="text" value={OTP} onChange={(e) => {
                        setOTP(e.target.value);
                    }} className="bg-[#eee] px-6 py-4 font-mono text-base rounded-lg w-full mt-3" placeholder='Enter OTP' />
                    <div className='flex flex-col mt-9 gap-3'>
                        <button
                            type='submit'
                            className="w-full bg-green-600 p-3 text-white font-semibold rounded">
                            Confirm
                        </button>
                        <button
                            onClick={() => {
                                setConfirmRidePopupPanel(false);
                            }}
                            type='button'
                            className="w-full bg-red-600 p-3 text-white font-semibold rounded"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div >
    )
}

export default ConfirmRidePopup
