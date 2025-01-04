import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import StaffList from "../components/StaffList";
import AbsenceList from "../components/AbsenceList";
import AddStaffModal from "../components/AddStaffModal";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("staff");
  const [staff, setStaff] = useState([]);
  const [absences, setAbsences] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const API_URL = "http://localhost:8000";

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchData();
  }, [token, activeTab]);

  const fetchData = async () => {
    try {
      setLoading(true);
      if (activeTab === "staff") {
        const response = await axios.get(`${API_URL}/karyawan`, {
          headers: { Authorization: token },
        });
        setStaff(response.data.data);
      } else {
        const response = await axios.get(`${API_URL}/absen`, {
          headers: { Authorization: token },
        });
        setAbsences(response.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Error fetching data");
    } finally {
      setLoading(false);
    }
  };

  const handleAddStaff = async (staffData) => {
    try {
      await axios.post(`${API_URL}/karyawan`, staffData, {
        headers: { Authorization: token },
      });
      fetchData();
      setIsAddModalOpen(false);
    } catch (err) {
      setError(err.response?.data?.message || "Error adding staff");
    }
  };

  const handleUpdateStaff = async (id, staffData) => {
    try {
      await axios.put(`${API_URL}/karyawan/${id}`, staffData, {
        headers: { Authorization: token },
      });
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || "Error updating staff");
    }
  };

  const handleDeleteStaff = async (id) => {
    try {
      await axios.delete(`${API_URL}/karyawan/${id}`, {
        headers: { Authorization: token },
      });
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || "Error deleting staff");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
            <button
              onClick={() => {
                localStorage.clear();
                navigate("/login");
              }}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setActiveTab("staff")}
            className={`px-4 py-2 rounded ${
              activeTab === "staff" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"
            }`}
          >
            Staff Management
          </button>
          <button
            onClick={() => setActiveTab("absence")}
            className={`px-4 py-2 rounded ${
              activeTab === "absence" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"
            }`}
          >
            Absence Records
          </button>
        </div>

        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

        {activeTab === "staff" ? (
          <>
            <div className="mb-4 flex justify-end">
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Add New Staff
              </button>
            </div>
            <StaffList staff={staff} onUpdate={handleUpdateStaff} onDelete={handleDeleteStaff} loading={loading} />
          </>
        ) : (
          <AbsenceList absences={absences} loading={loading} />
        )}
      </div>

      {isAddModalOpen && <AddStaffModal onClose={() => setIsAddModalOpen(false)} onSubmit={handleAddStaff} />}
    </div>
  );
};

export default AdminDashboard;
