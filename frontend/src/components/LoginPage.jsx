import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import backgroundImg from "../assets/background.jpg";

const API_URL = "http://localhost:8000/auth";

const LoginPage = () => {
  const navigate = useNavigate();
  const [activeRole, setActiveRole] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!activeRole) {
      setError("Silakan pilih tipe login terlebih dahulu");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await axios.post(`${API_URL}/login/${activeRole.toLowerCase()}`, formData);

      const { token, data } = response.data;
      localStorage.setItem("token", token);
      localStorage.setItem("userData", JSON.stringify(data));
      localStorage.setItem("userRole", activeRole);

      if (activeRole === "karyawan") {
        navigate("/attendance");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Terjadi kesalahan saat login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col justify-center items-center p-4 relative bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url(${backgroundImg})`,
      }}
    >
      <div className="absolute inset-0 bg-black/75" />

      <div className="max-w-md w-full relative">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white drop-shadow-lg">Welcome</h1>
          <p className="text-gray-200 mt-2 text-lg">Sistem Manajemen Absensi</p>
        </div>

        <div className="backdrop-blur-sm bg-white/90 rounded-xl shadow-2xl p-8 transition-all duration-300 hover:shadow-blue-500/10">
          {!activeRole ? (
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">Pilih Tipe Login</h2>
              <button
                onClick={() => setActiveRole("karyawan")}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 
                text-white font-medium py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-102 
                hover:shadow-lg flex items-center justify-center space-x-2"
              >
                <span>Login sebagai Karyawan</span>
              </button>
              <button
                onClick={() => setActiveRole("admin")}
                className="w-full bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 
                text-white font-medium py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-102 
                hover:shadow-lg flex items-center justify-center space-x-2"
              >
                <span>Login sebagai Admin</span>
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <h3 className="text-xl font-medium text-center text-gray-700 mb-6">Login sebagai {activeRole}</h3>
              <div className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 
                    focus:ring-blue-500 transition-all duration-300 bg-white/50 backdrop-blur-sm"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 
                    focus:ring-blue-500 transition-all duration-300 bg-white/50 backdrop-blur-sm"
                    value={formData.password}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              {error && (
                <div className="bg-red-100/90 backdrop-blur-sm text-red-700 p-3 rounded-lg text-center">{error}</div>
              )}

              <div className="space-y-3">
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full ${
                    activeRole === "karyawan"
                      ? "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                      : "bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800"
                  } text-white font-medium py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-102 
                  hover:shadow-lg ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  {loading ? "Memproses..." : "Login"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveRole("");
                    setFormData({ email: "", password: "" });
                    setError("");
                  }}
                  className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg 
                  transition-all duration-300 transform hover:scale-102"
                >
                  Kembali
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
