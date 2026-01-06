import React from 'react'

const RidePopup = (props) => {
    const ridePopupPanel = props.ridePopupPanel;
    const setRidePopupPanel = props.setRidePopupPanel;
    const setConfirmRidePopupPanel = props.setConfirmRidePopupPanel;
    const ride = props.ride;
    return (
        <div
            className={` ${ridePopupPanel ? "" : "translate-y-full"} w-full   fixed z-10 bottom-0 bg-white px-5 py-9 rounded-2xl transition`}
        >
            
        </div>
    )
}

export default RidePopup
