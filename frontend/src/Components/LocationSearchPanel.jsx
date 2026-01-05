import React from "react";

const LocationSearchPanel = (props) => {
  //sample array of locations
  const suggestions = props.suggestions;

  return (
    <div className="px-5 pt-2">


      {suggestions.map(function (address, idx) {
        return (
          <div
            key={idx}
            onClick={() => {

              if (props.pickupInputFocused) {
                props.setPickup(address);
              }
              if (props.destinationInputFocused) {
                props.setDestination(address);
              }
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
