import React, { useState } from "react";
import { FaSearch, FaUserShield, FaUserTimes } from "react-icons/fa";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const MakeAdmin = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");

  // Fetch all or searched users
  const {
    data: users = [],
    isPending,
  } = useQuery({
    queryKey: ["users", search],
    queryFn: async () => {
      if (search.trim().length > 0) {
        const { data } = await axiosSecure.get(`/users/search?email=${search}`);
        return data.users;
      } else {
        const { data } = await axiosSecure.get("/users");
        return data.users;
      }
    },
  });

  // Handle role update
  const updateRoleMutation = useMutation({
    mutationFn: async ({ id, role }) => {
      return await axiosSecure.patch(`/users/${id}/role`, { role });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
      Swal.fire({
        icon: "success",
        title: "Role Updated Successfully",
        timer: 1500,
        showConfirmButton: false,
        timerProgressBar: true
      });
    },
    onError: () => {
      Swal.fire({
        icon: "error",
        title: "Failed to Update Role",
      });
    },
  });

  const makeAdmin = (user) => {
    Swal.fire({
      title: "Make Admin?",
      text: `Are you sure you want to make ${user.username} an admin?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, make admin",
      confirmButtonColor: "#16a34a",
    }).then((res) => {
      if (res.isConfirmed) {
        updateRoleMutation.mutate({ id: user._id, role: "admin" });
      }
    });
  };

  const removeAdmin = (user) => {
    Swal.fire({
      title: "Remove Admin?",
      text: `Remove admin role from ${user.username}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
    }).then((res) => {
      if (res.isConfirmed) {
        updateRoleMutation.mutate({ id: user._id, role: "user" });
      }
    });
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
        <FaUserShield className="text-blue-600" />
        Admin Management
      </h2>

      {/* Search Bar */}
      <div className="flex gap-3 mb-5">
        <input
          type="text"
          placeholder="Search user by email..."
          className="input input-bordered w-full"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button className="btn bg-[#CAEB66] border-[#CAEB66] text-black">
          <FaSearch /> Search
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg shadow">
        <table className="table w-full">
          <thead className="bg-gray-100 text-gray-800">
            <tr>
              <th>#</th>
              <th>Photo</th>
              <th>Name</th>
              <th>Email</th>
              <th>Provider</th>
              <th>Role</th>
              <th>Last Login</th>
              <th>Created</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {isPending && (
              <tr>
                <td colSpan={9} className="text-center py-6">
                  Loading users...
                </td>
              </tr>
            )}

            {!isPending && users.length === 0 && (
              <tr>
                <td colSpan={9} className="text-center py-6 text-gray-500">
                  No users found.
                </td>
              </tr>
            )}

            {!isPending &&
              users.map((user, index) => (
                <tr key={user._id} className="hover:bg-gray-50">
                  <td>{index + 1}</td>

                  <td>
                    <img
                      src={user.photo}
                      className="w-10 h-10 rounded-full border"
                    />
                  </td>

                  <td>{user.username}</td>
                  <td>{user.email}</td>

                  <td>
                    <span className="badge badge-info">{user.provider}</span>
                  </td>

                  <td>
                    <span
                      className={`badge ${user.role === "admin"
                          ? "badge-success"
                          : "badge-neutral"
                        }`}
                    >
                      {user.role}
                    </span>
                  </td>

                  <td className="text-sm text-gray-600">
                    {user.lastLogIn
                      ? new Date(user.lastLogIn).toLocaleString()
                      : "N/A"}
                  </td>

                  <td className="text-sm text-gray-600">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>

                  <td className="flex gap-2 justify-center">
                    {user.role !== "admin" && (
                      <button
                        onClick={() => makeAdmin(user)}
                        className="btn btn-xs bg-green-600 text-white"
                      >
                        <FaUserShield /> Make Admin
                      </button>
                    )}

                    {user.role === "admin" && (
                      <button
                        onClick={() => removeAdmin(user)}
                        className="btn btn-xs bg-red-600 text-white"
                      >
                        <FaUserTimes /> Remove Admin
                      </button>
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MakeAdmin;
