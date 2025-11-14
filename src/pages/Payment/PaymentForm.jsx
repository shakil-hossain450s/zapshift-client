import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import { useParams } from 'react-router';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import toast from 'react-hot-toast';
import useAuth from '../../hooks/useAuth';

const PaymentForm = () => {
  const { user } = useAuth();
  const stripe = useStripe();
  const elements = useElements();
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const axiosSecure = useAxiosSecure();
  const { parcelId } = useParams();


  const { data: { parcel } = {}, isPending, isError } = useQuery({
    queryKey: ['parcel'],
    queryFn: async () => {
      try {
        const { data } = await axiosSecure(`/parcel/${parcelId}`);
        return data || [];
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

  // console.log(parcel?.deliveryCost);

  const amountInCents = parseInt(parcel.deliveryCost) * 100;
  // console.log(amountInCents);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!stripe || !elements) {
      return;
    }

    const card = elements.getElement(CardElement);
    if (!card) {
      return;
    }

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card
    });

    if (error) {
      console.log('error:', error);
      setErrorMessage(error.message);
    } else {
      setErrorMessage('');
      setLoading(false);
      console.log('payment method:', paymentMethod);

      try {
        const { data } = await axiosSecure.post(
          '/payments/create-payment-intent', // api url
          { amountInCents } // body
        );

        console.log(data);

        const { error, paymentIntent } = await stripe.confirmCardPayment(data.clientSecret, {
          payment_method: {
            card: elements.getElement(CardElement),
            billing_details: {
              name: user?.displayName,
              email: user?.email,
            }
          },
        })

        if (error) {
          setErrorMessage(error.message);
          console.error(error);
        } else if (paymentIntent.status === 'succeeded') {
          setErrorMessage('');
          toast.success('payment successfull!', {
            position: 'top-right'
          })
        }

      } catch (err) {
        setErrorMessage(err.message || 'payment failed');
        console.log(err);
      } finally {
        setLoading(false);
      }
    }


  };



  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md w-full mx-auto p-6 bg-white rounded-2xl shadow-lg border border-gray-200 space-y-6"
    >
      <h2 className="text-xl font-semibold text-gray-800 text-center">Complete Payment</h2>

      <div className='border border-gray-400 p-3 rounded-md'>
        <CardElement />
      </div>

      {/* Pay Button */}
      <button
        type="submit"
        className="btn w-full bg-[#CAEB66] text-gray-900 font-medium hover:bg-[#b7d959] transition-all duration-300 rounded-lg shadow-sm border-0"
        disabled={!stripe}
      >
        {loading ? 'Processing' : `Pay ৳${parcel.deliveryCost}`}
      </button>

      {errorMessage && <p className='text-red-500'>{errorMessage}</p>}
    </form>
  );
};

export default PaymentForm;