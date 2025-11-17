import { FaCheck, FaEye, FaTimes } from 'react-icons/fa';

const PendingRidersRow = ({ rider, index, handleViewRider, handleUpdateStatus }) => {
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
            ${rider.status === 'pending' && 'bg-yellow-100 text-yellow-700'}
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

        {/* Accept Button */}
        <button
          onClick={() => handleUpdateStatus(rider._id, 'approved', rider.email)}
          className="btn btn-sm shadow-none border-0 bg-green-500 text-white hover:bg-green-600"
          title="Accept Rider"
        >
          <FaCheck />
        </button>

        {/* Reject Button */}
        <button
          onClick={() => handleUpdateStatus(rider._id, 'rejected', rider.email)}
          className="btn btn-sm shadow-none border-0 bg-red-500 text-white hover:bg-red-600"
          title="Reject Rider"
        >
          <FaTimes />
        </button>

      </td>
    </tr>

  );
};

export default PendingRidersRow;