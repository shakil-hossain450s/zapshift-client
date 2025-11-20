import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import PageHeading from "../../components/PageHeading";
import PrimaryButton from "../../components/PrimaryButton";
import warehouseData from "../../assets/data/warehouses.json";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { useNavigate } from "react-router";

const AddParcel = () => {
  const { user } = useAuth();
  const userEmail = user?.email || "guest@unknown.com";
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
  } = useForm({
    defaultValues: {
      parcelType: "non-document",
      paymentMethod: "Cash on Delivery",
    },
  });

  const [deliveryCost, setDeliveryCost] = useState(null);

  // Regions/districts/warehouses
  const uniqueRegions = [...new Set(warehouseData.map((w) => w.region))];

  const [selectedSenderRegion, setSelectedSenderRegion] = useState("");
  const [selectedSenderDistrict, setSelectedSenderDistrict] = useState("");
  const [selectedReceiverRegion, setSelectedReceiverRegion] = useState("");
  const [selectedReceiverDistrict, setSelectedReceiverDistrict] = useState("");

  const senderDistricts = selectedSenderRegion
    ? [...new Set(warehouseData.filter((w) => w.region === selectedSenderRegion).map((w) => w.district))]
    : [];

  const receiverDistricts = selectedReceiverRegion
    ? [...new Set(warehouseData.filter((w) => w.region === selectedReceiverRegion).map((w) => w.district))]
    : [];

  const senderWarehouses = selectedSenderDistrict
    ? warehouseData.find((w) => w.district === selectedSenderDistrict)?.covered_area || []
    : [];

  const receiverWarehouses = selectedReceiverDistrict
    ? warehouseData.find((w) => w.district === selectedReceiverDistrict)?.covered_area || []
    : [];

  const parcelType = watch("parcelType");
  const weight = parseFloat(watch("parcelWeight") || 0);
  const paymentMethod = watch("paymentMethod");

  useEffect(() => {
    if (parcelType === "document") setValue("parcelWeight", "");
  }, [parcelType, setValue]);

  // helper: generate tracking id
  const generateTrackingId = () => `QST-BD-${String(Math.floor(Math.random() * 1000000)).padStart(6, "0")}`;

  // calculate cost and show confirm
  const calculateCostAndConfirm = (formValues) => {
    const isWithinCity = selectedSenderRegion === selectedReceiverRegion;
    const deliveryZone = isWithinCity ? "Within District" : "Outside District";

    let baseCost = 0;
    let extraCharges = 0;
    if (parcelType === "document") baseCost = isWithinCity ? 60 : 80;
    else {
      baseCost = isWithinCity ? 110 : 150;
      if (weight > 3) {
        const extraKg = weight - 3;
        extraCharges = extraKg * 40 + (isWithinCity ? 0 : 40);
      }
    }

    const totalCost = baseCost + extraCharges;
    setDeliveryCost(totalCost);

    // prepare human-readable summary html for SweetAlert
    const summaryHtml = `
      <div class="text-left">
        <p><strong>Parcel:</strong> ${formValues.parcelName || "-"}</p>
        <p><strong>Type:</strong> ${parcelType}</p>
        <p><strong>Weight:</strong> ${weight || 0} kg</p>
        <p><strong>Zone:</strong> ${deliveryZone}</p>
        <hr style="margin:8px 0;border-color:#e5e7eb;">
        <p><strong>Base Cost:</strong> ৳${baseCost}</p>
        <p><strong>Extra Charges:</strong> ৳${extraCharges}</p>
        <p style="font-size:0.875rem;color:#4b5563;">
          <em>Extra charges include special handling, remote zone delivery, and other applicable fees.</em>
        </p>
        <h3 style="margin-top:8px;color:#16a34a;">Total: ৳${totalCost}</h3>
        <hr style="margin:8px 0;border-color:#e5e7eb;">
        <p><strong>Sender:</strong> ${formValues.senderName || "-"} (${selectedSenderDistrict || "-"})</p>
        <p><strong>Receiver:</strong> ${formValues.receiverName || "-"} (${selectedReceiverDistrict || "-"})</p>
        <p><strong>Payment:</strong> ${paymentMethod}</p>
      </div>
  `;


    Swal.fire({
      title: "<strong>Confirm Parcel Details</strong>",
      html: summaryHtml,
      icon: "info",
      showCancelButton: true,
      confirmButtonText: "✅ Confirm",
      cancelButtonText: "✏️ Edit",
      background: "#ffffff",
      customClass: {
        popup: "rounded-2xl p-4",
        title: "text-lg font-medium",
      },
      buttonsStyling: true,
      confirmButtonColor: "#16a34a",
      cancelButtonColor: "#9ca3af",
    }).then(async (res) => {
      if (res.isConfirmed) {
        const now = new Date();
        const parcelObj = {
          trackingId: generateTrackingId(),
          parcelName: formValues.parcelName,
          parcelType,
          weight: weight || 0,
          deliveryZone,
          deliveryCost: totalCost,
          parcelStatus: "Processing",
          paymentStatus: paymentMethod === "Cash on Delivery" ? "Pending" : "Paid",
          paymentMethod,
          deliveryStatus: "Not Dispatched",
          createdBy: userEmail,
          createdAt: now.toISOString(), // machine-readable UTC ISO
          createdAtReadable: now.toLocaleString("en-BD", {
            timeZone: "Asia/Dhaka",
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "numeric",
            minute: "numeric",
            hour12: true,
          }),
          updatedAt: now.toISOString(),
          sender: {
            name: formValues.senderName,
            contact: formValues.senderContact,
            region: formValues.senderRegion || selectedSenderRegion,
            district: formValues.senderDistrict || selectedSenderDistrict,
            warehouse: formValues.senderWarehouse,
            address: formValues.senderAddress,
          },
          receiver: {
            name: formValues.receiverName,
            contact: formValues.receiverContact,
            region: formValues.receiverRegion || selectedReceiverRegion,
            district: formValues.receiverDistrict || selectedReceiverDistrict,
            warehouse: formValues.receiverWarehouse,
            address: formValues.receiverAddress,
          },
          pickupInstruction: formValues.pickupInstruction || "",
          deliveryInstruction: formValues.deliveryInstruction || "",
          expectedDeliveryDate: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString(), // example +3 days
          history: [
            { status: "Processing", time: now.toISOString(), by: userEmail },
          ],
        };

        // Console log final structure (ready for Firestore)
        // console.log("📦 Final Parcel Object:", parcelObj);

        try {
          const { data } = await axiosSecure.post(`/parcels`, { parcelObj });
          // console.log(data);
          if (data.success) {
            toast.custom((t) => (
              <div
                className={`bg-white shadow-lg rounded-lg p-4 border ${t.visible ? "animate-enter" : "animate-leave"}`}
                style={{ minWidth: 260 }}
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-1">
                    <p className="font-semibold text-sm">Parcel created</p>
                    <p className="text-xs text-gray-600">Tracking ID: <span className="font-mono text-green-600">{parcelObj.trackingId}</span></p>
                    <p className="text-xs text-gray-600">Total: ৳{parcelObj.deliveryCost}</p>
                    <p className="text-xs text-gray-500 mt-1">Saved as: {parcelObj.createdBy}</p>
                  </div>
                  <div>
                    <button
                      onClick={() => toast.remove(t.id)}
                      className="btn btn-ghost btn-sm"
                      aria-label="close"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            ));
            navigate('/dashboard/my-parcels');
          }
        } catch (err) {
          // console.log(err);
        }

      } else {
        toast(() => (
          <div className="bg-white rounded-lg p-3 shadow-sm border">
            <div className="text-sm text-gray-800 font-medium">You can edit your parcel details now.</div>
          </div>
        ));
      }
    });
  };

  // onSubmit collects form values and calls calculate/confirm
  const onSubmit = (data) => {
    // validations
    if (parcelType === "non-document" && (!weight || weight <= 0)) {
      toast.error("Please enter a valid weight for non-document parcels");
      return;
    }
    if (!selectedSenderRegion || !selectedReceiverRegion) {
      toast.error("Please select both sender and receiver regions");
      return;
    }
    calculateCostAndConfirm(data);
  };

  return (
    <section className="mt-4 mb-10 bg-white rounded-2xl p-6 md:p-10">
      <PageHeading title="Add Parcel" />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Parcel Info */}
        <div>
          <h2 className="font-semibold text-xl mb-4 text-[#03373D]">Enter Parcel Details</h2>

          <div className="flex space-x-6 mb-4">
            <label className="flex items-center space-x-3">
              <input type="radio" value="non-document" {...register("parcelType", { required: true })} className="radio radio-success" />
              <span>Non-Document</span>
            </label>
            <label className="flex items-center space-x-3">
              <input type="radio" value="document" {...register("parcelType", { required: true })} className="radio radio-success" />
              <span>Document</span>
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input {...register("parcelName", { required: true })} placeholder="Parcel Name" className="input input-bordered w-full" />
            <input
              {...register("parcelWeight")}
              type="number"
              step="0.1"
              min="0"
              placeholder="Parcel Weight (KG)"
              className={`input input-bordered w-full ${parcelType === "document" ? "bg-gray-100 cursor-not-allowed" : ""}`}
              disabled={parcelType === "document"}
            />
          </div>

          {/* Payment method selector (user asked) */}
          <div className="mt-3">
            <label className="block text-sm font-medium mb-2">Payment Method</label>
            <select {...register("paymentMethod")} className="select select-bordered w-full">
              <option>Cash on Delivery</option>
              <option>Card</option>
              <option>bKash</option>
              <option>Nagad</option>
            </select>
          </div>
        </div>

        {/* Sender & Receiver */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Sender */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Sender Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input {...register("senderName", { required: true })} placeholder="Sender Name" className="input input-bordered w-full" value={user?.displayName} />
              <input {...register("senderContact", { required: true })} placeholder="Sender Contact No" className="input input-bordered w-full" />

              <select
                {...register("senderRegion", { required: true })}
                className="select select-bordered w-full"
                onChange={(e) => { setSelectedSenderRegion(e.target.value); setSelectedSenderDistrict(""); }}
              >
                <option value="">Select Region</option>
                {uniqueRegions.map((region) => <option key={region} value={region}>{region}</option>)}
              </select>

              <select
                {...register("senderDistrict", { required: true })}
                className="select select-bordered w-full"
                onChange={(e) => setSelectedSenderDistrict(e.target.value)}
                disabled={!selectedSenderRegion}
              >
                <option value="">Select District</option>
                {senderDistricts.map(d => <option key={d} value={d}>{d}</option>)}
              </select>

              <select {...register("senderWarehouse")} className="select select-bordered w-full" disabled={!selectedSenderDistrict}>
                <option value="">Select Warehouse</option>
                {senderWarehouses.map(wh => <option key={wh} value={wh}>{wh}</option>)}
              </select>

              <input {...register("senderAddress", { required: true })} placeholder="Sender Address" className="input input-bordered w-full" />

              <textarea {...register("pickupInstruction")} placeholder="Pickup Instruction" className="textarea textarea-bordered w-full md:col-span-2" rows={3} />
            </div>
          </div>

          {/* Receiver */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Receiver Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input {...register("receiverName", { required: true })} placeholder="Receiver Name" className="input input-bordered w-full" />
              <input {...register("receiverContact", { required: true })} placeholder="Receiver Contact No" className="input input-bordered w-full" />

              <select
                {...register("receiverRegion", { required: true })}
                className="select select-bordered w-full"
                onChange={(e) => { setSelectedReceiverRegion(e.target.value); setSelectedReceiverDistrict(""); }}
              >
                <option value="">Select Region</option>
                {uniqueRegions.map((region) => <option key={region} value={region}>{region}</option>)}
              </select>

              <select
                {...register("receiverDistrict", { required: true })}
                className="select select-bordered w-full"
                onChange={(e) => setSelectedReceiverDistrict(e.target.value)}
                disabled={!selectedReceiverRegion}
              >
                <option value="">Select District</option>
                {receiverDistricts.map(d => <option key={d} value={d}>{d}</option>)}
              </select>

              <select {...register("receiverWarehouse")} className="select select-bordered w-full" disabled={!selectedReceiverDistrict}>
                <option value="">Select Warehouse</option>
                {receiverWarehouses.map(wh => <option key={wh} value={wh}>{wh}</option>)}
              </select>

              <input {...register("receiverAddress", { required: true })} placeholder="Receiver Address" className="input input-bordered w-full" />

              <textarea {...register("deliveryInstruction")} placeholder="Delivery Instruction" className="textarea textarea-bordered w-full md:col-span-2" rows={3} />
            </div>
          </div>
        </div>

        <p className="text-sm text-gray-600">* Pickup Time: 4pm–7pm (Approx.)</p>

        <PrimaryButton>Proceed to Confirm Booking</PrimaryButton>
      </form>
    </section>
  );
};

export default AddParcel;
