import { createBrowserRouter, Navigate } from "react-router";
import Home from "../pages/Home/Home";
import RootLayout from "../layouts/RootLayout";
import AuthLayout from "../layouts/AuthLayout";
import Signin from "../pages/Authentication/Signin/Signin";
import Register from "../pages/Authentication/Register/Register";
import Coverage from "../pages/Coverage/Coverage";
import About from "../pages/About/About";
import ErrorPage from "../pages/ErrorPage/ErrorPage";
import AddParcel from "../pages/AddParcel/AddParcel";
import PrivateRoute from "./PrivateRoute";
import DashboardLayout from "../layouts/DashboardLayout";
import MyParcels from "../pages/Dashboard/MyParcels/MyParcels";
import Payment from "../pages/Payment/Payment";
import PaymentHistory from "../pages/Dashboard/PaymentHistory/PaymentHistory";
import BeARider from "../pages/Dashboard/BeARider/BeARider";
import PendingRiders from "../pages/Dashboard/PendingRiders/PendingRiders";
import ActiveRiders from "../pages/Dashboard/ActiveRiders/ActiveRiders";
import MakeAdmin from "../pages/Dashboard/MakeAdmin/MakeAdmin";
import AdminRoute from "./AdminRoute";
import Forbidden from "../pages/Forbidden/Forbidden";
import AssignRider from "../pages/Dashboard/AssignRider/AssignRider";

const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      { index: true, Component: Home },
      { path: 'coverage', Component: Coverage },
      { path: 'about', Component: About },
      {
        path: 'add-parcel',
        element: <PrivateRoute>
          <AddParcel />
        </PrivateRoute>
      },
      {
        path: 'be-a-rider',
        element: <PrivateRoute>
          <BeARider />
        </PrivateRoute>
      },
      {
        path: '/forbidden',
        Component: Forbidden
      },
      { path: '*', Component: ErrorPage }
    ],
  },
  {
    path: "/",
    Component: AuthLayout,
    children: [
      { path: "signin", Component: Signin },
      { path: "register", Component: Register },
    ]
  },
  {
    path: "dashboard",
    element: <PrivateRoute>
      <DashboardLayout />
    </PrivateRoute>,
    children: [
      {
        index: true,
        element: <Navigate to='/dashboard/my-parcels' replace />
      },
      {
        path: "my-parcels",
        Component: MyParcels
      },
      {
        path: 'payment/:parcelId',
        Component: Payment
      },
      {
        path: 'payment-history',
        Component: PaymentHistory
      },
      {
        path: 'pending-riders',
        element: <AdminRoute>
          <PendingRiders />
        </AdminRoute>
      },
      {
        path: 'active-riders',
        element: <AdminRoute>
          <ActiveRiders />
        </AdminRoute>
      },
      {
        path: 'make-admin',
        element: <AdminRoute>
          <MakeAdmin />
        </AdminRoute>
      },
      {
        path: 'assign-rider',
        element: <AdminRoute>
          <AssignRider />
        </AdminRoute>
      }
    ]
  }
]);

export default router;