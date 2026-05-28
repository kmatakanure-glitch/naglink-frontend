import React, { useState, useEffect } from "react";
import API from "../services/api";
import toast from "react-hot-toast";
import { X } from "lucide-react";

const MultiTruckOrderForm = ({ onClose, onSuccess }) => {
  const [customers, setCustomers] = useState([]);
  const [availableTrucks, setAvailableTrucks] = useState([]);
  const [availableDrivers, setAvailableDrivers] = useState([]);

  const [orderData, setOrderData] = useState({
    customerId: "",
    pickupLocation: "",
    deliveryLocation: "",
    goodsDescription: "",
    weight: "",
  });

  const [trucks, setTrucks] = useState([
    {
      truckId: "",
      driverId: "",
      packageNumber: "",
      departureTime: "",
      forecastedArrival: "",
    },
  ]);

  useEffect(() => {
    fetchCustomers();
    fetchAvailableTrucks();
    fetchAvailableDrivers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await API.get("/users/customers");
      setCustomers(response.data.customers);
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };

  const fetchAvailableTrucks = async () => {
    try {
      const response = await API.get("/trucks/available");
      setAvailableTrucks(response.data.trucks);
    } catch (error) {
      console.error("Error fetching trucks:", error);
    }
  };

  const fetchAvailableDrivers = async () => {
    try {
      const response = await API.get("/users/drivers");
      setAvailableDrivers(response.data.drivers);
    } catch (error) {
      console.error("Error fetching drivers:", error);
    }
  };

  const addTruck = () => {
    setTrucks([
      ...trucks,
      {
        truckId: "",
        driverId: "",
        packageNumber: "",
        departureTime: "",
        forecastedArrival: "",
      },
    ]);
  };

  const removeTruck = (index) => {
    const newTrucks = trucks.filter((_, i) => i !== index);
    setTrucks(newTrucks);
  };

  const updateTruck = (index, field, value) => {
    const newTrucks = [...trucks];
    newTrucks[index][field] = value;
    setTrucks(newTrucks);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const invalidTruck = trucks.find((t) => !t.truckId || !t.driverId);

    if (invalidTruck) {
      toast.error("Please select truck and driver for all entries");
      return;
    }

    try {
      const payload = {
        ...orderData,
        trucks: trucks.map((t) => ({
          truckId: t.truckId,
          driverId: t.driverId,
          packageNumber: t.packageNumber,
          departureTime: t.departureTime,
          forecastedArrival: t.forecastedArrival,
        })),
      };

      await API.post("/multi-truck/create", payload);

      toast.success(`Order created with ${trucks.length} trucks!`);
      onSuccess();
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || "Error creating order");
    }
  };

  const inputClass =
    "w-full rounded-md border border-gray-700 bg-[#1c1c1f] px-4 py-3 text-white outline-none transition placeholder:text-gray-500 focus:border-blue-500";

  const labelClass = "mb-2 block font-semibold text-gray-200";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-3 py-4 backdrop-blur-sm">
      <div className="max-h-[88vh] w-full max-w-4xl overflow-y-auto rounded-2xl border border-gray-800 bg-[#09090b] p-5 text-white shadow-2xl shadow-blue-500/10 sm:p-6">
        
        {/* Header */}
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white sm:text-3xl">
              Create Multi-Truck Order
            </h2>

            <p className="mt-2 text-sm text-gray-400 sm:text-base">
              Create one order and assign multiple trucks and drivers.
            </p>
          </div>

          <button
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-gray-300 transition hover:bg-white/20 hover:text-white"
          >
            <X size={22} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          
          {/* Order Details */}
          <div className="mb-6 rounded-xl border border-gray-800 bg-[#101013] p-4 sm:p-5">
            <h3 className="mb-5 text-lg font-bold text-white sm:text-xl">
              Order Details
            </h3>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              
              {/* Customer */}
              <div>
                <label className={labelClass}>Select Customer</label>

                <select
                  value={orderData.customerId}
                  onChange={(e) =>
                    setOrderData({
                      ...orderData,
                      customerId: e.target.value,
                    })
                  }
                  className={inputClass}
                  required
                >
                  <option value="">Select Customer</option>

                  {customers.map((customer) => (
                    <option key={customer.id} value={customer.id}>
                      {customer.username} - {customer.email}
                    </option>
                  ))}
                </select>
              </div>

              {/* Weight */}
              <div>
                <label className={labelClass}>Weight (kg)</label>

                <input
                  type="text"
                  value={orderData.weight}
                  onChange={(e) =>
                    setOrderData({
                      ...orderData,
                      weight: e.target.value,
                    })
                  }
                  className={inputClass}
                  placeholder="Enter order weight"
                  required
                />
              </div>

              {/* Pickup */}
              <div className="md:col-span-2">
                <label className={labelClass}>Pickup Location</label>

                <textarea
                  value={orderData.pickupLocation}
                  onChange={(e) =>
                    setOrderData({
                      ...orderData,
                      pickupLocation: e.target.value,
                    })
                  }
                  className={inputClass}
                  rows="2"
                  placeholder="Enter pickup address"
                  required
                />
              </div>

              {/* Delivery */}
              <div className="md:col-span-2">
                <label className={labelClass}>Delivery Location</label>

                <textarea
                  value={orderData.deliveryLocation}
                  onChange={(e) =>
                    setOrderData({
                      ...orderData,
                      deliveryLocation: e.target.value,
                    })
                  }
                  className={inputClass}
                  rows="2"
                  placeholder="Enter delivery address"
                  required
                />
              </div>

              {/* Goods */}
              <div className="md:col-span-2">
                <label className={labelClass}>Goods Description</label>

                <textarea
                  value={orderData.goodsDescription}
                  onChange={(e) =>
                    setOrderData({
                      ...orderData,
                      goodsDescription: e.target.value,
                    })
                  }
                  className={inputClass}
                  rows="2"
                  placeholder="Describe the goods being transported"
                  required
                />
              </div>
            </div>
          </div>

          {/* Trucks */}
          <div className="mb-6">
            <div className="mb-5 flex flex-col gap-4 border-b border-gray-800 pb-5 md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="text-lg font-bold text-white sm:text-xl">
                  Assign Trucks & Drivers
                </h3>

                <p className="mt-1 text-sm text-gray-400">
                  Select available vehicles and drivers.
                </p>
              </div>

              <button
                type="button"
                onClick={addTruck}
                className="rounded-md bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
              >
                + Add Another Truck
              </button>
            </div>

            <div className="space-y-5">
              {trucks.map((truck, index) => (
                <div
                  key={index}
                  className="rounded-xl border border-gray-800 bg-[#101013] p-4 sm:p-5"
                >
                  <div className="mb-5 flex items-center justify-between">
                    <h4 className="text-base font-bold text-white sm:text-lg">
                      Vehicle #{index + 1}
                    </h4>

                    {trucks.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeTruck(index)}
                        className="rounded-md border border-red-500/40 px-4 py-2 text-sm font-semibold text-red-400 transition hover:bg-red-500/10"
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    
                    {/* Truck */}
                    <div>
                      <label className={labelClass}>Select Truck</label>

                      <select
                        value={truck.truckId}
                        onChange={(e) => {
                          const selectedTruckId = e.target.value;

                          const selectedTruck = availableTrucks.find(
                            (t) => String(t.id) === String(selectedTruckId)
                          );

                          const assignedDriverId =
                            selectedTruck?.assignedDriverId ||
                            selectedTruck?.assignedDriver?.id ||
                            "";

                          const newTrucks = [...trucks];
                          newTrucks[index] = {
                            ...newTrucks[index],
                            truckId: selectedTruckId,
                            driverId: assignedDriverId,
                          };

                          setTrucks(newTrucks);
                        }}
                        className={inputClass}
                        required
                      >
                        <option value="">Select Truck</option>

                        {availableTrucks.map((t) => (
                          <option key={t.id} value={t.id}>
                            {t.truckName} - {t.licensePlate}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Driver */}
                    <div>
                      <label className={labelClass}>Assign Driver</label>

                      <select
                      value={truck.driverId}
                      disabled
                      className={`${inputClass} cursor-not-allowed opacity-70`}
                      required
                    >
                      <option value="">Driver will auto-fill from selected truck</option>

                      {availableDrivers.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.username} - {d.email}
                        </option>
                      ))}
                    </select>
                    </div>

                    {/* Package */}
                    <div>
                      <label className={labelClass}>Package Number</label>

                      <input
                        type="text"
                        value={truck.packageNumber}
                        onChange={(e) =>
                          updateTruck(index, "packageNumber", e.target.value)
                        }
                        className={inputClass}
                        placeholder="Optional"
                      />
                    </div>

                    {/* Departure */}
                    <div>
                      <label className={labelClass}>Departure Time</label>

                      <input
                        type="datetime-local"
                        value={truck.departureTime}
                        onChange={(e) =>
                          updateTruck(index, "departureTime", e.target.value)
                        }
                        className={inputClass}
                      />
                    </div>

                    {/* ETA */}
                    <div>
                      <label className={labelClass}>
                        Forecasted Arrival
                      </label>

                      <input
                        type="datetime-local"
                        value={truck.forecastedArrival}
                        onChange={(e) =>
                          updateTruck(
                            index,
                            "forecastedArrival",
                            e.target.value
                          )
                        }
                        className={inputClass}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="flex flex-col gap-3 border-t border-gray-800 pt-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-gray-700 px-6 py-3 font-semibold text-white transition hover:bg-white/10"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={
                availableTrucks.length === 0 ||
                availableDrivers.length === 0
              }
              className="rounded-md bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Create Order with {trucks.length} Truck
              {trucks.length !== 1 ? "s" : ""}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MultiTruckOrderForm;