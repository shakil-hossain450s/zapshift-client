import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { FaMotorcycle } from "react-icons/fa";
import Swal from "sweetalert2";
import { useQuery } from "@tanstack/react-query";
import ActiveRidersRow from "./ActiveRiderRow";

const ActiveRiders = () => {
  const axiosSecure = useAxiosSecure();

  // Fetch pending riders
  const { data: activeRiders = [], isPending, isError, refetch } = useQuery({
    queryKey: ['active-riders'],
    queryFn: async () => {
      const { data } = await axiosSecure('/activeRiders');
      return data.activeRiders || [];
    }
  })

  // handle details view
  const handleViewRider = (rider) => {
    Swal.fire({
      width: 700,
      background: "#ffffff",
      showCloseButton: true,
      icon: 'info',
      confirmButtonText: "Close Details",
      confirmButtonColor: "#4f46e5",
      title: `
        <h2 class="text-4xl -mb-10 -mt-16 text-center font-bold text-gray-900">Active Rider Details</h2>
    `,
      html: `
      <div style="padding: 0; margin-top: -10px;">

        <!-- Header Section -->
        <div style="
          background: linear-gradient(to right, #f59e0b, #d97706);
          padding: 16px;
          border-radius: 12px;
          color: white;
          text-align: center;
          margin-bottom: 16px;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        ">
          <h2 style="font-size:20px; font-weight:700; margin-bottom:4px;">
            ${rider.name}
          </h2>
          <div style="font-size:13px; opacity:0.9; margin-bottom:6px;">${rider.email}</div>
          <div class="bg-green-500" style="
            display: inline-block;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 11px;
            font-weight: 600;
            backdrop-filter: blur(10px);
          ">
             Active
          </div>
        </div>

        <!-- Rest of your content remains the same -->
        <div style="
          display:grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 14px;
          margin-bottom: 14px;
        ">

          <!-- Personal Information -->
          <div style="
            padding: 16px;
            border-radius: 12px;
            background: #f8fafc;
            border: 1px solid #e2e8f0;
          ">
            <div style="display:flex; align-items:center; margin-bottom:10px;">
              <div style="width:4px; height:18px; background:#3b82f6; border-radius:2px; margin-right:8px;"></div>
              <h3 style="font-weight:700; color:#1e293b; font-size:14px;">Personal Information</h3>
            </div>
            <div style="space-y-2">
              <p style="margin:6px 0; font-size:13px;"><strong>📞 Phone:</strong> ${rider.phone}</p>
              <p style="margin:6px 0; font-size:13px;"><strong>🎂 Age:</strong> ${rider.age} years</p>
              <p style="margin:6px 0; font-size:13px;"><strong>🆔 NID:</strong> ${rider.nid}</p>
            </div>
          </div>

          <!-- Location Details -->
          <div style="
            padding: 16px;
            border-radius: 12px;
            background: #f0f9ff;
            border: 1px solid #bae6fd;
          ">
            <div style="display:flex; align-items:center; margin-bottom:10px;">
              <div style="width:4px; height:18px; background:#0ea5e9; border-radius:2px; margin-right:8px;"></div>
              <h3 style="font-weight:700; color:#1e293b; font-size:14px;">Location Details</h3>
            </div>
            <div style="space-y-2">
              <p style="margin:6px 0; font-size:13px;"><strong>📍 Region:</strong> ${rider.region}</p>
              <p style="margin:6px 0; font-size:13px;"><strong>🏙️ District:</strong> ${rider.district}</p>
            </div>
          </div>

        </div>

        <!-- Second Row Grid -->
        <div style="
          display:grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 14px;
          margin-bottom: 14px;
        ">

          <!-- Bike Information -->
          <div style="
            padding: 16px;
            border-radius: 12px;
            background: #fffbeb;
            border: 1px solid #fcd34d;
          ">
            <div style="display:flex; align-items:center; margin-bottom:10px;">
              <div style="width:4px; height:18px; background:#f59e0b; border-radius:2px; margin-right:8px;"></div>
              <h3 style="font-weight:700; color:#1e293b; font-size:14px;">Bike Information</h3>
            </div>
            <div style="space-y-2">
              <p style="margin:6px 0; font-size:13px;"><strong>🏍️ Brand:</strong> ${rider.bikeBrand}</p>
              <p style="margin:6px 0; font-size:13px;"><strong>🔢 Reg No:</strong> ${rider.bikeRegNo}</p>
            </div>
          </div>

          <!-- Application Status -->
          <div style="
            padding: 16px;
            border-radius: 12px;
            background: #fef3c7;
            border: 1px solid #f59e0b;
          ">
            <div style="display:flex; align-items:center; margin-bottom:10px;">
              <div style="width:4px; height:18px; background:#d97706; border-radius:2px; margin-right:8px;"></div>
              <h3 style="font-weight:700; color:#1e293b; font-size:14px;">Application Status</h3>
            </div>
            <div style="space-y-2">
              <p style="margin:6px 0; font-size:13px;">
                <strong>Status:</strong> 
                <span class="bg-green-500" style="
                  padding:4px 10px;
                  color:#fff;
                  border-radius: 20px;
                  font-size:11px;
                  font-weight:600;
                  margin-left:6px;
                ">${rider.status}</span>
              </p>
              <p style="margin:6px 0; font-size:13px;">
                <strong>📅 Applied At:</strong><br/> 
                <span style="font-size:12px; color:#6b7280;">
                  ${new Date(rider.appliedAt).toLocaleString()}
                </span>
              </p>
            </div>
          </div>

        </div>

      </div>
    `,
    });
  };

const handleDeactivateRider = (rider, action) => {
  Swal.fire({
    width: 500,
    padding: '0.2rem',
    title: `
        <h2 class="-mb-10 -mt-16 text-3xl text-center font-bold text-gray-900">Deactivate Rider</h2>
    `,
    html: `
      <div style="padding: 0; margin-top: -8px;">
        <!-- Rider Summary -->
        <div style="background: #fef2f2; padding: 8px; border-radius: 6px; margin-bottom: 8px;">
          <h3 style="font-weight: 600; color: #dc2626; margin-bottom: 4px; font-size: 20px;">Rider Information</h3>
          <p style="margin: 2px 0; font-size: 16px;"><strong>Name:</strong> ${rider.name}</p>
          <p style="margin: 2px 0; font-size: 16px;"><strong>Email:</strong> ${rider.email}</p>
          <p style="margin: 2px 0; font-size: 16px;"><strong>Phone:</strong> ${rider.phone}</p>
          <p style="margin: 2px 0; font-size: 16px;"><strong>Region:</strong> ${rider.region}</p>
        </div>

        <!-- Consequences -->
        <div style="background: #fffbeb; padding: 8px; border-radius: 6px; margin-bottom: 8px;">
          <h3 style="font-weight: 600; color: #d97706; margin-bottom: 4px; font-size: 20px;">What will happen?</h3>
          <ul style="color: #92400e; padding-left: 12px; margin: 0; font-size: 16px;">
            <li style="margin-bottom: 2px;">Cannot accept new delivery requests</li>
            <li>Active deliveries will be reassigned</li>
          </ul>
        </div>
      </div>
    `,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#ef4444',
    cancelButtonColor: '#6b7280',
    confirmButtonText: 'Deactivate',
    cancelButtonText: 'Cancel',
    focusConfirm: false,
    reverseButtons: true
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        const { data } = await axiosSecure.patch(`/rider/${rider._id}/status`, {
          status: action
        });
        
        if (data.success) {
          Swal.fire({
            title: 'Deactivated!',
            text: `${rider.name} has been deactivated.`,
            icon: 'success',
            confirmButtonColor: '#ef4444',
          });
          refetch();
        }
      } catch (err) {
        Swal.fire('Error!', 'Failed to deactivate rider.', err);
      }
    }
  });
};


  if (isPending) return <p>Loading...</p>;
  if (isError) return <p className="text-red-500">Error...</p>

  console.log(activeRiders);

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
        <FaMotorcycle className="text-green-600" /> Active Riders
      </h2>

      {activeRiders.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          No active riders.
        </div>
      ) : (
        <div className="overflow-x-auto shadow rounded-lg border border-gray-200">
          <table className="table w-full">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Region</th>
                <th>Bike Reg:</th>
                <th>Status</th>
                <th className="text-center">Actions</th>
              </tr >
            </thead >
            <tbody>
              {
                activeRiders.map((rider, index) => (
                  <ActiveRidersRow key={rider._id} rider={rider} index={index} handleViewRider={handleViewRider} handleDeactivateRider={handleDeactivateRider} />
                ))
              }
            </tbody>
          </table >
        </div >
      )}
    </div >
  );
};

export default ActiveRiders;
