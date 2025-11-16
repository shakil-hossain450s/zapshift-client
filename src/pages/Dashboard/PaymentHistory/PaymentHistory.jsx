import { useQuery } from '@tanstack/react-query';
import React from 'react';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import useAuth from '../../../hooks/useAuth';
import PaymentHistoryRow from './PaymentHistoryRow';

const PaymentHistory = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();

  const { data: paymentsHistory, isPending, isError } = useQuery({
    queryKey: ['paymentsHistory'],
    queryFn: async () => {
      try {
        const { data } = await axiosSecure(`/payments/my-payments?email=${user?.email}`);
        return data.paymentsHistory;
      } catch (error) {
        if (error.response?.status === 404) {
          return [];
        }
        throw error;
      }
    }
  });

  if (isPending) return <p>Loading...</p>
  if (isError) return <p className='text-red-500'>Something went wrong...</p>

  console.log(paymentsHistory);

  return (
    <div data-aos='fade-right' className="overflow-x-auto">
      <table className="table w-full rounded-lg shadow-sm">
        {/* Table Head */}
        <thead>
          <tr className="bg-gray-100 text-gray-700">
            <th>#</th>
            <th>Parcel ID</th>
            <th>Amount</th>
            <th>Payment Method</th>
            <th>Transaction Id</th>
            <th>Status</th>
            <th>Date</th>
          </tr>
        </thead>

        {/* Table Body */}
        <tbody>
          {
            paymentsHistory.map((payment, index) => (
              <PaymentHistoryRow key={payment._id} payment={payment} index={index} />
            ))
          }
        </tbody>
      </table>
    </div>
  );
};

export default PaymentHistory;