import { createBrowserRouter } from "react-router";
import Home from "../pages/Home";
import RootLayout from "../layouts/RootLayout";
import AuthLayout from "../layouts/AuthLayout";
import Signin from "../pages/Authentication/Signin/Signin";

const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      { index: true, Component: Home }
    ]
  },
  {
    path: "/",
    Component: AuthLayout,
    children: [
      { path: "signin", Component: Signin }
    ]
  }
]);

export default router;