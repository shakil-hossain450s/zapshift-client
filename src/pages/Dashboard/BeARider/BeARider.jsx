import React from "react";
import { useForm } from "react-hook-form";
import warehousesData from "../../../assets/data/warehouses.json";
import PrimaryButton from "../../../components/PrimaryButton";
import useAuth from "../../../hooks/useAuth";
import PageHeading from "../../../components/PageHeading";
import Lottie from "lottie-react";
import beARiderImage from "../../../assets/animations/rider.json";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const BeARider = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const { register, handleSubmit, watch } = useForm({
    defaultValues: {
      name: user?.displayName || "",
      email: user?.email || "",
    },
  });

  // ✅ Extract unique regions
  const uniqueRegions = [...new Set(warehousesData.map((w) => w.region))];

  // Watch region selection
  const selectedRegion = watch("region");

  // ✅ Unique district list based on selected region
  const districtOptions = selectedRegion
    ? [
      ...new Set(
        warehousesData
          .filter((w) => w.region === selectedRegion)
          .map((w) => w.district)
      ),
    ]
    : [];

  const onSubmit = async (data) => {
    const riderData = {
      ...data,
      status: "pending",
      appliedAt: new Date().toISOString(),
    };

    // console.log("🚀 Rider Application Submitted:", riderData);

    try {
      const { data } = await axiosSecure.post('/rider', riderData);
      // console.log(data);
      if (data.success) {
        Swal.fire({
          title: "Application Submitted!",
          text: "Your rider application has been received successfully.",
          icon: "success",
          confirmButtonText: "OK"
        });
      }
    } catch (err) {
      // console.log(err);
    }
  };

  return (
    <section className="mt-4 w-full flex flex-col md:flex-row items-center justify-center mb-10 bg-white rounded-2xl p-6 md:p-10">

      {/* LEFT — FORM */}
      <div data-aos='fade-right' className="w-full md:w-1/2">
        <PageHeading
          title="Be a Rider"
          description="Become a delivery partner and start earning fast with flexible timings."
        />

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 grid grid-cols-12 gap-x-4 gap-y-2">

          {/* Name */}
          <div className="col-span-12 md:col-span-6">
            <label className="block font-medium">Full Name</label>
            <input
              type="text"
              {...register("name")}
              readOnly
              className="input input-bordered w-full bg-gray-200"
            />
          </div>

          {/* Email */}
          <div className="col-span-12 md:col-span-6">
            <label className="block font-medium">Email</label>
            <input
              type="email"
              {...register("email")}
              readOnly
              className="input input-bordered w-full bg-gray-200"
            />
          </div>

          {/* Age */}
          <div className="col-span-12 md:col-span-6">
            <label className="block font-medium">Age</label>
            <input
              type="number"
              {...register("age", { required: true })}
              className="input input-bordered w-full"
              placeholder="Enter your age"
            />
          </div>

          {/* Phone */}
          <div className="col-span-12 md:col-span-6">
            <label className="block font-medium">Phone Number</label>
            <input
              type="tel"
              {...register("phone", { required: true })}
              className="input input-bordered w-full"
              placeholder="Enter your phone number"
            />
          </div>

          {/* Region */}
          <div className="col-span-12 md:col-span-6">
            <label className="block font-medium">Region</label>
            <select
              {...register("region", { required: true })}
              className="select select-bordered w-full"
            >
              <option value="">Select Region</option>
              {uniqueRegions.map((region, i) => (
                <option key={i} value={region}>
                  {region}
                </option>
              ))}
            </select>
          </div>

          {/* District */}
          <div className="col-span-12 md:col-span-6">
            <label className="block font-medium">District</label>
            <select
              {...register("district", { required: true })}
              className="select select-bordered w-full"
              disabled={!selectedRegion}
            >
              <option value="">Select District</option>
              {districtOptions.map((district, i) => (
                <option key={i} value={district}>
                  {district}
                </option>
              ))}
            </select>
          </div>

          {/* NID */}
          <div className="col-span-12 md:col-span-6">
            <label className="block font-medium">National ID Card Number</label>
            <input
              type="text"
              {...register("nid", { required: true })}
              className="input input-bordered w-full"
              placeholder="Enter your NID number"
            />
          </div>

          {/* Bike Brand */}
          <div className="col-span-12 md:col-span-6">
            <label className="block font-medium">Bike Brand</label>
            <input
              type="text"
              {...register("bikeBrand", { required: true })}
              className="input input-bordered w-full"
              placeholder="Example: Honda, Yamaha"
            />
          </div>

          {/* Bike Registration No */}
          <div className="col-span-12">
            <label className="block font-medium">Bike Registration Number</label>
            <input
              type="text"
              {...register("bikeRegNo", { required: true })}
              className="input input-bordered w-full"
              placeholder="Example: DHA-12-3456"
            />
          </div>

          {/* Submit Button */}
          <div data-aos='fade-up' className="col-span-12">
            <PrimaryButton className="w-full">
              Submit Application
            </PrimaryButton>
          </div>

        </form>
      </div>

      {/* RIGHT — LOTTIE IMAGE */}
      <div data-aos="fade-left" className="hidden lg:flex w-1/2 justify-center">
        <Lottie animationData={beARiderImage} className="max-w-lg" />
      </div>

    </section>
  );
};

export default BeARider;
