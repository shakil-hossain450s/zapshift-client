import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { FaMotorcycle } from 'react-icons/fa';
import Swal from 'sweetalert2';
import warehouseData from '../../../assets/data/warehouses.json'; // local JSON

const AssignRider = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const [selectedParcel, setSelectedParcel] = useState(null);
  const [riders, setRiders] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRider, setSelectedRider] = useState('');

  // Fetch eligible parcels
  const { data: parcels = [], isLoading, isError } = useQuery({
    queryKey: ['assignableParcels'],
    queryFn: async () => {
      const { data } = await axiosSecure.get(
        '/admin/parcels?parcelStatus=Processing&paymentStatus=Paid&deliveryStatus=Not%20Dispatched'
      );
      return data.parcels.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)); // oldest first
    },
  });

  if (isLoading) return <p>Loading parcels...</p>;
  if (isError) return <div className="text-center py-10 text-red-600">Error loading parcels.</div>;

  // Open modal and load riders
  const handleAssignClick = async (parcel) => {
    setSelectedParcel(parcel);
    setSelectedRider('');
    setModalOpen(true);

    try {
      // Find warehouse district for the parcel
      const warehouse = warehouseData.find(w => w.name === parcel.receiver.warehouse);
      const district = warehouse?.district || parcel.receiver.district;

      const { data } = await axiosSecure.get(`/riders?district=${district}`);
      if (data.success) setRiders(data.riders);
    } catch (err) {
      console.error(err);
      Swal.fire('Error', 'Failed to load riders', 'error');
    }
  };

  // Assign rider
  const handleAssignRider = async () => {
    if (!selectedRider) return Swal.fire('Select Rider', 'Please select a rider first', 'info');

    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `Assign this rider to parcel ${selectedParcel.trackingId}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, assign',
    });

    if (result.isConfirmed) {
      try {
        const { data } = await axiosSecure.put(`/assign-rider/${selectedParcel._id}`, { riderId: selectedRider });
        if (data.success) {
          Swal.fire('Assigned!', 'Rider assigned successfully', 'success');
          setModalOpen(false);
          queryClient.invalidateQueries(['assignableParcels']);
        } else {
          Swal.fire('Error', data.message || 'Failed to assign rider', 'error');
        }
      } catch (err) {
        console.error(err);
        Swal.fire('Error', 'Failed to assign rider', 'error');
      }
    }
  };

  console.log(parcels);

  return (
    <div data-aos='fade-right'>
      <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
        <FaMotorcycle className="text-blue-600" /> Assign Rider
      </h2>

      {parcels.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          No parcels available for assignment.
        </div>
      ) : (
        <div className="overflow-x-auto shadow rounded-lg border border-gray-200">
          <table className="table w-full">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th>#</th>
                <th>Tracking ID</th>
                <th>Parcel Name</th>
                <th>Region</th>
                <th>District</th>
                <th>Delivery Cost</th>
                <th>Payment</th>
                <th>Status</th>
                <th>Created</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {parcels.map((parcel, index) => (
                <tr key={parcel._id} className="hover:bg-gray-50">
                  <td>{index + 1}</td>
                  <td>{parcel.trackingId}</td>
                  <td>{parcel.parcelName}</td>
                  <td>{parcel.receiver.region}</td>
                  <td>{parcel.receiver.district}</td>
                  <td>৳{parcel.deliveryCost}</td>
                  <td>{parcel.paymentStatus}</td>
                  <td>{parcel.parcelStatus}</td>
                  <td>{new Date(parcel.createdAt).toLocaleDateString("en-BD", { timeZone: "Asia/Dhaka" })}</td>
                  <td className="text-center">
                    <button
                      className="btn btn-sm btn-primary"
                      onClick={() => handleAssignClick(parcel)}
                    >
                      Assign Rider
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-xl font-semibold mb-4">Select Rider for {selectedParcel.trackingId}</h3>
            {riders.length === 0 ? (
              <p>No riders available for this district</p>
            ) : (
              <select
                className="w-full border rounded p-2 mb-4"
                value={selectedRider}
                onChange={e => setSelectedRider(e.target.value)}
              >
                <option value="">-- Select Rider --</option>
                {riders.map(r => (
                  <option key={r._id} value={r._id}>{r.name} ({r.bikeRegNo})</option>
                ))}
              </select>
            )}

            <div className="flex justify-end gap-2">
              <button
                className="btn btn-secondary"
                onClick={() => setModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={handleAssignRider}
              >
                Assign
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignRider;
