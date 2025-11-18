import { useQuery } from "@tanstack/react-query";
import useAuth from "./useAuth";
import useAxiosSecure from "./useAxiosSecure";

const useUserRole = () => {
  const { user, loading: authLoading } = useAuth();
  const axiosSecure = useAxiosSecure();

  const email = user?.email;

  const {
    data,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ["userRole", email],
    enabled: !!email && !authLoading, // Only run if user exists
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/${email}/role`);
      return res.data.user; // user → contains role
    }
  });

  const role = data?.role || "user";

  return {
    role,
    isAdmin: role === "admin",
    loading: isLoading || authLoading,
    error,
    refetch
  };
};

export default useUserRole;
