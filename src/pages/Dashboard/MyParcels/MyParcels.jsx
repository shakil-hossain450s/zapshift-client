import { useQuery } from '@tanstack/react-query'
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import useAuth from '../../../hooks/useAuth';
import { FaBox } from 'react-icons/fa';
import MyParcelRow from '../../../components/MyParcel/MyParcelRow';

const MyParcels = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const { data: { parcels } = [], isPending, isError } = useQuery({
    queryKey: ['parcels', user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const { data } = await axiosSecure(`/parcels?email=${user.email}`)
      return data || [];
    }
  });

  if (isPending) return <p>Loading parcels...</p>
  if (isError) {
    return <div className="text-center py-10">
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
        <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
          <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-red-800 mb-2">Unable to Load Parcels</h3>
        <p className="text-red-600 text-sm mb-4">
          There was an error loading your parcel data. Please try again.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
        >
          Retry
        </button>
      </div>
    </div>
  }

  console.log(parcels);

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
        <FaBox className="text-green-600" /> My Parcels
      </h2>

      {parcels.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          No parcels found yet.
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
              </tr >
            </thead >
  <tbody>
    {parcels.map((parcel, index) => (
      <MyParcelRow key={parcel._id} parcel={parcel} index={index} />
    ))}
  </tbody>
          </table >
        </div >
      )}
    </div >
  );
};

export default MyParcels;