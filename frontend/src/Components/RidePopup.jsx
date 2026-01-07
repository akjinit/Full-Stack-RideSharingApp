import React from 'react'

const RidePopup = (props) => {
    const ridePopupPanel = props.ridePopupPanel;
    const setRidePopupPanel = props.setRidePopupPanel;
    const ride = props.ride;
    const user = ride?.userId;
    const acceptRideHandler = props.acceptRideHandler;

    return (
        <div
            className={` ${ridePopupPanel ? "" : "translate-y-full"} w-full   fixed z-10 bottom-0 bg-white px-5 py-9 rounded-2xl transition`}
        >
            <h3 className="text-2xl font-semibold mb-5"> New Ride Avilable! </h3>
            <div className='bg-yellow-300 rounded-lg p-4 flex items-center my-2 justify-between'>
                <div className='flex items-center gap-3'>
                    <img className="h-10 w-10 object-cover rounded-full " src="sample-user.webp" alt="" />
                    <h2 className='text-lg font-medium'>{`${user?.fullName.firstName} ${user?.fullName.lastName}`}</h2>
                </div>
                <h5 className='text-lg font-semibold'>{`${(ride?.distance/1000).toFixed(2)} KM `}</h5>
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

                <div className="flex item flex-row-reverse justify-between">
                    <button
                        onClick={() => {
                            props.acceptRideHandler();
                        }}
                        className=" bg-green-400 px-10 py-3 text-white font-semibold rounded-lg"
                    >
                        Accept
                    </button>
                    <button
                        onClick={() => {
                            setRidePopupPanel(false);
                        }}
                        className=" bg-gray-300 px-10 py-3 text-gray-700 font-semibold rounded-lg"
                    >
                        Reject
                    </button>
                </div>
            </div>
        </div>
    )
}

export default RidePopup
