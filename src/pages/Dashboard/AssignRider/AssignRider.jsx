import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { FaMotorcycle, FaTruckLoading } from 'react-icons/fa';
import Swal from 'sweetalert2';
import warehouseData from '../../../assets/data/warehouses.json';

const AssignRider = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const [selectedParcel, setSelectedParcel] = useState(null);
  const [riders, setRiders] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRider, setSelectedRider] = useState('');

  // Fetch only parcels that need rider assignment (Not Dispatched)
  const { data: parcels = [], isLoading, isError } = useQuery({
    queryKey: ['assignableParcels'],
    queryFn: async () => {
      const { data } = await axiosSecure.get(
        '/admin/parcels?parcelStatus=Processing&paymentStatus=Paid&deliveryStatus=Not Dispatched'
      );
      return data.parcels.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    },
  });

  // Migration function to update existing parcels with rider fields
  const migrateParcels = async () => {
    try {
      const result = await Swal.fire({
        title: 'Run Migration?',
        text: 'This will update existing parcels with rider fields. Do you want to continue?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#10b981',
        cancelButtonColor: '#6b7280',
        confirmButtonText: 'Yes, run migration!'
      });

      if (result.isConfirmed) {
        const { data } = await axiosSecure.post('/admin/migrate-rider-fields');
        if (data.success) {
          Swal.fire('Success!', `Migration completed. Updated ${data.updatedCount} parcels.`, 'success');
          queryClient.invalidateQueries(['assignableParcels']);
        } else {
          Swal.fire('Error', data.message || 'Migration failed', 'error');
        }
      }
    } catch (err) {
      console.error('Migration error:', err);
      Swal.fire('Error', 'Migration failed', 'error');
    }
  };

  if (isLoading) return <p>Loading parcels...</p>;
  if (isError) return <div className="text-center py-10 text-red-600">Error loading parcels.</div>;

  // Open modal and load riders
  const handleAssignClick = async (parcel) => {
    setSelectedParcel(parcel);
    setSelectedRider('');
    setModalOpen(true);

    try {
      const warehouse = warehouseData.find(w => w.name === parcel.receiver?.warehouse);
      const district = warehouse?.district || parcel.receiver?.district;

      console.log('Parcel district:', district);
      console.log('Parcel receiver:', parcel.receiver);

      if (!district) {
        Swal.fire('Error', 'No district found for this parcel', 'error');
        return;
      }

      const { data } = await axiosSecure.get(`/riders?district=${encodeURIComponent(district)}`);
      console.log('Riders API response:', data);

      if (data.success) {
        console.log('Available riders:', data.riders);
        setRiders(data.riders);

        if (data.riders.length === 0) {
          Swal.fire('Info', `No available riders found in ${district} district`, 'info');
        }
      } else {
        console.error('API error:', data.message);
        Swal.fire('Error', data.message || 'Failed to load riders', 'error');
      }
    } catch (err) {
      console.error('Error loading riders:', err);
      Swal.fire('Error', err.response?.data?.message || 'Failed to load riders', 'error');
    }
  };

  // Assign rider
  const handleAssignRider = async () => {
    if (!selectedRider) return Swal.fire('Select Rider', 'Please select a rider first', 'info');

    const selectedRiderData = riders.find(r => r._id === selectedRider);

    const result = await Swal.fire({
      title: 'Assign Rider?',
      html: `
        <div class="text-left">
          <p>Assign <strong>${selectedRiderData?.name}</strong> to parcel <strong>${selectedParcel.trackingId}</strong>?</p>
          <p class="text-sm text-gray-600 mt-2">This will update:</p>
          <ul class="text-sm text-gray-600 ml-4">
            <li>• Rider ID: ${selectedRiderData?._id}</li>
            <li>• Rider Email: ${selectedRiderData?.email}</li>
            <li>• Rider Name: ${selectedRiderData?.name}</li>
            <li>• Delivery Status: rider_assigned</li>
          </ul>
        </div>
      `,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#10b981',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, Assign Rider!'
    });

    if (result.isConfirmed) {
      try {
        const { data } = await axiosSecure.put(`/assign-rider/${selectedParcel._id}`, {
          riderId: selectedRider
        });

        if (data.success) {
          console.log('Assignment successful, parcel data:', data.parcel);
          // Updated success message to show all rider info
          Swal.fire({
            title: 'Assigned Successfully!',
            html: `
              <div class="text-left">
                <p>Rider assigned to parcel <strong>${selectedParcel.trackingId}</strong></p>
                <div class="mt-3 space-y-1 text-sm">
                  <p class="text-green-600">✓ Rider Name: <strong>${data.parcel.riderName}</strong></p>
                  <p class="text-green-600">✓ Rider Email: <strong>${data.parcel.riderEmail}</strong></p>
                  <p class="text-green-600">✓ Rider ID: <strong>${data.parcel.riderId}</strong></p>
                  <p class="text-green-600">✓ Delivery Status: <strong>${data.parcel.deliveryStatus}</strong></p>
                </div>
                <p class="text-sm text-gray-600 mt-2">Parcel has been moved to assigned parcels.</p>
              </div>
            `,
            icon: 'success',
          });
          setModalOpen(false);
          queryClient.invalidateQueries(['assignableParcels']);
        } else {
          Swal.fire('Error', data.message || 'Failed to assign rider', 'error');
        }
      } catch (err) {
        console.error(err);
        Swal.fire('Error', err.response?.data?.message || 'Failed to assign rider', 'error');
      }
    }
  };

  // Check if rider is available (not currently assigned to ANOTHER delivery)
  const isRiderAvailable = (rider) => {
    return !rider.currentDelivery || rider.currentDelivery === selectedParcel?._id;
  };

  return (
    <div data-aos='fade-right'>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          <FaMotorcycle className="text-blue-600" /> Assign Rider
        </h2>
        <button
          onClick={migrateParcels}
          className="btn btn-warning btn-sm"
          title="Update existing parcels with rider fields"
        >
          Run Migration
        </button>
      </div>

      {parcels.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          No parcels available for assignment. All parcels have been assigned riders.
        </div>
      ) : (
        <div className="overflow-x-auto shadow rounded-lg border border-gray-200">
          <table className="table w-full">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th>#</th>
                <th>Tracking ID</th>
                <th>Parcel Name</th>
                <th>Receiver District</th>
                <th>Delivery Cost</th>
                <th>Payment</th>
                <th>Status</th>
                <th>Delivery Status</th>
                <th>Created</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {parcels.map((parcel, index) => (
                <tr key={parcel._id} className="hover:bg-gray-50">
                  <td>{index + 1}</td>
                  <td className="font-mono font-semibold">{parcel.trackingId}</td>
                  <td>{parcel.parcelName}</td>
                  <td>{parcel.receiver?.district || 'N/A'}</td>
                  <td>৳{parcel.deliveryCost}</td>
                  <td>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      parcel.paymentStatus === 'Paid' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {parcel.paymentStatus}
                    </span>
                  </td>
                  <td>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      parcel.parcelStatus === 'Processing' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {parcel.parcelStatus}
                    </span>
                  </td>
                  <td>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      parcel.deliveryStatus === 'Not Dispatched' 
                        ? 'bg-gray-100 text-gray-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {parcel.deliveryStatus}
                    </span>
                  </td>
                  <td>{new Date(parcel.createdAt).toLocaleDateString('en-BD', { timeZone: 'Asia/Dhaka' })}</td>
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
            <h3 className="text-xl font-semibold mb-4">Select Rider for {selectedParcel?.trackingId}</h3>

            {riders.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No riders available for this district</p>
            ) : (
              <>
                <select
                  className="w-full border border-gray-300 rounded-lg p-3 mb-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={selectedRider}
                  onChange={(e) => setSelectedRider(e.target.value)}
                >
                  <option value="">-- Select Rider --</option>
                  {riders.map((rider) => (
                    <option
                      key={rider._id}
                      value={rider._id}
                      disabled={!isRiderAvailable(rider)}
                      className={!isRiderAvailable(rider) ? 'text-gray-400' : ''}
                    >
                      {rider.name} ({rider.bikeRegNo})
                      {!isRiderAvailable(rider) && ' - Currently on another delivery'}
                    </option>
                  ))}
                </select>

                <div className="mb-4">
                  <p className="text-sm text-gray-600">
                    Available Riders: {riders.filter(rider => isRiderAvailable(rider)).length} / {riders.length}
                  </p>
                </div>

                {selectedRider && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                    <h4 className="font-semibold text-blue-800 mb-2">Selected Rider Details:</h4>
                    <div className="space-y-1 text-sm">
                      <p><strong>ID:</strong> {riders.find(r => r._id === selectedRider)?._id}</p>
                      <p><strong>Name:</strong> {riders.find(r => r._id === selectedRider)?.name}</p>
                      <p><strong>Email:</strong> {riders.find(r => r._id === selectedRider)?.email}</p>
                      <p><strong>Bike:</strong> {riders.find(r => r._id === selectedRider)?.bikeRegNo}</p>
                    </div>
                    {!isRiderAvailable(riders.find(r => r._id === selectedRider)) && (
                      <p className="text-sm text-red-600 mt-2">
                        ⚠️ This rider is currently assigned to another delivery
                      </p>
                    )}
                  </div>
                )}
              </>
            )}

            <div className="flex justify-end gap-2">
              <button
                className="btn btn-secondary px-4 py-2"
                onClick={() => setModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary px-4 py-2"
                onClick={handleAssignRider}
                disabled={!selectedRider || !isRiderAvailable(riders.find(r => r._id === selectedRider))}
              >
                Assign Rider
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignRider;