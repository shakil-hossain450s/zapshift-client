import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { FaBox, FaMapMarkerAlt, FaClock, FaDollarSign, FaMotorcycle } from 'react-icons/fa';
import Swal from 'sweetalert2';
import useAxiosSecure from '../../../../hooks/useAxiosSecure';
import useAuth from '../../../../hooks/useAuth';

const PendingDeliveries = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();

  // Fetch pending deliveries using rider's email from auth context
  const { data: pendingDeliveries = [], isLoading, isError, refetch } = useQuery({
    queryKey: ['riderPendingDeliveries', user?.email],
    queryFn: async () => {
      if (!user?.email) {
        throw new Error('Please log in to view deliveries');
      }

      const { data } = await axiosSecure.get(`/rider/pending-deliveries/${user.email}`);
      
      if (!data.success) {
        throw new Error(data.message || 'Failed to fetch deliveries');
      }

      return data.pendingDeliveries || [];
    },
    enabled: !!user?.email, // Only fetch when user email is available
  });

  const handleStartDelivery = async (parcel) => {
    const result = await Swal.fire({
      title: 'Start Delivery?',
      html: `
        <div class="text-left">
          <p>Start delivery for <strong>${parcel.parcelName}</strong>?</p>
          <p class="text-sm text-gray-600 mt-2">
            <strong>Tracking ID:</strong> ${parcel.trackingId}<br>
            <strong>Route:</strong> ${parcel.sender?.district} → ${parcel.receiver?.district}
          </p>
        </div>
      `,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#10b981',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Start Delivery'
    });

    if (result.isConfirmed) {
      try {
        // Update parcel status to "in_transit"
        const { data } = await axiosSecure.patch(`/parcel/${parcel._id}/status`, {
          deliveryStatus: 'in_transit',
          parcelStatus: 'In Transit'
        });

        if (data.success) {
          Swal.fire('Started!', 'Delivery is now in transit.', 'success');
          refetch(); // Refresh the list
        }
      } catch (err) {
        console.error('Error starting delivery:', err);
        Swal.fire('Error', 'Failed to start delivery', 'error');
      }
    }
  };

  const handleViewDetails = (parcel) => {
    Swal.fire({
      width: 700,
      title: `Parcel Details - ${parcel.trackingId}`,
      html: `
        <div class="text-left space-y-4">
          <!-- Parcel Info -->
          <div class="bg-gray-50 p-4 rounded-lg">
            <h3 class="font-semibold text-lg mb-2">${parcel.parcelName}</h3>
            <div class="grid grid-cols-2 gap-2 text-sm">
              <div><strong>Type:</strong> ${parcel.parcelType}</div>
              <div><strong>Weight:</strong> ${parcel.weight} kg</div>
              <div><strong>Cost:</strong> ৳${parcel.deliveryCost}</div>
              <div><strong>Payment:</strong> ${parcel.paymentMethod}</div>
            </div>
          </div>

          <!-- Route Information -->
          <div class="grid grid-cols-2 gap-4">
            <div class="bg-blue-50 p-3 rounded-lg">
              <h4 class="font-semibold text-blue-800 mb-2">Pickup From</h4>
              <p class="text-sm"><strong>Name:</strong> ${parcel.sender?.name}</p>
              <p class="text-sm"><strong>Phone:</strong> ${parcel.sender?.contact}</p>
              <p class="text-sm"><strong>District:</strong> ${parcel.sender?.district}</p>
              <p class="text-sm"><strong>Address:</strong> ${parcel.sender?.address}</p>
            </div>
            <div class="bg-green-50 p-3 rounded-lg">
              <h4 class="font-semibold text-green-800 mb-2">Deliver To</h4>
              <p class="text-sm"><strong>Name:</strong> ${parcel.receiver?.name}</p>
              <p class="text-sm"><strong>Phone:</strong> ${parcel.receiver?.contact}</p>
              <p class="text-sm"><strong>District:</strong> ${parcel.receiver?.district}</p>
              <p class="text-sm"><strong>Address:</strong> ${parcel.receiver?.address}</p>
            </div>
          </div>

          <!-- Instructions -->
          <div class="bg-yellow-50 p-3 rounded-lg">
            <h4 class="font-semibold text-yellow-800 mb-2">Delivery Instructions</h4>
            <p class="text-sm"><strong>Pickup Note:</strong> ${parcel.pickupInstruction || 'No special instructions'}</p>
            <p class="text-sm"><strong>Delivery Note:</strong> ${parcel.deliveryInstruction || 'No special instructions'}</p>
          </div>

          <!-- Timeline -->
          <div class="bg-purple-50 p-3 rounded-lg">
            <div class="grid grid-cols-2 gap-2 text-sm">
              <div><strong>Created:</strong> ${new Date(parcel.createdAt).toLocaleDateString()}</div>
              <div><strong>Expected Delivery:</strong> ${new Date(parcel.expectedDeliveryDate).toLocaleDateString()}</div>
            </div>
          </div>
        </div>
      `,
      confirmButtonText: 'Close',
      confirmButtonColor: '#4f46e5',
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-10">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-10">
        <div className="text-red-600 mb-4">
          <p>Failed to load pending deliveries.</p>
        </div>
        <button 
          onClick={() => refetch()} 
          className="btn btn-primary btn-sm"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!user?.email) {
    return (
      <div className="text-center py-10 text-gray-500">
        <p>Please log in to view your deliveries.</p>
      </div>
    );
  }

  return (
    <div className="">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          <FaMotorcycle className="text-blue-600" />
          My Pending Deliveries
          <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
            {pendingDeliveries.length}
          </span>
        </h2>
        <button 
          onClick={() => refetch()} 
          className="btn btn-sm btn-outline flex items-center gap-2"
        >
          <FaClock className="text-sm" />
          Refresh
        </button>
      </div>

      {pendingDeliveries.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <FaBox className="text-4xl text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Pending Deliveries</h3>
          <p className="text-gray-500">You don't have any deliveries assigned at the moment.</p>
        </div>
      ) : (
        <div data-aos='zoom-out' className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {pendingDeliveries.map((parcel) => (
            <div key={parcel._id} className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow">
              {/* Header */}
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold text-lg text-gray-900">{parcel.parcelName}</h3>
                  <p className="text-sm text-gray-500 font-mono">{parcel.trackingId}</p>
                </div>
                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                  Ready for Pickup
                </span>
              </div>

              {/* Route */}
              <div className="flex items-center gap-2 mb-3 text-sm text-gray-600">
                <FaMapMarkerAlt className="text-red-500" />
                <span className="font-medium">{parcel.sender?.district}</span>
                <span className="text-gray-400">→</span>
                <span className="font-medium">{parcel.receiver?.district}</span>
              </div>

              {/* Details */}
              <div className="grid grid-cols-2 gap-2 mb-4 text-sm">
                <div className="flex items-center gap-1">
                  <FaBox className="text-gray-400 text-xs" />
                  <span className="capitalize">${parcel.parcelType?.replace('-', ' ')}</span>
                </div>
                <div className="flex items-center gap-1">
                  <FaDollarSign className="text-green-500 text-xs" />
                  <span className="font-semibold">৳{parcel.deliveryCost}</span>
                </div>
                <div className="col-span-2 text-xs text-gray-500">
                  <FaClock className="inline mr-1" />
                  Expected: {new Date(parcel.expectedDeliveryDate).toLocaleDateString()}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => handleViewDetails(parcel)}
                  className="flex-1 btn btn-sm btn-outline"
                >
                  Details
                </button>
                <button
                  onClick={() => handleStartDelivery(parcel)}
                  className="flex-1 btn btn-sm btn-primary"
                >
                  Start Delivery
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PendingDeliveries;