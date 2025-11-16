import React from 'react';
import { FaCheck, FaEye, FaTrash, FaUserSlash } from 'react-icons/fa';

const ActiveRidersRow = ({ rider, index, handleViewRider, handleDeactivateRider }) => {
  return (
    <tr key={rider._id} className="hover:bg-gray-50">
      <td>{index + 1}</td>

      {/* Name */}
      <td className="font-medium">{rider.name}</td>

      {/* Email */}
      <td className="text-gray-600">{rider.email}</td>

      {/* Region */}
      <td>
        <span className="badge badge-sm bg-blue-100 text-blue-700">
          {rider.region}
        </span>
      </td>

      {/* Bike Registration */}
      <td>
        <div className="flex flex-col leading-tight">
          <span className="font-semibold">{rider.bikeBrand}</span>
          <span className="text-xs opacity-70">{rider.bikeRegNo}</span>
        </div>
      </td>

      {/* Status */}
      <td>
        <span className={`text-xs font-medium px-2 py-1 rounded-full 
            ${rider.status === 'approved' && 'bg-green-100 text-green-700'}
          `}>
          {rider.status}
        </span>
      </td>

      {/* Actions */}
      <td className="flex items-center justify-center gap-3 cursor-default!">

        {/* View Button */}
        <button
          onClick={() => handleViewRider(rider)}
          className="btn btn-sm shadow-none border-0 cursor-pointer bg-blue-500 text-white"
          title="View Details"
        >
          <FaEye />
        </button>

        {/* Deactivate Button */}
        <button
          onClick={() => handleDeactivateRider(rider, 'deactivate')}
          className="btn btn-sm shadow-none border-0 bg-red-500 text-white hover:bg-red-600"
          title="Deactivate Rider"
        >
          <FaUserSlash />
        </button>

      </td>
    </tr>

  );
};

export default ActiveRidersRow;