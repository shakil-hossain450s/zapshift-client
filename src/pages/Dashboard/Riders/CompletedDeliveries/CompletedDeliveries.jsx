import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FaBox, FaMapMarkerAlt, FaClock, FaDollarSign, FaCheckCircle, FaHistory, FaChartLine, FaMoneyBillWave, FaGift, FaWallet } from 'react-icons/fa';
import Swal from 'sweetalert2';
import useAxiosSecure from '../../../../hooks/useAxiosSecure';
import useAuth from '../../../../hooks/useAuth';

const CompletedDeliveries = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch completed deliveries for the rider
  const { data: completedDeliveries = [], isLoading, isError, refetch } = useQuery({
    queryKey: ['riderCompletedDeliveries', user?.email],
    queryFn: async () => {
      if (!user?.email) {
        throw new Error('Please log in to view complete deliveries');
      }

      const { data } = await axiosSecure.get(`/rider/completed-deliveries/${user.email}`);

      if (!data.success) {
        throw new Error(data.message || 'Failed to fetch complete deliveries');
      }

      return data.completedDeliveries || [];
    },
    enabled: !!user?.email,
  });

  // Mutation to add earnings to wallet
  const addEarningsMutation = useMutation({
    mutationFn: async ({ parcelId, amount, description }) => {
      const { data } = await axiosSecure.patch('/wallet/update-earnings', {
        amount,
        parcelId,
        description
      });
      return data;
    },
    onSuccess: (data, variables) => {
      // Show success message
      Swal.fire({
        title: 'Earnings Added!',
        text: `৳${variables.amount} has been added to your wallet`,
        icon: 'success',
        confirmButtonColor: '#10b981',
      });
      
      // Refresh wallet data
      queryClient.invalidateQueries(['riderWallet']);
    },
    onError: (error) => {
      Swal.fire({
        title: 'Failed to Add Earnings',
        text: error.response?.data?.message || 'Please try again',
        icon: 'error',
        confirmButtonColor: '#ef4444',
      });
    }
  });

  // Calculate rider earnings for each parcel
  const calculateRiderEarnings = (parcel) => {
    const deliveryCost = parcel.deliveryCost || 0;

    // If earnings are already recorded in the parcel, use them
    if (parcel.earnings && parcel.earnings.riderEarnings) {
      return {
        riderEarnings: parcel.earnings.riderEarnings,
        companyCommission: parcel.earnings.companyCommission,
        bonusAmount: parcel.earnings.bonusAmount || 0,
        baseEarnings: parcel.earnings.breakdown?.baseEarnings || deliveryCost * 0.75,
        isRecorded: true,
        isAddedToWallet: parcel.earnings.addedToWallet || false
      };
    }

    // Calculate earnings based on delivery cost (75% base commission)
    const baseEarnings = deliveryCost * 0.75;
    const bonusAmount = deliveryCost * 0.10; // 10% bonus for completed delivery
    const riderEarnings = baseEarnings + bonusAmount;
    const companyCommission = deliveryCost - riderEarnings;

    return {
      riderEarnings,
      companyCommission,
      bonusAmount,
      baseEarnings,
      isRecorded: false,
      isAddedToWallet: false
    };
  };

  // Function to add earnings to wallet
  const handleAddToWallet = async (parcel) => {
    const earnings = calculateRiderEarnings(parcel);
    
    // Check if already added to wallet
    if (earnings.isAddedToWallet) {
      Swal.fire({
        title: 'Already Added',
        text: 'Earnings for this delivery have already been added to your wallet',
        icon: 'info',
        confirmButtonColor: '#3b82f6',
      });
      return;
    }

    const result = await Swal.fire({
      title: 'Add Earnings to Wallet?',
      html: `
        <div class="text-left">
          <p>Add <strong>৳${earnings.riderEarnings.toFixed(2)}</strong> to your wallet for delivery:</p>
          <div class="mt-2 p-2 bg-blue-50 rounded">
            <p class="font-medium">${parcel.parcelName}</p>
            <p class="text-sm text-gray-600">${parcel.trackingId}</p>
          </div>
          <div class="mt-3 text-sm text-gray-600">
            <p><strong>Breakdown:</strong></p>
            <p>• Base Commission: ৳${earnings.baseEarnings.toFixed(2)}</p>
            <p>• Completion Bonus: ৳${earnings.bonusAmount.toFixed(2)}</p>
          </div>
        </div>
      `,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Add to Wallet',
      confirmButtonColor: '#10b981',
      cancelButtonColor: '#6b7280',
    });

    if (result.isConfirmed) {
      addEarningsMutation.mutate({
        parcelId: parcel._id,
        amount: earnings.riderEarnings,
        description: `Delivery earnings for ${parcel.trackingId} - ${parcel.parcelName}`
      });
    }
  };

  const handleViewDetails = async (parcel) => {
    const deliveryHistory = parcel.history?.find(item =>
      item.action === 'delivered' || item.status.includes('Delivered')
    );
    const earnings = calculateRiderEarnings(parcel);

    Swal.fire({
      width: 800,
      title: `Delivery Completed - ${parcel.trackingId}`,
      html: `
        <div class="text-left space-y-4">
          <!-- Parcel Info -->
          <div class="bg-green-50 p-4 rounded-lg border border-green-200">
            <h3 class="font-semibold text-lg text-green-800 mb-2">${parcel.parcelName}</h3>
            <div class="grid grid-cols-2 gap-2 text-sm">
              <div><strong>Type:</strong> ${parcel.parcelType}</div>
              <div><strong>Weight:</strong> ${parcel.weight} kg</div>
              <div><strong>Delivery Cost:</strong> ৳${parcel.deliveryCost}</div>
              <div><strong>Payment:</strong> ${parcel.paymentMethod}</div>
            </div>
          </div>

          <!-- Earnings Breakdown -->
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 class="font-semibold text-blue-800 mb-3 flex items-center gap-2">
              <FaMoneyBillWave class="inline" />
              Earnings Breakdown
              ${earnings.isAddedToWallet ? '<span class="ml-2 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Added to Wallet</span>' : ''}
            </h4>
            <div class="space-y-2 text-sm">
              <div class="flex justify-between">
                <span class="text-gray-600">Base Commission (75%):</span>
                <span class="font-semibold">৳${earnings.baseEarnings.toFixed(2)}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Completion Bonus:</span>
                <span class="font-semibold text-green-600">+৳${earnings.bonusAmount.toFixed(2)}</span>
              </div>
              <div class="flex justify-between border-t pt-2 mt-2">
                <span class="font-semibold text-lg">Your Earnings:</span>
                <span class="font-bold text-green-600 text-lg">৳${earnings.riderEarnings.toFixed(2)}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600 text-sm">Company Commission:</span>
                <span class="text-gray-600 text-sm">৳${earnings.companyCommission.toFixed(2)}</span>
              </div>
            </div>
            ${!earnings.isAddedToWallet ? `
              <button 
                onclick="window.addToWallet('${parcel._id}')" 
                class="w-full mt-3 bg-green-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
              >
                <FaWallet class="inline" />
                Add to Wallet
              </button>
            ` : ''}
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
              <h4 class="font-semibold text-green-800 mb-2">Delivered To</h4>
              <p class="text-sm"><strong>Name:</strong> ${parcel.receiver?.name}</p>
              <p class="text-sm"><strong>Phone:</strong> ${parcel.receiver?.contact}</p>
              <p class="text-sm"><strong>District:</strong> ${parcel.receiver?.district}</p>
              <p class="text-sm"><strong>Address:</strong> ${parcel.receiver?.address}</p>
            </div>
          </div>

          <!-- Delivery Timeline -->
          <div class="bg-gray-50 p-4 rounded-lg">
            <h4 class="font-semibold text-gray-800 mb-3">Delivery Timeline</h4>
            <div class="space-y-2 text-sm">
              <div class="flex justify-between">
                <span class="text-gray-600">Order Created:</span>
                <span class="font-medium">${new Date(parcel.createdAt).toLocaleString()}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Expected Delivery:</span>
                <span class="font-medium">${new Date(parcel.expectedDeliveryDate).toLocaleDateString()}</span>
              </div>
              ${deliveryHistory ? `
                <div class="flex justify-between">
                  <span class="text-gray-600">Actual Delivery:</span>
                  <span class="font-medium text-green-600">${new Date(deliveryHistory.time).toLocaleString()}</span>
                </div>
              ` : ''}
            </div>
          </div>

          <!-- Performance Stats -->
          <div class="bg-purple-50 p-4 rounded-lg">
            <h4 class="font-semibold text-purple-800 mb-2">Delivery Performance</h4>
            <div class="grid grid-cols-2 gap-2 text-sm">
              <div><strong>Delivery Time:</strong> ${calculateDeliveryTime(parcel)}</div>
              <div><strong>Status:</strong> <span class="text-green-600 font-medium">Successfully Delivered</span></div>
            </div>
          </div>
        </div>
      `,
      didOpen: () => {
        // Add global function for the Add to Wallet button in SweetAlert
        window.addToWallet = (parcelId) => {
          const parcel = completedDeliveries.find(p => p._id === parcelId);
          if (parcel) {
            handleAddToWallet(parcel);
            Swal.close();
          }
        };
      },
      willClose: () => {
        // Clean up global function
        window.addToWallet = undefined;
      },
      confirmButtonText: 'Close',
      confirmButtonColor: '#10b981',
    });
  };

  const calculateDeliveryTime = (parcel) => {
    const deliveryHistory = parcel.history?.find(item =>
      item.action === 'delivered' || item.status.includes('Delivered')
    );

    if (!deliveryHistory) return 'N/A';

    const created = new Date(parcel.createdAt);
    const delivered = new Date(deliveryHistory.time);
    const diffHours = Math.round((delivered - created) / (1000 * 60 * 60));

    if (diffHours < 24) {
      return `${diffHours} hours`;
    } else {
      const days = Math.round(diffHours / 24);
      return `${days} day${days > 1 ? 's' : ''}`;
    }
  };

  const handleExportHistory = () => {
    Swal.fire({
      title: 'Export Delivery History',
      text: 'This feature will be available soon!',
      icon: 'info',
      confirmButtonText: 'OK'
    });
  };

  // Calculate statistics with earnings
  const totalDeliveryCost = completedDeliveries.reduce((sum, parcel) => sum + (parcel.deliveryCost || 0), 0);
  const totalRiderEarnings = completedDeliveries.reduce((sum, parcel) => {
    const earnings = calculateRiderEarnings(parcel);
    return sum + earnings.riderEarnings;
  }, 0);
  const totalDeliveries = completedDeliveries.length;
  const totalBonuses = completedDeliveries.reduce((sum, parcel) => {
    const earnings = calculateRiderEarnings(parcel);
    return sum + earnings.bonusAmount;
  }, 0);

  // Count deliveries that have earnings added to wallet
  const deliveriesWithWalletEarnings = completedDeliveries.filter(parcel => {
    const earnings = calculateRiderEarnings(parcel);
    return earnings.isAddedToWallet;
  }).length;

  const onTimeDeliveries = completedDeliveries.filter(parcel => {
    const deliveryHistory = parcel.history?.find(item =>
      item.action === 'delivered' || item.status.includes('Delivered')
    );
    if (!deliveryHistory) return false;

    const delivered = new Date(deliveryHistory.time);
    const expected = new Date(parcel.expectedDeliveryDate);
    return delivered <= expected;
  }).length;

  const onTimeRate = totalDeliveries > 0 ? Math.round((onTimeDeliveries / totalDeliveries) * 100) : 0;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-10">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-10">
        <div className="text-red-600 mb-4">
          <p>Failed to load complete deliveries.</p>
        </div>
        <button onClick={() => refetch()} className="btn btn-primary btn-sm">
          Try Again
        </button>
      </div>
    );
  }

  if (!user?.email) {
    return (
      <div className="text-center py-10 text-gray-500">
        <p>Please log in to view your complete deliveries.</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          <FaCheckCircle className="text-green-600" />
          Complete Deliveries
          <span className="bg-green-100 text-green-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
            {completedDeliveries.length}
          </span>
        </h2>
        <div className="flex gap-2">
          <button onClick={() => refetch()} className="btn btn-sm btn-outline flex items-center gap-2">
            <FaHistory className="text-sm" />
            Refresh
          </button>
          <button onClick={handleExportHistory} className="btn btn-sm btn-primary flex items-center gap-2">
            <FaChartLine className="text-sm" />
            Export
          </button>
        </div>
      </div>

      {/* Statistics Cards - Updated with Wallet Info */}
      {completedDeliveries.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Your Total Earnings</p>
                <p className="text-2xl font-bold text-green-600">৳{totalRiderEarnings.toFixed(2)}</p>
                <p className="text-xs text-gray-500">from ৳{totalDeliveryCost} delivery cost</p>
              </div>
              <FaMoneyBillWave className="text-2xl text-green-500" />
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Deliveries</p>
                <p className="text-2xl font-bold text-blue-600">{totalDeliveries}</p>
              </div>
              <FaBox className="text-2xl text-blue-500" />
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">In Wallet</p>
                <p className="text-2xl font-bold text-purple-600">{deliveriesWithWalletEarnings}</p>
                <p className="text-xs text-gray-500">earnings added</p>
              </div>
              <FaWallet className="text-2xl text-purple-500" />
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">On-Time Rate</p>
                <p className="text-2xl font-bold text-green-600">{onTimeRate}%</p>
              </div>
              <FaCheckCircle className="text-2xl text-green-500" />
            </div>
          </div>
        </div>
      )}

      {/* Deliveries List */}
      {completedDeliveries.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <FaCheckCircle className="text-4xl text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Complete Deliveries</h3>
          <p className="text-gray-500">You haven't completed any deliveries yet.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {completedDeliveries.map((parcel) => {
            const earnings = calculateRiderEarnings(parcel);

            return (
              <div key={parcel._id} className="border border-green-200 rounded-lg p-4 bg-green-50 shadow-sm hover:shadow-md transition-shadow">
                {/* Header */}
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900">{parcel.parcelName}</h3>
                    <p className="text-sm text-gray-500 font-mono">{parcel.trackingId}</p>
                  </div>
                  <div className="text-right">
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                      Delivered
                    </span>
                    <p className="text-sm font-semibold text-green-600 mt-1">
                      Earned: ৳{earnings.riderEarnings.toFixed(2)}
                    </p>
                    {earnings.isAddedToWallet && (
                      <p className="text-xs text-purple-600 mt-1 flex items-center gap-1 justify-end">
                        <FaWallet className="text-xs" />
                        In Wallet
                      </p>
                    )}
                  </div>
                </div>

                {/* Route */}
                <div className="flex items-center gap-2 mb-3 text-sm text-gray-600">
                  <FaMapMarkerAlt className="text-red-500" />
                  <span className="font-medium">{parcel.sender?.district}</span>
                  <span className="text-gray-400">→</span>
                  <span className="font-medium">{parcel.receiver?.district}</span>
                </div>

                {/* Earnings & Details */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4 text-sm">
                  <div className="flex items-center gap-1">
                    <FaBox className="text-gray-400 text-xs" />
                    <span className="capitalize">{parcel.parcelType?.replace('-', ' ')}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FaClock className="text-gray-400 text-xs" />
                    <span>{calculateDeliveryTime(parcel)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FaDollarSign className="text-green-500 text-xs" />
                    <span className="font-semibold">৳{parcel.deliveryCost}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FaGift className="text-yellow-500 text-xs" />
                    <span className="text-yellow-600">+৳{earnings.bonusAmount.toFixed(2)}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    Delivered on: {(() => {
                      const deliveryHistory = parcel.history?.find(item =>
                        item.action === 'delivered' || item.status.includes('Delivered')
                      );
                      return deliveryHistory ? new Date(deliveryHistory.time).toLocaleDateString() : 'N/A';
                    })()}
                  </span>
                  <div className="flex gap-2">
                    {!earnings.isAddedToWallet && (
                      <button
                        onClick={() => handleAddToWallet(parcel)}
                        className="btn btn-sm btn-primary flex items-center gap-2"
                        disabled={addEarningsMutation.isLoading}
                      >
                        <FaWallet className="text-xs" />
                        {addEarningsMutation.isLoading ? 'Adding...' : 'Add to Wallet'}
                      </button>
                    )}
                    <button
                      onClick={() => handleViewDetails(parcel)}
                      className="btn btn-sm btn-outline"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CompletedDeliveries;