import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import useAuth from '../../../hooks/useAuth';
import { FaBox } from 'react-icons/fa';
import MyParcelRow from './MyParcelRow';
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useNavigate } from 'react-router';

const MySwal = withReactContent(Swal);

const MyParcels = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Fetch parcels
  const { data: parcels = [], isLoading, isError } = useQuery({
    queryKey: ['parcels', user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      try {
        const { data } = await axiosSecure.get(`/parcels?email=${user.email}`);
        console.log("Fetched Parcels:", data);
        return data.parcels || [];
      } catch (error) {
        if (error.response?.status === 404) return [];
        throw error;
      }
    }
  });

  // Delete parcel mutation
  const { mutateAsync: deleteParcel } = useMutation({
    mutationFn: async (parcelId) => {
      const { data } = await axiosSecure.delete(`/parcel/${parcelId}`);
      return data;
    },
    onSuccess: (data) => {
      const parcel = data?.result;
      MySwal.fire({
        title: 'Parcel Deleted',
        html: `<strong>${parcel.parcelName}</strong> has been removed.`,
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      });
      queryClient.invalidateQueries(['parcels', user?.email]);
    },
    onError: (err) => {
      Swal.fire({
        icon: 'error',
        title: 'Failed to Delete Parcel',
        text: err?.response?.data?.message || err.message
      });
    }
  });

  // Handle view parcel
  const handleView = (parcel) => {
    const getStatusColor = (status) => ({
      'Pending': '#f59e0b',
      'Processing': '#3b82f6',
      'In Transit': '#8b5cf6',
      'Out for Delivery': '#ec4899',
      'Delivered': '#10b981',
      'Cancelled': '#ef4444'
    }[status] || '#6b7280');

    const getPaymentStatusColor = (status) =>
      status === 'Paid' ? '#10b981' : status === 'Pending' ? '#f59e0b' : '#ef4444';

    const summaryHtml = `
      <div style="font-family: sans-serif; color:#1f2937; padding:16px;">
        <h3>${parcel.parcelName} - ${parcel.trackingId}</h3>
        <p>Status: <span style="color:${getStatusColor(parcel.parcelStatus)}">${parcel.parcelStatus}</span></p>
        <p>Payment: <span style="color:${getPaymentStatusColor(parcel.paymentStatus)}">${parcel.paymentStatus}</span></p>
        <p>Cost: ৳${parcel.deliveryCost}</p>
        <p>Sender: ${parcel.sender.name}, ${parcel.sender.contact}</p>
        <p>Receiver: ${parcel.receiver.name}, ${parcel.receiver.contact}</p>
        <p>Pickup Instruction: ${parcel.pickupInstruction || "N/A"}</p>
        <p>Delivery Instruction: ${parcel.deliveryInstruction || "N/A"}</p>
      </div>
    `;

    MySwal.fire({
      title: 'Parcel Details',
      html: summaryHtml,
      width: window.innerWidth <= 768 ? '95%' : '720px',
      showCloseButton: true,
      confirmButtonText: 'Close',
    });
  };

  // Handle delete parcel
  const handleDelete = async (parcel) => {
    const result = await Swal.fire({
      title: `Delete "${parcel.parcelName}"?`,
      text: 'This action cannot be undone!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#dc2626',
    });

    if (result.isConfirmed) {
      await deleteParcel(parcel._id);
    }
  };

  // Handle payment
  const handlePay = (parcel) => navigate(`/dashboard/payment/${parcel._id}`);

  // Render
  if (isLoading) return <p>Loading parcels...</p>;

  if (isError) return (
    <div className="text-center py-10 text-red-600">
      Failed to load parcels. <button onClick={() => window.location.reload()}>Retry</button>
    </div>
  );

  return (
    <div data-aos="fade-right">
      <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
        <FaBox className="text-green-600" /> My Parcels
      </h2>

      {parcels.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          No parcels found.
        </div>
      ) : (
        <div className="overflow-x-auto shadow rounded-lg border border-gray-200">
          <table className="table w-full">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th>#</th>
                <th>Tracking ID</th>
                <th>Parcel Name</th>
                <th>Delivery Cost</th>
                <th>Payment</th>
                <th>Status</th>
                <th>Created</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {parcels.map((parcel, index) => (
                <MyParcelRow
                  key={parcel._id}
                  parcel={parcel}
                  index={index}
                  handleView={handleView}
                  handleDelete={handleDelete}
                  handlePay={handlePay}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MyParcels;
