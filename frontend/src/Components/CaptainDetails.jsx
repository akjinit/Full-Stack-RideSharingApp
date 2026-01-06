import React from 'react'
import { CaptainDataContext } from '../context/CaptainContext'
import { useContext } from 'react';

const CaptainDetails = () => {
  const { captain } = useContext(CaptainDataContext);
  const vehicleImageMap = {
    car: "car.png",
    motorcycle: "motorbike.webp",
    auto: "auto.webp"
  };

  if (!captain || !captain.fullName) {
    return <div className="p-4">Loading captain details...</div>;
  }

  return (
    <div className="py-3 flex flex-col gap-5 rider-details-container">
      <div className="rider-details flex justify-between items-center bg-yellow-400 rounded-2xl p-4 shadow-md hover:shadow-lg transition-shadow">
        <div className="flex gap-3 items-center flex-1">
          <img src="sample-driver.jpg" className="h-12 w-12 rounded-full object-cover shadow-sm" alt="" />
          <div>
            <h4 className="text-lg font-semibold text-gray-900">{captain.fullName.firstName} {captain.fullName.lastName}</h4>
            <p className="text-xs text-gray-700">Active Captain</p>
          </div>
        </div>

        <div className="text-right bg-white bg-opacity-60 rounded-lg px-3 py-2">
          <h4 className="text-2xl font-bold text-yellow-700">₹295.2</h4>
          <p className="text-xs text-gray-600 font-medium">Earned Today</p>
        </div>
      </div>

      <div className="ride-details grid grid-cols-3 gap-3 p-5 bg-gray-200 rounded-2xl shadow-md">
        <div className="flex flex-col items-center bg-white rounded-xl p-3 shadow-sm hover:shadow-md transition-shadow">
          <img src="time-line.svg" className="w-6 mb-2 opacity-80" alt="" />
          <h5 className="text-xl font-bold text-gray-900">10.2</h5>
          <p className="text-[10px] text-gray-600 font-medium text-center">Hours Online</p>
        </div>
        <div className="flex flex-col items-center bg-white rounded-xl p-3 shadow-sm hover:shadow-md transition-shadow">
          <img src="pin-distance-line.svg" className="w-6 mb-2 opacity-80" alt="" />
          <h5 className="text-xl font-bold text-gray-900">10.2</h5>
          <p className="text-[10px] text-gray-600 font-medium text-center">Distance Travelled</p>
        </div>
        <div className="flex flex-col items-center bg-white rounded-xl p-3 shadow-sm hover:shadow-md transition-shadow">
          <img src="booklet-line.svg" className="w-6 mb-2 opacity-80" alt="" />
          <h5 className="text-xl font-bold text-gray-900">300</h5>
          <p className="text-[10px] text-gray-600 font-medium text-center">Average Earning</p>
        </div>
      </div>

      <div className="flex items-center justify-between bg-linear-to-r from-gray-100 to-gray-200 border-3 mb-3 border-gray-800 rounded-2xl p-1 shadow-md">
        <div className="w-1/3 flex justify-center">
          <img src={vehicleImageMap[captain.vehicleType] || "car.png"} className="w-24 h-24 object-contain" alt="" />
        </div>
        <div className="w-2/3 pl-4 border-l-4 border-gray-400">
          <p className="text-xs text-gray-600 font-medium uppercase tracking-wide">Vehicle Details</p>
          <p className='text-2xl font-bold text-gray-900 mt-1'>{captain.vehicle.plate}</p>
          <div className='flex items-center gap-2 mt-2 text-gray-800'>
            <img className="w-5" src="user-line.svg" alt="" />
            <p className="font-semibold">{captain.vehicle.capacity} Seater</p>
          </div>
        </div>
      </div>

    </div>
  )
}

export default CaptainDetails
