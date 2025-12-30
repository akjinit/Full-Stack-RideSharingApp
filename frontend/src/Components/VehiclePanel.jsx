import React from "react";

const VehiclePanel = (props) => {
  const setvehiclePanelOpen = props.setvehiclePanelOpen;
  const vehiclePanelOpen = props.vehiclePanelOpen;  
  const setConfirmVehiclePanel =  props.setConfirmVehiclePanel;

  const confirmVehicleHandler = ()=>{
    setConfirmVehiclePanel(true);
    // setvehiclePanelOpen(false);

  }

  return (
    <>
      <div
        className={` ${
          vehiclePanelOpen ? "" : "translate-y-full"
        } w-full  fixed z-10 bottom-0 bg-white px-3 py-4 rounded-2xl transition`}
      >
        <img
          src="arrow-down.svg"
          onClick={() => {
            setvehiclePanelOpen(false);
          }}
          className="w-5 opacity-75 absolute left-[50%]"
          alt=""
        />
        <h3 className="text-2xl font-semibold mb-4 mt-4"> Choose a Vehicle</h3>

        <div  onClick={confirmVehicleHandler} className="flex items-center  border-gray-100 active:border-black p-2 mb-2 border-4 rounded-xl">
          <img src="car.png" className="w-21" alt="" />
          <div className=" w-1/2">
            <h4 className="flex items-center gap-1 font-semibold text-base">
              Uber Go 
              <span>
                <img className="w-3" src="user-line.svg" alt="" />
              </span>
              4
            </h4>
            <h5 className="font-medium text-sm">2 mins away</h5>
            <p className="font-medium text-xs text-gray-600">
              Affordable compact rides
            </p>
          </div>
          <h2 className="text-lg font-semibold">Rs 193.20</h2>
        </div>

        <div onClick={confirmVehicleHandler} className="flex items-center border-gray-100 border-4 p-2 mb-2 active:border-black rounded-xl">
          <img src="motorbike.webp" className="w-21" alt="" />
          <div className=" w-1/2">
            <h4 className="flex items-center gap-1 font-semibold text-base">
              Moto{" "}
              <span>
                <img className="w-3" src="user-line.svg" alt="" />
              </span>{" "}
              1
            </h4>
            <h5 className="font-medium text-sm">3 mins away</h5>
            <p className="font-medium text-xs text-gray-600">
              Affordable motorcycle rides
            </p>
          </div>
          <h2 className="text-lg font-semibold">Rs 65.20</h2>
        </div>

        <div onClick={confirmVehicleHandler} className="flex items-center border-gray-100 border-4 p-2 mb-2 active:border-black rounded-xl">
          <img src="auto.webp" className="w-21" alt="" />
          <div className=" w-1/2">
            <h4 className="flex items-center gap-1 font-semibold text-base">
              Auto{" "}
              <span>
                <img className="w-3" src="user-line.svg" alt="" />
              </span>{" "}
              3
            </h4>
            <h5 className="font-medium text-sm">2 mins away</h5>
            <p className="font-medium text-xs text-gray-600">
              Affordable auto rides
            </p>
          </div>
          <h2 className="text-lg font-semibold">Rs 118.28</h2>
        </div>
      </div>
    </>
  );
};

export default VehiclePanel;
