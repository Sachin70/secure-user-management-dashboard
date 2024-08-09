import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import Table, { TableColumn } from "../../components/Table";
import Pagination from "../../components/Pagination";
import { fetchUsers, User } from "./utils";
import { setError, setLoading, setUsers } from "../../slices/userSlices";
import withAuth from "../../middleWare/withAuth";
import { RootState } from "../../store";

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const users = useSelector((state: RootState) => state.users.data);
  const loading = useSelector((state: RootState) => state.users.loading);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(2);

  useEffect(() => {
    const fetchData = async () => {
      dispatch(setLoading(true));

      try {
        const token = localStorage.getItem("token");
        if (token) {
          const response = await fetchUsers(currentPage, 5, token);
          dispatch(setUsers(response.data));
          setTotalPages(response.total_pages);
        } else {
          dispatch(setError("No token found"));
        }
      } catch (error) {
        dispatch(setError("Failed to fetch users"));
        console.error("Error fetching users:", error);
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchData();
  }, [dispatch, currentPage]);

  const columns: TableColumn<User>[] = [
    { header: "Avatar", accessor: "avatar" },
    { header: "First Name", accessor: "first_name" },
    { header: "Last Name", accessor: "last_name" },
    { header: "Email", accessor: "email" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="max-w-7xl mx-auto p-6 sm:p-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold leading-tight text-gray-900">
          Dashboard
        </h1>

        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      <Table
        data={users}
        columns={columns}
        loading={loading}
        renderCell={(item, accessor) =>
          accessor === "avatar" ? (
            <img
              src={item[accessor]}
              alt={item.first_name}
              className="w-10 h-10 rounded-full border border-gray-300"
            />
          ) : (
            item[accessor]
          )
        }
      />
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default withAuth(Dashboard);
