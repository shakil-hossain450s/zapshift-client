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

  const handleView = (parcel) => {
    const getStatusColor = (status) => {
      const statusColors = {
        'Pending': '#f59e0b',
        'Processing': '#3b82f6',
        'In Transit': '#8b5cf6',
        'Out for Delivery': '#ec4899',
        'Delivered': '#10b981',
        'Cancelled': '#ef4444'
      };
      return statusColors[status] || '#6b7280';
    };

    const getPaymentStatusColor = (status) => {
      return status === 'Paid' ? '#10b981' : status === 'Pending' ? '#f59e0b' : '#ef4444';
    };

    const summaryHtml = `
    <div class="parcel-details-container" style="
      width: 100%;
      max-width: 640px;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      color: #1f2937;
      margin: 0 auto;
    ">
      <!-- Header Section -->
      <div style="
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: clamp(16px, 4vw, 24px);
        border-radius: 12px;
        margin-bottom: clamp(16px, 4vw, 24px);
        text-align: center;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        width: 100%;
        box-sizing: border-box;
      ">
        <div style="font-size: clamp(1.25rem, 5vw, 1.5rem); font-weight: 700; margin-bottom: 8px; letter-spacing: -0.025em;">
          ${parcel.trackingId}
        </div>
        <div style="font-size: clamp(1rem, 4vw, 1.1rem); opacity: 0.95; font-weight: 500;">
          ${parcel.parcelName}
        </div>
      </div>

      <!-- Main Content Grid -->
      <div style="
        display: grid; 
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: clamp(12px, 3vw, 16px); 
        margin-bottom: clamp(16px, 4vw, 20px); 
        width: 100%;
      ">
        
        <!-- Left Column -->
        <div style="display: flex; flex-direction: column; gap: clamp(12px, 3vw, 16px);">
          <!-- Parcel Info Card -->
          <div style="
            background: #ffffff;
            padding: clamp(16px, 4vw, 20px);
            border-radius: 12px;
            border-left: 4px solid #3b82f6;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
            border: 1px solid #e5e7eb;
            width: 100%;
            min-width: 0;
            box-sizing: border-box;
          ">
            <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: clamp(12px, 3vw, 16px); flex-wrap: wrap; gap: 12px;">
              <div style="flex: 1; min-width: 120px;">
                <div style="font-size: 0.75rem; color: #6b7280; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 4px;">PARCEL TYPE</div>
                <div style="font-size: clamp(0.9rem, 3vw, 1rem); font-weight: 600; color: #1f2937;">${parcel.parcelType.charAt(0).toUpperCase() + parcel.parcelType.slice(1)}</div>
              </div>
              <div style="flex: 1; min-width: 120px; text-align: left;">
                <div style="font-size: 0.75rem; color: #6b7280; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 4px;">WEIGHT</div>
                <div style="font-size: clamp(0.9rem, 3vw, 1rem); font-weight: 600; color: #1f2937;">${parcel.weight} kg</div>
              </div>
            </div>
            
            <div style="display: flex; justify-content: space-between; align-items: end; flex-wrap: wrap; gap: 12px;">
              <div style="flex: 1; min-width: 120px;">
                <div style="font-size: 0.75rem; color: #6b7280; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 4px;">DELIVERY ZONE</div>
                <div style="font-size: clamp(0.9rem, 3vw, 1rem); font-weight: 600; color: #1f2937;">${parcel.deliveryZone}</div>
              </div>
              <div style="flex: 1; min-width: 120px; text-align: left;">
                <div style="font-size: 0.75rem; color: #6b7280; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 4px;">COST</div>
                <div style="font-size: clamp(1.1rem, 4vw, 1.25rem); font-weight: 700; color: #059669;">৳${parcel.deliveryCost}</div>
              </div>
            </div>
          </div>

          <!-- Status Card -->
          <div style="
            background: #ffffff;
            padding: clamp(16px, 4vw, 20px);
            border-radius: 12px;
            border-left: 4px solid ${getStatusColor(parcel.parcelStatus)};
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
            border: 1px solid #e5e7eb;
            width: 100%;
            min-width: 0;
            box-sizing: border-box;
          ">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: clamp(10px, 2.5vw, 12px); flex-wrap: wrap; gap: 8px;">
              <div style="font-size: 0.75rem; color: #6b7280; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">STATUS</div>
              <div style="
                background: ${getStatusColor(parcel.parcelStatus)};
                color: white;
                padding: 6px 16px;
                border-radius: 20px;
                font-size: 0.75rem;
                font-weight: 700;
                text-transform: uppercase;
                letter-spacing: 0.05em;
                white-space: nowrap;
              ">
                ${parcel.parcelStatus}
              </div>
            </div>
            <div style="font-size: 0.75rem; color: #6b7280; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 8px;">PAYMENT</div>
            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px;">
              <div style="font-size: clamp(0.9rem, 3vw, 1rem); font-weight: 600; color: #1f2937; min-width: 0;">
                ${parcel.paymentMethod}
              </div>
              <div style="
                color: ${getPaymentStatusColor(parcel.paymentStatus)};
                font-weight: 700;
                font-size: 0.875rem;
                text-transform: uppercase;
                letter-spacing: 0.05em;
                white-space: nowrap;
              ">
                ${parcel.paymentStatus}
              </div>
            </div>
          </div>

          <!-- Expected Delivery Card -->
          <div style="
            background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
            padding: clamp(16px, 4vw, 20px);
            border-radius: 12px;
            border: 1px solid #bbf7d0;
            text-align: center;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
            width: 100%;
            min-width: 0;
            box-sizing: border-box;
          ">
            <div style="font-size: 0.75rem; color: #059669; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 8px;">
              ⏰ EXPECTED DELIVERY
            </div>
            <div style="font-size: clamp(0.9rem, 3vw, 1rem); font-weight: 700; color: #065f46; line-height: 1.4;">
              ${new Date(parcel.expectedDeliveryDate).toLocaleString("en-BD", {
      timeZone: "Asia/Dhaka",
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    })}
            </div>
          </div>
        </div>

        <!-- Right Column -->
        <div style="display: flex; flex-direction: column; gap: clamp(12px, 3vw, 16px);">
          <!-- Sender Info Card -->
          <div style="
            background: #ffffff;
            padding: clamp(16px, 4vw, 20px);
            border-radius: 12px;
            border-left: 4px solid #0ea5e9;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
            border: 1px solid #e5e7eb;
            width: 100%;
            min-width: 0;
            box-sizing: border-box;
            height: fit-content;
          ">
            <div style="display: flex; align-items: center; margin-bottom: clamp(12px, 3vw, 16px); flex-wrap: wrap; gap: 8px;">
              <div style="
                width: clamp(28px, 6vw, 32px);
                height: clamp(28px, 6vw, 32px);
                background: #0ea5e9;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                margin-right: clamp(8px, 2vw, 12px);
                box-shadow: 0 2px 4px rgba(14, 165, 233, 0.3);
                flex-shrink: 0;
              ">
                <span style="color: white; font-size: clamp(12px, 3vw, 14px); font-weight: bold;">S</span>
              </div>
              <div style="font-size: clamp(0.9rem, 3vw, 1rem); font-weight: 700; color: #0369a1; text-transform: uppercase; letter-spacing: 0.05em;">Sender Information</div>
            </div>
            <div style="font-size: clamp(0.9rem, 3vw, 1rem); font-weight: 600; margin-bottom: 8px; color: #1f2937;">${parcel.sender.name}</div>
            <div style="font-size: 0.875rem; color: #6b7280; margin-bottom: 8px; display: flex; align-items: center; gap: 6px; flex-wrap: wrap;">
              <span>📞</span> ${parcel.sender.contact}
            </div>
            <div style="font-size: 0.875rem; color: #4b5563; line-height: 1.5;">
              ${parcel.sender.address}<br>
              ${parcel.sender.district}, ${parcel.sender.region}
            </div>
          </div>

          <!-- Receiver Info Card -->
          <div style="
            background: #ffffff;
            padding: clamp(16px, 4vw, 20px);
            border-radius: 12px;
            border-left: 4px solid #ef4444;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
            border: 1px solid #e5e7eb;
            width: 100%;
            min-width: 0;
            box-sizing: border-box;
            height: fit-content;
          ">
            <div style="display: flex; align-items: center; margin-bottom: clamp(12px, 3vw, 16px); flex-wrap: wrap; gap: 8px;">
              <div style="
                width: clamp(28px, 6vw, 32px);
                height: clamp(28px, 6vw, 32px);
                background: #ef4444;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                margin-right: clamp(8px, 2vw, 12px);
                box-shadow: 0 2px 4px rgba(239, 68, 68, 0.3);
                flex-shrink: 0;
              ">
                <span style="color: white; font-size: clamp(12px, 3vw, 14px); font-weight: bold;">R</span>
              </div>
              <div style="font-size: clamp(0.9rem, 3vw, 1rem); font-weight: 700; color: #dc2626; text-transform: uppercase; letter-spacing: 0.05em;">Receiver Information</div>
            </div>
            <div style="font-size: clamp(0.9rem, 3vw, 1rem); font-weight: 600; margin-bottom: 8px; color: #1f2937;">${parcel.receiver.name}</div>
            <div style="font-size: 0.875rem; color: #6b7280; margin-bottom: 8px; display: flex; align-items: center; gap: 6px; flex-wrap: wrap;">
              <span>📞</span> ${parcel.receiver.contact}
            </div>
            <div style="font-size: 0.875rem; color: #4b5563; line-height: 1.5;">
              ${parcel.receiver.address}<br>
              ${parcel.receiver.district}, ${parcel.receiver.region}
            </div>
          </div>
        </div>
      </div>

      <!-- Instructions Section -->
      <div style="
        background: #ffffff;
        padding: clamp(16px, 4vw, 20px);
        border-radius: 12px;
        border: 1px solid #fcd34d;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        width: 100%;
        box-sizing: border-box;
        margin-bottom: clamp(12px, 3vw, 16px);
        background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
      ">
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: clamp(12px, 3vw, 20px);">
          <div>
            <div style="font-size: 0.75rem; color: #d97706; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 8px; display: flex; align-items: center; gap: 6px;">
              <span>📦</span> PICKUP INSTRUCTION
            </div>
            <div style="font-size: clamp(0.85rem, 2.5vw, 0.9rem); color: #92400e; line-height: 1.5; background: rgba(255,255,255,0.7); padding: 12px; border-radius: 8px; min-height: 60px;">
              ${parcel.pickupInstruction || "No special instructions provided"}
            </div>
          </div>
          <div>
            <div style="font-size: 0.75rem; color: #d97706; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 8px; display: flex; align-items: center; gap: 6px;">
              <span>🚚</span> DELIVERY INSTRUCTION
            </div>
            <div style="font-size: clamp(0.85rem, 2.5vw, 0.9rem); color: #92400e; line-height: 1.5; background: rgba(255,255,255,0.7); padding: 12px; border-radius: 8px; min-height: 60px;">
              ${parcel.deliveryInstruction || "No special instructions provided"}
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div style="
        text-align: center;
        padding: clamp(12px, 3vw, 16px);
        background: #f8fafc;
        border-radius: 8px;
        border-top: 1px solid #e5e7eb;
        width: 100%;
        box-sizing: border-box;
      ">
        <div style="font-size: 0.75rem; color: #6b7280; font-weight: 500;">
          Created at: ${parcel.createdAtReadable}
        </div>
      </div>
    </div>
  `;

    // Detect mobile device and adjust modal width
    const isMobile = window.innerWidth <= 768;
    const modalWidth = isMobile ? '95%' : '720px';

    MySwal.fire({
      title: `<div style="font-size: clamp(1.25rem, 5vw, 1.5rem); font-weight: 700; color: #1f2937; letter-spacing: -0.025em;">Parcel Details</div>`,
      html: summaryHtml,
      icon: "info",
      confirmButtonText: "Close Details",
      confirmButtonColor: "#3b82f6",
      background: "#f8fafc",
      customClass: {
        popup: "rounded-xl p-4 sm:p-6 shadow-2xl",
        title: "mb-3 sm:mb-4",
        confirmButton: "px-4 sm:px-6 py-2 sm:py-3 font-semibold rounded-lg shadow-sm hover:shadow-md transition-all duration-200 text-sm sm:text-base"
      },
      width: modalWidth,
      padding: "0",
      showCloseButton: true,
      showClass: {
        popup: 'animate__animated animate__fadeIn animate__faster'
      },
      hideClass: {
        popup: 'animate__animated animate__fadeOut animate__faster'
      }
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
                <th>Parcel Status</th>
                <th>Delivery Status</th>
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
