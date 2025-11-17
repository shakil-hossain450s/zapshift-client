import React from 'react';
import { FaMoneyBillWave, FaClock, FaReceipt } from "react-icons/fa";

const PaymentHistoryRow = ({ payment, index }) => {
  console.log(payment);
  return (
    <tr className="hover:bg-gray-50">
      <td>{index + 1}</td>
      <td className="font-mono text-blue-600">{payment.parcelId}</td>
      <td className="flex items-center gap-1 text-green-700">
        <FaMoneyBillWave />
        ৳{payment.amount}
      </td>
      <td>
        <span className="badge badge-sm text-white bg-purple-500">
          {payment.paymentMethod}
        </span>
      </td>
      <td className='badge badge-sm'>{payment.transactionId}</td>
      <td>
        <span
          className={`text-xs font-medium px-2 py-1 rounded-full ${payment.status === "Paid"
            ? "bg-green-100 text-green-700"
            : "bg-yellow-100 text-yellow-700"
            }`}
        >
          {payment.status}
        </span>
      </td>
      <td className="text-sm text-gray-600 flex items-center gap-1">
        <FaClock className="text-gray-400" />
        {new Date(payment.createdAt).toLocaleString()}
      </td>
    </tr>
  );
};

export default PaymentHistoryRow;