import React, { useState } from "react";
import { useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import PageHeading from "../../components/PageHeading";
import PrimaryButton from "../../components/PrimaryButton";
import wearhouseData from '../../assets/data/warehouses.json';

const AddParcel = () => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const [deliveryCost, setDeliveryCost] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);

  // Get unique regions from warehouse data
  const uniqueRegions = [...new Set(wearhouseData.map(w => w.region))];

  const [selectedSenderRegion, setSelectedSenderRegion] = useState("");
  const [selectedReceiverRegion, setSelectedReceiverRegion] = useState("");

  // Sender wirehouses
  const senderWirehouses = selectedSenderRegion
    ? wearhouseData.find(w => w.region === selectedSenderRegion)?.covered_area || []
    : [];

  // Receiver wirehouses
  const receiverWirehouses = selectedReceiverRegion
    ? wearhouseData.find(w => w.region === selectedReceiverRegion)?.covered_area || []
    : [];

  const parcelType = watch("type");
  const serviceCenter = watch("receiverServiceCenter"); // example for cost calc
  const weight = watch("weight") || 0;

  // Function to calculate delivery cost
  const calculateCost = () => {
    let cost = 50; // base cost
    if (parcelType === "non-document") cost += weight * 10;
    if (serviceCenter === "Dhaka") cost += 20; // example
    setDeliveryCost(cost);
    toast.custom((t) => (
      <div className={`bg-white shadow p-4 rounded flex flex-col ${t.visible ? 'animate-enter' : 'animate-leave'}`}>
        <p className="font-bold text-lg">Estimated Delivery Cost: {cost} BDT</p>
        <button
          onClick={() => {
            saveParcel({ ...watch(), creation_date: new Date() });
            toast.dismiss(t.id);
            setShowConfirm(false);
          }}
          className="btn btn-primary mt-2"
        >
          Confirm
        </button>
      </div>
    ));
  };

  const saveParcel = (data) => {
    console.log("Parcel Saved:", data);
    // TODO: Send data to your backend API or database
  };

  const onSubmit = (data) => {
    calculateCost();
    setShowConfirm(true);
  };

  return (
    <section className='mt-4 mb-10 bg-white rounded-2xl p-6 md:p-10 '>
      <PageHeading title="Add Percel"></PageHeading>

      <form data-aos="fade-left" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Parcel Info */}
        <div>
          <h2 className="font-semibold text-xl mb-4 text-[#03373D]">Enter your parcel details</h2>

          <div className="flex space-x-6 mb-4">
            <label className="flex items-center space-x-4">
              <input
                type="radio"
                value="document"
                {...register("parcelType", { required: true })}
                className="radio radio-success"
              />
              <span>Document</span>
            </label>
            <label className="flex items-center space-x-4">
              <input
                type="radio"
                value="non-document"
                {...register("parcelType", { required: true })}
                className="radio radio-success"
              />
              <span>Not-Document</span>
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input
              {...register("parcelName", { required: true })}
              placeholder="Parcel Name"
              className="input input-bordered outline-none w-full"
            />
            <input
              {...register("parcelWeight")}
              placeholder="Parcel Weight (KG)"
              className="input input-bordered outline-none w-full"
            />
          </div>
        </div>

        {/* Sender and Receiver Info Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Sender Details */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Sender Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                {...register("senderName", { required: true })}
                placeholder="Sender Name"
                className="input input-bordered outline-none w-full"
              />
              <input
                {...register("senderContact", { required: true })}
                placeholder="Sender Contact No"
                className="input input-bordered outline-none w-full"
              />

              <input
                {...register("senderAddress", { required: true })}
                placeholder="Address"
                className="input input-bordered outline-none w-full"
              />

              {/* New Sender Number input */}
              <input
                {...register("senderNumber", { required: true })}
                placeholder="Sender Number"
                className="input input-bordered outline-none w-full"
              />

              {/* Region and Wire house side by side */}
              <select
                {...register("senderRegion", { required: true })}
                className="select select-bordered outline-none w-full"
                onChange={(e) => setSelectedSenderRegion(e.target.value)}
              >
                <option disabled selected value="">Select your region</option>
                {uniqueRegions.map(region => (
                  <option key={region} value={region}>{region}</option>
                ))}
              </select>
              {/* Sender Wirehouse */}
              <select
                {...register("senderWireHouse", { required: true })}
                className="select select-bordered outline-none w-full"
              >
                <option disabled selected value="">Select Wire house</option>
                {senderWirehouses.map(wh => (
                  <option key={wh} value={wh}>{wh}</option>
                ))}
              </select>

              {/* Pickup Instruction full width */}
              <textarea
                {...register("pickupInstruction", { required: true })}
                placeholder="Pickup Instruction"
                className="textarea textarea-bordered w-full outline-none md:col-span-2"
                rows={3}
              />
            </div>
          </div>

          {/* Receiver Details */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Receiver Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                {...register("receiverName", { required: true })}
                placeholder="Receiver Name"
                className="input input-bordered outline-none w-full"
              />
              <input
                {...register("receiverContact", { required: true })}
                placeholder="Receiver Contact No"
                className="input input-bordered outline-none w-full"
              />

              <input
                {...register("receiverAddress", { required: true })}
                placeholder="Receiver Address"
                className="input input-bordered outline-none w-full"
              />

              {/* New Receiver Number input */}
              <input
                {...register("receiverNumber", { required: true })}
                placeholder="Receiver Number"
                className="input input-bordered outline-none w-full"
              />

              {/* Receiver Region */}
              <select
                {...register("receiverRegion", { required: true })}
                className="select select-bordered outline-none w-full"
                onChange={(e) => setSelectedReceiverRegion(e.target.value)}
              >
                <option disabled selected value="">Select your region</option>
                {uniqueRegions.map(region => (
                  <option key={region} value={region}>{region}</option>
                ))}
              </select>

              {/* Receiver Wirehouse */}
              <select
                {...register("receiverWireHouse", { required: true })}
                className="select select-bordered outline-none w-full"
              >
                <option disabled selected value="">Select Wire house</option>
                {receiverWirehouses.map(wh => (
                  <option key={wh} value={wh}>{wh}</option>
                ))}
              </select>

              {/* Delivery Instruction full width */}
              <textarea
                {...register("deliveryInstruction", { required: true })}
                placeholder="Delivery Instruction"
                className="textarea textarea-bordered w-full outline-none md:col-span-2"
                rows={3}
              />
            </div>
          </div>


        </div>

        <p className="text-sm text-gray-600">* PickUp Time 4pm-7pm Approx.</p>

        {/* <button
          type="submit"
          className="btn btn-success w-full max-w-xs"
        >
          Proceed to Confirm Booking
        </button> */}
        <PrimaryButton>
          Proceed to Confirm Booking
        </PrimaryButton>
      </form>

    </section>
  );
};

export default AddParcel;
