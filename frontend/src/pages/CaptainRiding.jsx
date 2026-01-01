import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import FinishRidePanel from '../Components/FinishRidePanel';

const CaptainRiding = () => {
    const [finishRidePanel, setFinishRidePanel] = useState(false);

    return (
        <div className="h-screen ">
            <div className="h-4/5">
                <div className="w-full px-3 fixed flex items-center justify-between">
                    <img
                        className="w-30  "
                        src="https://download.logo.wine/logo/Uber/Uber-Logo.wine.png"
                        alt=""
                    />

                    <Link to="/home">
                        <img
                            src="logout-box.svg"
                            className=" w-9 bg-gray-100 rounded-full p-2"
                            alt=""
                        />
                    </Link>
                </div>
                <img src="https://miro.medium.com/v2/resize:fit:1400/0*gwMx05pqII5hbfmX.gif" alt="" className="h-full w-full object-cover " />
            </div>



            <div onClick={() => setFinishRidePanel(true)} className='h-1/5 p-6 flex items-center rounded-lg justify-between bg-yellow-400'>
                <h4 className='font-semibold'>4 KM Away</h4>
                <button className=" bg-green-400 px-10 py-3 text-white font-semibold rounded-lg"> Complete Ride </button>
            </div>

            <FinishRidePanel finishRidePanel={finishRidePanel} setFinishRidePanel={setFinishRidePanel} />
        </div>
    )
}

export default CaptainRiding
