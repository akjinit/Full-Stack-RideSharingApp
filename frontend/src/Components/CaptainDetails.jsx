import React from 'react'
import { CaptainDataContext } from '../context/CaptainContext'
import { useContext } from 'react';

const CaptainDetails = () => {
  const { captain } = useContext(CaptainDataContext);
  console.log("Captain:", captain);
  
  if (!captain || !captain.fullName) {
    return <div className="p-4">Loading captain details...</div>;
  }

  return (
    <div>
      <div className="rider-details flex justify-between items-center bg-yellow-300 rounded-2xl p-3">
        <div className="flex gap-2 items-center">
          <img src="sample-driver.jpg" className="h-10 w-10 rounded-full object-cover" alt="" />
          <h4 className="text-lg font-medium">{captain.fullName.firstName} {captain.fullName.lastName}</h4>
        </div>

        <div>
          <h4 className="text-xl font-semibold">Rs 295.2</h4>
          <p className="text-sm text-gray-600"> Earned</p>
        </div>
      </div>

      <div className="ride-details flex gap-5 p-6 mt-6 bg-gray-300 rounded-2xl justify-around text-center">
        <div className="flex flex-col items-center">
          <img src="time-line.svg" className="w-5" alt="" />
          <h5 className="text-lg font-medium">10.2</h5>
          <p className="text-[10px] text-gray-600">Hours Online</p>
        </div>
        <div className="flex flex-col items-center">
          <img src="pin-distance-line.svg" className="w-5" alt="" />
          <h5 className="text-lg font-medium">10.2</h5>
          <p className="text-[10px] text-gray-600">Distance Travelled</p>
        </div>
        <div className="flex flex-col items-center">
          <img src="booklet-line.svg" className="w-5" alt="" />
          <h5 className="text-lg font-medium">300</h5>
          <p className="text-[10px] text-gray-600">Average Earning</p>
        </div>

      </div>
    </div>
  )
}

export default CaptainDetails
