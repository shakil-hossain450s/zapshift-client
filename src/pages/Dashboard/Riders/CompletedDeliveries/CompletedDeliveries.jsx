import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  FaBox,
  FaMapMarkerAlt,
  FaClock,
  FaDollarSign,
  FaCheckCircle,
  FaHistory,
  FaChartLine,
  FaMoneyBillWave,
  FaGift,
  FaWallet,
  FaCheck,
  FaSpinner
} from 'react-icons/fa';
import Swal from 'sweetalert2';
import useAxiosSecure from '../../../../hooks/useAxiosSecure';
import useAuth from '../../../../hooks/useAuth';

const CompletedDeliveries = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [processingParcels, setProcessingParcels] = useState(new Set());
  const [addedToWalletParcels, setAddedToWalletParcels] = useState(new Set());

  // Fetch completed deliveries for the rider
  const {
    data: completedDeliveries = [],
    isLoading,
    isError,
    refetch
  } = useQuery({
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
    refetchOnWindowFocus: false,
  });

  // Mutation to add earnings to wallet
  const addEarningsMutation = useMutation({
    mutationFn: async ({ parcelId, amount, description }) => {
      // Add to processing set immediately for UI feedback
      setProcessingParcels(prev => new Set(prev).add(parcelId));
      
      const { data } = await axiosSecure.patch('/wallet/update-earnings', {
        amount,
        parcelId,
        description
      });
      return data;
    },
    onSuccess: (data, variables) => {
      // Remove from processing set and add to added set
      setProcessingParcels(prev => {
        const newSet = new Set(prev);
        newSet.delete(variables.parcelId);
        return newSet;
      });
      
      // PERMANENTLY mark this parcel as added to wallet
      setAddedToWalletParcels(prev => new Set(prev).add(variables.parcelId));

      // Show success message
      Swal.fire({
        title: '💰 Earnings Added!',
        text: `৳${variables.amount} has been added to your wallet`,
        icon: 'success',
        confirmButtonColor: '#10b981',
        timer: 3000,
        showConfirmButton: false,
      });

      // Refresh both queries
      queryClient.invalidateQueries(['riderWallet']);
      queryClient.invalidateQueries(['riderCompletedDeliveries']);
    },
    onError: (error, variables) => {
      // Remove from processing set on error
      setProcessingParcels(prev => {
        const newSet = new Set(prev);
        newSet.delete(variables.parcelId);
        return newSet;
      });

      Swal.fire({
        title: '❌ Failed to Add Earnings',
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
        isAddedToWallet: parcel.earnings.addedToWallet || addedToWalletParcels.has(parcel._id)
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
      isAddedToWallet: addedToWalletParcels.has(parcel._id)
    };
  };

  // Function to add earnings to wallet
  const handleAddToWallet = async (parcel) => {
    const earnings = calculateRiderEarnings(parcel);

    // PERMANENTLY DISABLED: Check if already added to wallet
    if (earnings.isAddedToWallet) {
      Swal.fire({
        title: '✅ Already in Wallet',
        text: 'Earnings for this delivery have already been added to your wallet and cannot be added again.',
        icon: 'info',
        confirmButtonColor: '#3b82f6',
      });
      return;
    }

    // Check if currently processing
    if (processingParcels.has(parcel._id)) {
      return;
    }

    const result = await Swal.fire({
      title: 'Add to Wallet?',
      html: `
        <div class="text-left space-y-3">
          <div class="text-center">
            <p class="text-2xl font-bold text-green-600">৳${earnings.riderEarnings.toFixed(2)}</p>
            <p class="text-sm text-gray-600">Total Earnings</p>
          </div>
          
          <div class="bg-blue-50 p-3 rounded-lg border border-blue-200">
            <p class="font-semibold text-gray-900">${parcel.parcelName}</p>
            <p class="text-sm text-gray-600 font-mono">${parcel.trackingId}</p>
          </div>
          
          <div class="bg-gray-50 p-3 rounded text-sm">
            <p class="font-medium text-gray-700 mb-2">Earnings Breakdown:</p>
            <div class="space-y-1">
              <div class="flex justify-between">
                <span class="text-gray-600">Base Commission (75%):</span>
                <span class="font-medium">৳${earnings.baseEarnings.toFixed(2)}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Completion Bonus:</span>
                <span class="font-medium text-green-600">+৳${earnings.bonusAmount.toFixed(2)}</span>
              </div>
              <div class="border-t pt-1 mt-1">
                <div class="flex justify-between font-semibold">
                  <span>Total:</span>
                  <span class="text-green-600">৳${earnings.riderEarnings.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p class="text-sm text-yellow-800 font-medium">⚠️ Important</p>
            <p class="text-xs text-yellow-700 mt-1">This action cannot be undone. Earnings will be permanently added to your wallet.</p>
          </div>
        </div>
      `,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, Add to Wallet',
      confirmButtonColor: '#10b981',
      cancelButtonText: 'Cancel',
      cancelButtonColor: '#6b7280',
      reverseButtons: true,
      customClass: {
        popup: 'rounded-2xl',
        confirmButton: 'px-6 py-2 rounded-lg',
        cancelButton: 'px-6 py-2 rounded-lg'
      }
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
    const isProcessing = processingParcels.has(parcel._id);
    const isAdded = earnings.isAddedToWallet;

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
              ${isAdded ?
          '<span class="ml-2 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">In Wallet</span>' :
          ''}
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
            ${!isAdded && !isProcessing ? `
              <button 
                onclick="window.addToWallet('${parcel._id}')" 
                class="w-full mt-3 bg-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <FaWallet class="inline" />
                Add to Wallet
              </button>
            ` : isProcessing ? `
              <button 
                disabled
                class="w-full mt-3 bg-gray-400 text-white py-3 px-4 rounded-lg font-semibold flex items-center justify-center gap-2 cursor-not-allowed"
              >
                <FaSpinner class="inline animate-spin" />
                Adding to Wallet...
              </button>
            ` : isAdded ? `
              <button 
                disabled
                class="w-full mt-3 bg-purple-100 text-purple-700 py-3 px-4 rounded-lg font-semibold flex items-center justify-center gap-2 cursor-default border border-purple-200"
              >
                <FaCheck class="inline" />
                Already in Wallet
              </button>
            ` : ''}
          </div>

          <!-- Route Information -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        </div>
      `,
      didOpen: () => {
        window.addToWallet = (parcelId) => {
          const parcel = completedDeliveries.find(p => p._id === parcelId);
          if (parcel) {
            handleAddToWallet(parcel);
            Swal.close();
          }
        };
      },
      willClose: () => {
        window.addToWallet = undefined;
      },
      showConfirmButton: true,
      confirmButtonText: 'Close',
      confirmButtonColor: '#6b7280',
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
      confirmButtonText: 'OK',
      confirmButtonColor: '#3b82f6',
    });
  };

  // Calculate statistics
  // const totalDeliveryCost = completedDeliveries.reduce((sum, parcel) => sum + (parcel.deliveryCost || 0), 0);
  const totalRiderEarnings = completedDeliveries.reduce((sum, parcel) => {
    const earnings = calculateRiderEarnings(parcel);
    return sum + earnings.riderEarnings;
  }, 0);
  const totalDeliveries = completedDeliveries.length;
  const totalBonuses = completedDeliveries.reduce((sum, parcel) => {
    const earnings = calculateRiderEarnings(parcel);
    return sum + earnings.bonusAmount;
  }, 0);
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

  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your deliveries...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="text-center py-10">
        <div className="text-red-600 mb-4">
          <FaHistory className="text-4xl mx-auto mb-3 text-red-500" />
          <p className="text-lg font-medium">Failed to load complete deliveries</p>
        </div>
        <button
          onClick={() => refetch()}
          className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  // Auth check
  if (!user?.email) {
    return (
      <div className="text-center py-10 text-gray-500">
        <FaWallet className="text-4xl mx-auto mb-3 text-gray-400" />
        <p>Please log in to view your complete deliveries</p>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-100 rounded-lg">
            <FaCheckCircle className="text-2xl text-green-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Complete Deliveries</h2>
            <p className="text-gray-600">Your successfully delivered parcels and earnings</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => refetch()}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <FaHistory className="text-gray-600" />
            <span>Refresh</span>
          </button>
          <button
            onClick={handleExportHistory}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FaChartLine />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      {completedDeliveries.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-linear-to-br from-green-50 to-green-100 border border-green-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-800">Total Earnings</p>
                <p className="text-2xl font-bold text-green-600 mt-1">৳{totalRiderEarnings.toFixed(2)}</p>
                <p className="text-xs text-green-600 mt-1">from {totalDeliveries} deliveries</p>
              </div>
              <FaMoneyBillWave className="text-2xl text-green-500" />
            </div>
          </div>

          <div className="bg-linear-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-800">In Wallet</p>
                <p className="text-2xl font-bold text-blue-600 mt-1">{deliveriesWithWalletEarnings}</p>
                <p className="text-xs text-blue-600 mt-1">earnings added</p>
              </div>
              <FaWallet className="text-2xl text-blue-500" />
            </div>
          </div>

          <div className="bg-linear-to-br from-yellow-50 to-yellow-100 border border-yellow-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-800">Total Bonuses</p>
                <p className="text-2xl font-bold text-yellow-600 mt-1">৳{totalBonuses.toFixed(2)}</p>
                <p className="text-xs text-yellow-600 mt-1">completion rewards</p>
              </div>
              <FaGift className="text-2xl text-yellow-500" />
            </div>
          </div>

          <div className="bg-linear-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-800">On-Time Rate</p>
                <p className="text-2xl font-bold text-purple-600 mt-1">{onTimeRate}%</p>
                <p className="text-xs text-purple-600 mt-1">delivery performance</p>
              </div>
              <FaCheckCircle className="text-2xl text-purple-500" />
            </div>
          </div>
        </div>
      )}

      {/* Deliveries List */}
      {completedDeliveries.length === 0 ? (
        <div className="text-center py-20 bg-linear-to-br from-gray-50 to-gray-100 rounded-2xl border-2 border-dashed border-gray-300">
          <FaCheckCircle className="text-6xl text-gray-400 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-900 mb-3">No Complete Deliveries Yet</h3>
          <p className="text-gray-600 max-w-md mx-auto mb-6">
            You haven't completed any deliveries yet. Once you deliver parcels, they will appear here with your earnings.
          </p>
          <div className="w-24 h-1 bg-linear-to-r from-green-400 to-blue-400 mx-auto rounded-full"></div>
        </div>
      ) : (
        <div className="grid gap-6">
          {completedDeliveries.map((parcel) => {
            const earnings = calculateRiderEarnings(parcel);
            const isProcessing = processingParcels.has(parcel._id);
            const isAdded = earnings.isAddedToWallet;

            return (
              <div
                key={parcel._id}
                className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                  {/* Left Section - Parcel Info */}
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
                      <div>
                        <h3 className="font-bold text-xl text-gray-900 mb-1">{parcel.parcelName}</h3>
                        <p className="text-gray-500 font-mono text-sm">{parcel.trackingId}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                          Delivered
                        </span>
                        {isAdded && (
                          <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium flex items-center gap-1">
                            <FaCheck className="text-xs" />
                            In Wallet
                          </span>
                        )}
                        {isProcessing && (
                          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium flex items-center gap-1">
                            <FaSpinner className="text-xs animate-spin" />
                            Processing
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Route */}
                    <div className="flex items-center gap-3 mb-4 text-gray-700">
                      <div className="flex items-center gap-2">
                        <FaMapMarkerAlt className="text-red-500" />
                        <span className="font-medium">{parcel.sender?.district}</span>
                      </div>
                      <div className="text-gray-400">→</div>
                      <div className="flex items-center gap-2">
                        <FaMapMarkerAlt className="text-green-500" />
                        <span className="font-medium">{parcel.receiver?.district}</span>
                      </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <FaBox className="text-gray-400 mx-auto mb-1" />
                        <p className="text-sm text-gray-600 capitalize">{parcel.parcelType?.replace('-', ' ')}</p>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <FaClock className="text-gray-400 mx-auto mb-1" />
                        <p className="text-sm text-gray-600">{calculateDeliveryTime(parcel)}</p>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <FaDollarSign className="text-green-500 mx-auto mb-1" />
                        <p className="text-sm font-semibold text-gray-900">৳{parcel.deliveryCost}</p>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <FaGift className="text-yellow-500 mx-auto mb-1" />
                        <p className="text-sm font-semibold text-yellow-600">+৳{earnings.bonusAmount.toFixed(2)}</p>
                      </div>
                    </div>

                    {/* Earnings Display */}
                    <div className="bg-linear-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm font-medium text-green-800">Your Earnings</p>
                          <p className="text-2xl font-bold text-green-600">৳{earnings.riderEarnings.toFixed(2)}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-green-600">
                            Delivered: {(() => {
                              const deliveryHistory = parcel.history?.find(item =>
                                item.action === 'delivered' || item.status.includes('Delivered')
                              );
                              return deliveryHistory ? new Date(deliveryHistory.time).toLocaleDateString() : 'N/A';
                            })()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Section - Actions */}
                  <div className="flex flex-col gap-3 lg:w-48">
                    {!isAdded && !isProcessing && (
                      <button
                        onClick={() => handleAddToWallet(parcel)}
                        className="w-full bg-linear-to-r from-green-600 to-emerald-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition-all shadow-sm flex items-center justify-center gap-2"
                      >
                        <FaWallet />
                        Add to Wallet
                      </button>
                    )}

                    {isProcessing && (
                      <button
                        disabled
                        className="w-full bg-gray-400 text-white py-3 px-4 rounded-lg font-semibold flex items-center justify-center gap-2 cursor-not-allowed"
                      >
                        <FaSpinner className="animate-spin" />
                        Adding...
                      </button>
                    )}

                    {isAdded && (
                      <button
                        disabled
                        className="w-full bg-purple-100 text-purple-700 py-3 px-4 rounded-lg font-semibold flex items-center justify-center gap-2 cursor-default border border-purple-200"
                      >
                        <FaCheck />
                        Added to Wallet
                      </button>
                    )}

                    <button
                      onClick={() => handleViewDetails(parcel)}
                      className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors"
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