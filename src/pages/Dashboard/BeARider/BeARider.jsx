import React, { useState } from "react";
import { useForm } from "react-hook-form";
import warehousesData from "../../../assets/data/warehouses.json"; // adjust path
import PrimaryButton from "../../../components/PrimaryButton";
import useAuth from "../../../hooks/useAuth";
import PageHeading from "../../../components/PageHeading";
import beARiderImage from '../../../assets/images/agent-pending.png';

const BeARider = () => {
  const { user } = useAuth();
  const { register, handleSubmit, watch } = useForm({
    defaultValues: {
      name: user?.displayName,
      email: user?.email,
    },
  });

  const [regions] = useState(warehousesData);

  const selectedRegion = watch("region");
  const regionData = regions.find((r) => r.region === selectedRegion);
  const districtOptions = regionData ? regionData.districts : [];

  const onSubmit = (data) => {
    const riderData = {
      ...data,
      status: "Pending",
      appliedAt: new Date().toISOString(),
    };

    console.log("🚀 Submitted Rider Data:", riderData);

    // Send to backend using axiosSecure.post(...)
  };

  return (
    <section className="mt-4 w-full flex flex-col md:flex-row items-center justify-center mb-10 bg-white rounded-2xl p-6 md:p-10">

      {/* LEFT — FORM */}
      <div className="w-full md:w-1/2">
        <PageHeading
          title="Be a Rider"
          description="Enjoy fast, reliable parcel delivery with real-time tracking and zero hassle. From personal packages to business shipments — we deliver on time, every time."
        ></PageHeading>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

          {/* Name */}
          <div>
            <label className="block font-medium">Full Name</label>
            <input
              type="text"
              {...register("name")}
              readOnly
              className="input input-bordered w-full bg-gray-200"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block font-medium">Email</label>
            <input
              type="email"
              {...register("email")}
              readOnly
              className="input input-bordered w-full bg-gray-200"
            />
          </div>

          {/* Age */}
          <div>
            <label className="block font-medium">Age</label>
            <input
              type="number"
              {...register("age", { required: true })}
              className="input input-bordered w-full"
            />
          </div>

          {/* Region + District */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* Region */}
            <div>
              <label className="block font-medium">Region</label>
              <select
                {...register("region", { required: true })}
                className="select select-bordered w-full"
              >
                <option value="">Select Region</option>
                {regions.map((item, i) => (
                  <option key={i} value={item.region}>
                    {item.region}
                  </option>
                ))}
              </select>
            </div>

            {/* District */}
            <div>
              <label className="block font-medium">District</label>
              <select
                {...register("district", { required: true })}
                className="select select-bordered w-full"
                disabled={!selectedRegion}
              >
                <option value="">Select District</option>
                {districtOptions.map((d, i) => (
                  <option key={i} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

          </div>

          {/* Phone */}
          <div>
            <label className="block font-medium">Phone Number</label>
            <input
              type="tel"
              {...register("phone", { required: true })}
              className="input input-bordered w-full"
            />
          </div>

          {/* NID */}
          <div>
            <label className="block font-medium">National ID Card Number</label>
            <input
              type="text"
              {...register("nid", { required: true })}
              className="input input-bordered w-full"
            />
          </div>

          {/* Bike Brand */}
          <div>
            <label className="block font-medium">Bike Brand</label>
            <input
              type="text"
              {...register("bikeBrand", { required: true })}
              className="input input-bordered w-full"
            />
          </div>

          {/* Bike Registration Number */}
          <div>
            <label className="block font-medium">Bike Registration Number</label>
            <input
              type="text"
              {...register("bikeRegNo", { required: true })}
              className="input input-bordered w-full"
            />
          </div>

          {/* Submit Button */}
          <PrimaryButton className='w-full'>
            Submit Application
          </PrimaryButton>

        </form>
      </div>

      {/* RIGHT — IMAGE (hidden on mobile) */}
      <div className="hidden md:flex w-1/2 justify-center">
        <img
          src={beARiderImage}
          alt="Rider Illustration"
          className="max-w-[80%]"
        />
      </div>
    </section>
  );
};

export default BeARider;
