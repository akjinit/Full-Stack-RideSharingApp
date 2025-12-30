import React from "react";

const LocationSearchPanel = (props) => {
  //sample array of locations
  const addresses = [
    "221B Baker Street, London, UK",
    "1600 Amphitheatre Parkway, Mountain View, CA, USA",
    "1 Infinite Loop, Cupertino, CA, USA",
    "1600 Pennsylvania Avenue NW, Washington, DC, USA",
    "Connaught Place, New Delhi, India",
    "MG Road, Bengaluru, India",
    "Marine Drive, Mumbai, India",
    "Park Street, Kolkata, India",
  ];

  return (
    <div className="px-5 pt-2">
      {/* This is sample data */}

      {addresses.map(function (address, idx) {
        return (
          <div
            key={idx}
            onClick={() => {
              props.setvehiclePanelOpen(true);
              props.setpickupPanelClose(true);
            }}
            className="flex gap-3 border-2 border-gray-100 active:border-black p-3 rounded-xl my-2 location items-center justify-start"
          >
            <img src="map-location.svg" className="w-5  rounded " alt="" />
            <h4 className="font-medium">{address}</h4>
          </div>
        );
      })}
    </div>
  );
};

export default LocationSearchPanel;
