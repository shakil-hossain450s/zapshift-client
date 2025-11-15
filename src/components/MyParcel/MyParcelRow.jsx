import React from 'react';
import { FaBox, FaClock, FaEye, FaMoneyBillWave, FaTrash, FaCreditCard } from 'react-icons/fa';
import { Link } from 'react-router';

const MyParcelRow = ({ parcel, index, handleView, handleDelete, handlePay }) => {
  const {
    _id,
    trackingId,
    parcelName,
    parcelType,
    deliveryCost,
    paymentMethod,
    paymentStatus,
    parcelStatus,
    createdAtReadable
  } = parcel;

  return (
    <tr className="hover:bg-gray-50">
      <td>{index + 1}</td>
      <td className="font-mono text-green-700 font-medium">{trackingId}</td>
      <td className='flex gap-1'>
        {parcelName}
        <span className='badge badge-sm text-[10px]'>
          {parcelType.charAt(0).toUpperCase() + parcelType.slice(1)}
        </span>
      </td>
      <td>৳{deliveryCost}</td>
      <td className="flex items-center gap-1">
        <FaMoneyBillWave className="text-green-500" />
        <span>
          {paymentMethod}
          <span
            className={`ml-1 text-xs px-2 py-0.5 rounded-full ${paymentStatus === "Paid"
                ? "bg-green-100 text-green-700"
                : "bg-yellow-100 text-yellow-700"
              }`}
          >
            {paymentStatus}
          </span>
        </span>
      </td>
      <td>
        <span
          className={`text-xs font-medium px-2 py-1 rounded-full ${parcelStatus === "Delivered"
              ? "bg-green-100 text-green-700"
              : parcelStatus === "Processing"
                ? "bg-blue-100 text-blue-700"
                : "bg-gray-100 text-gray-700"
            }`}
        >
          {parcelStatus}
        </span>
      </td>
      <td className="text-sm text-gray-600">
        <FaClock className="inline-block mr-1 text-gray-400" />
        {createdAtReadable || "-"}
      </td>

      {/* 🔹 Action Buttons */}
      <td className="flex items-center justify-center gap-3 !cursor-default">

        <button
          onClick={() => handlePay(parcel)}
          disabled={paymentStatus === 'Paid'}
          className={`btn btn-sm bg-green-500 text-white disabled:bg-gray-600 ${paymentStatus.toLowerCase() === "paid" ? "force-not-allowed" : ""}`}
        >
          <FaCreditCard /> {paymentStatus.toLowerCase() === 'paid' ? 'Paid' : 'Pay'}
        </button>

        <button
          onClick={() => handleView(parcel)}
          className="btn btn-sm cursor-pointer bg-blue-500 text-white"
          title="View Details"
        >
          <FaEye />
        </button>

        <button
          onClick={() => handleDelete(parcel)}
          disabled={paymentStatus.toLowerCase() === "paid"}
          className={`btn btn-sm bg-red-500 text-white disabled:bg-gray-600 ${paymentStatus.toLowerCase() === "paid" ? "force-not-allowed" : ""}`}
          title="Delete Parcel"
        >
          <FaTrash />
        </button>

      </td>
    </tr>
  );
};

export default MyParcelRow;
