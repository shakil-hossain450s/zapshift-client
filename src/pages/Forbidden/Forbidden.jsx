import React from "react";
import { FaBan, FaArrowLeft, FaLock } from "react-icons/fa";
import { Link } from "react-router";

const Forbidden = () => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center p-5">
      <div className="bg-white shadow-lg rounded-xl p-10 max-w-md w-full text-center border border-gray-200">

        {/* Icon */}
        <div className="flex justify-center mb-4">
          <FaLock className="text-red-500" size={80} />
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Access Denied
        </h1>

        {/* Subtitle */}
        <p className="text-gray-600 mb-6">
          You don’t have permission to view this page.
        </p>

        {/* Buttons */}
        <div className="flex flex-col gap-3">
          <Link
            to="/dashboard"
            className="btn bg-[#CAEB66] text-black border-[#CAEB66] hover:bg-[#b8d95e]"
          >
            Go to Dashboard
          </Link>

          <Link
            to="/"
            className="btn btn-outline flex items-center gap-2"
          >
            <FaArrowLeft /> Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Forbidden;
