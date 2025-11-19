import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  FaWallet, 
  FaMoneyBillWave, 
  FaHistory, 
  FaArrowDown, 
  FaArrowUp, 
  FaUniversity,
  FaMobileAlt,
  FaCheckCircle,
  FaClock,
  FaExclamationTriangle,
  FaSpinner
} from 'react-icons/fa';
import Swal from 'sweetalert2';
import useAxiosSecure from '../../../../hooks/useAxiosSecure';
import useAuth from '../../../../hooks/useAuth';

// Custom icons for payment methods
const PaymentMethodIcons = {
  bkash: <FaMobileAlt className="text-green-500" />,
  nagad: <FaMobileAlt className="text-purple-500" />,
  bank: <FaUniversity className="text-blue-500" />
};

const RiderWallet = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('overview');
  const [cashOutAmount, setCashOutAmount] = useState('');
  const [selectedMethod, setSelectedMethod] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  // Fetch wallet data
  const { data: walletData, isLoading, error, refetch } = useQuery({
    queryKey: ['riderWallet', user?.uid],
    queryFn: async () => {
      if (!user?.uid) throw new Error('User not authenticated');
      
      const { data } = await axiosSecure.get('/wallet/balance');
      return data;
    },
    enabled: !!user?.uid,
  });

  // Cash-out mutation
  const cashOutMutation = useMutation({
    mutationFn: async (cashOutData) => {
      const { data } = await axiosSecure.post('/wallet/cash-out', cashOutData);
      return data;
    },
    onSuccess: (data) => {
      Swal.fire({
        title: '✅ Cash-Out Request Submitted!',
        text: `Your withdrawal request of ৳${data.data.amount} has been received and will be processed within 24-48 hours.`,
        icon: 'success',
        confirmButtonColor: '#10b981',
      });
      
      // Reset form
      setCashOutAmount('');
      setSelectedMethod('');
      setPhoneNumber('');
      
      // Refresh wallet data
      queryClient.invalidateQueries(['riderWallet']);
    },
    onError: (error) => {
      Swal.fire({
        title: '❌ Cash-Out Failed',
        text: error.response?.data?.message || 'Failed to process cash-out request',
        icon: 'error',
        confirmButtonColor: '#ef4444',
      });
    }
  });

  const handleCashOut = async (e) => {
    e.preventDefault();
    
    if (!cashOutAmount || !selectedMethod) {
      Swal.fire('Error', 'Please fill all fields', 'error');
      return;
    }

    const amount = parseFloat(cashOutAmount);
    const minAmount = 500;
    const maxAmount = 50000;

    // Validation
    if (amount < minAmount) {
      Swal.fire('Error', `Minimum cash-out amount is ৳${minAmount}`, 'error');
      return;
    }

    if (amount > maxAmount) {
      Swal.fire('Error', `Maximum cash-out amount is ৳${maxAmount}`, 'error');
      return;
    }

    if (amount > walletData.data.availableBalance) {
      Swal.fire('Error', 'Insufficient balance', 'error');
      return;
    }

    // For mobile payments, require phone number
    if ((selectedMethod === 'bkash' || selectedMethod === 'nagad') && !phoneNumber) {
      Swal.fire('Error', 'Please enter your phone number', 'error');
      return;
    }

    const result = await Swal.fire({
      title: 'Confirm Cash-Out',
      html: `
        <div class="text-left space-y-3">
          <p>You are requesting to cash out:</p>
          <div class="text-center">
            <p class="text-2xl font-bold text-green-600">৳${amount}</p>
            <p class="text-sm text-gray-600">via ${getMethodName(selectedMethod)}</p>
          </div>
          
          <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p class="text-sm font-medium text-yellow-800">Processing Information</p>
            <div class="text-xs text-yellow-700 mt-1 space-y-1">
              <p>• Processing time: 24-48 hours</p>
              <p>• Processing fee: ৳10</p>
              <p>• You will receive: ৳${amount - 10}</p>
              ${phoneNumber ? `<p>• To: ${phoneNumber}</p>` : ''}
            </div>
          </div>
        </div>
      `,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Confirm Cash-Out',
      confirmButtonColor: '#10b981',
      cancelButtonColor: '#6b7280',
    });

    if (result.isConfirmed) {
      const accountInfo = selectedMethod === 'bank' 
        ? { accountNumber: phoneNumber }
        : { phoneNumber };

      cashOutMutation.mutate({
        amount: amount,
        method: selectedMethod,
        accountInfo: accountInfo
      });
    }
  };

  const getMethodName = (method) => {
    const methods = {
      bkash: 'bKash',
      nagad: 'Nagad',
      bank: 'Bank Transfer'
    };
    return methods[method] || method;
  };

  const getMethodIcon = (method) => {
    return PaymentMethodIcons[method] || <FaMoneyBillWave />;
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <FaCheckCircle className="text-green-500" />;
      case 'processing':
        return <FaClock className="text-yellow-500" />;
      case 'pending':
        return <FaClock className="text-blue-500" />;
      case 'failed':
        return <FaExclamationTriangle className="text-red-500" />;
      default:
        return <FaClock className="text-gray-500" />;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-BD', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <div className="text-red-600 mb-4">
          <p>Failed to load wallet data.</p>
        </div>
        <button 
          onClick={() => refetch()}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!user?.uid) {
    return (
      <div className="text-center py-10 text-gray-500">
        <p>Please log in to view your wallet.</p>
      </div>
    );
  }

  const { availableBalance, totalEarned, totalWithdrawn, pendingWithdrawals, transactionHistory } = walletData.data;

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <FaWallet className="text-blue-600" />
            My Wallet
          </h1>
          <p className="text-gray-600 mt-2">Manage your earnings and cash-out requests</p>
        </div>

        {/* Balance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Available Balance */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Available Balance</p>
                <p className="text-3xl font-bold text-green-600 mt-2">
                  ৳{availableBalance?.toFixed(2) || '0.00'}
                </p>
                <p className="text-xs text-gray-500 mt-1">Ready for withdrawal</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <FaMoneyBillWave className="text-2xl text-green-600" />
              </div>
            </div>
          </div>

          {/* Total Earned */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Earned</p>
                <p className="text-3xl font-bold text-blue-600 mt-2">
                  ৳{totalEarned?.toFixed(2) || '0.00'}
                </p>
                <p className="text-xs text-gray-500 mt-1">All-time earnings</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <FaArrowDown className="text-2xl text-blue-600" />
              </div>
            </div>
          </div>

          {/* Total Withdrawn */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Withdrawn</p>
                <p className="text-3xl font-bold text-purple-600 mt-2">
                  ৳{totalWithdrawn?.toFixed(2) || '0.00'}
                </p>
                <p className="text-xs text-gray-500 mt-1">All-time withdrawals</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <FaArrowUp className="text-2xl text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                  activeTab === 'overview'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Cash Out
              </button>
              <button
                onClick={() => setActiveTab('transactions')}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                  activeTab === 'transactions'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Transaction History
              </button>
              <button
                onClick={() => setActiveTab('pending')}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                  activeTab === 'pending'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Pending Withdrawals
                {pendingWithdrawals?.length > 0 && (
                  <span className="ml-2 bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">
                    {pendingWithdrawals.length}
                  </span>
                )}
              </button>
            </nav>
          </div>

          <div className="p-6">
            {/* Cash Out Tab */}
            {activeTab === 'overview' && (
              <div className="max-w-2xl">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Cash Out Funds</h3>
                
                <form onSubmit={handleCashOut} className="space-y-6">
                  {/* Amount Input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Amount to Cash Out
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">৳</span>
                      <input
                        type="number"
                        value={cashOutAmount}
                        onChange={(e) => setCashOutAmount(e.target.value)}
                        placeholder="500.00"
                        className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        min="500"
                        max="50000"
                        step="0.01"
                        required
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Minimum: ৳500, Maximum: ৳50,000
                    </p>
                  </div>

                  {/* Payment Method */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Select Payment Method
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {['bkash', 'nagad', 'bank'].map((method) => (
                        <div
                          key={method}
                          onClick={() => setSelectedMethod(method)}
                          className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                            selectedMethod === method
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="text-2xl">
                              {getMethodIcon(method)}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{getMethodName(method)}</p>
                              <p className="text-xs text-gray-500">24-48 hours</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Phone Number / Account Number */}
                  {(selectedMethod === 'bkash' || selectedMethod === 'nagad' || selectedMethod === 'bank') && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {selectedMethod === 'bank' ? 'Account Number' : 'Phone Number'}
                      </label>
                      <input
                        type="text"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder={selectedMethod === 'bank' ? 'Enter account number' : '01XXXXXXXXX'}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                  )}

                  {/* Cash Out Button */}
                  <button
                    type="submit"
                    disabled={cashOutMutation.isLoading || !cashOutAmount || !selectedMethod}
                    className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                  >
                    {cashOutMutation.isLoading ? (
                      <>
                        <FaSpinner className="animate-spin" />
                        Processing...
                      </>
                    ) : (
                      'Request Cash Out'
                    )}
                  </button>

                  {/* Processing Info */}
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <FaClock className="text-yellow-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-yellow-800">Processing Information</p>
                        <p className="text-sm text-yellow-700 mt-1">
                          • Processing time: 24-48 hours<br/>
                          • Processing fee: ৳10 per transaction<br/>
                          • Payments are processed on business days
                        </p>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            )}

            {/* Transaction History Tab */}
            {activeTab === 'transactions' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Transaction History</h3>
                {transactionHistory?.length > 0 ? (
                  <div className="space-y-3">
                    {transactionHistory.map((transaction, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className={`p-2 rounded-full ${
                            transaction.type === 'credit' ? 'bg-green-100' : 'bg-red-100'
                          }`}>
                            {transaction.type === 'credit' ? (
                              <FaArrowDown className="text-green-600" />
                            ) : (
                              <FaArrowUp className="text-red-600" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{transaction.description}</p>
                            <p className="text-sm text-gray-500">{formatDate(transaction.timestamp)}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`font-semibold ${
                            transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {transaction.type === 'credit' ? '+' : '-'}৳{transaction.amount?.toFixed(2)}
                          </p>
                          <p className="text-sm text-gray-500">Balance: ৳{transaction.balanceAfter?.toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <FaHistory className="text-4xl text-gray-300 mx-auto mb-3" />
                    <p>No transactions yet</p>
                  </div>
                )}
              </div>
            )}

            {/* Pending Withdrawals Tab */}
            {activeTab === 'pending' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Pending Withdrawals</h3>
                {pendingWithdrawals?.length > 0 ? (
                  <div className="space-y-3">
                    {pendingWithdrawals.map((withdrawal, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center gap-4">
                          {getStatusIcon(withdrawal.status)}
                          <div>
                            <p className="font-medium text-gray-900">
                              ৳{withdrawal.amount?.toFixed(2)} via {getMethodName(withdrawal.method)}
                            </p>
                            <p className="text-sm text-gray-500">
                              Requested: {formatDate(withdrawal.requestedAt)}
                              {withdrawal.accountInfo?.phoneNumber && ` • ${withdrawal.accountInfo.phoneNumber}`}
                              {withdrawal.accountInfo?.accountNumber && ` • ${withdrawal.accountInfo.accountNumber}`}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            withdrawal.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            withdrawal.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                            withdrawal.status === 'completed' ? 'bg-green-100 text-green-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {withdrawal.status?.charAt(0).toUpperCase() + withdrawal.status?.slice(1)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <FaClock className="text-4xl text-gray-300 mx-auto mb-3" />
                    <p>No pending withdrawals</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiderWallet;