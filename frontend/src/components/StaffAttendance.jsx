import avatar from "../assets/avatar.jpg";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:8000/absen";

function StaffAttendance() {
  const navigate = useNavigate();
  const [postImage, setPostImage] = useState({ foto: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [location, setLocation] = useState("");
  const [userId, setUserId] = useState("");

  useEffect(() => {
    getUserLocation();

    const userDataString = localStorage.getItem("userData");
    const userRole = localStorage.getItem("userRole");
    const token = localStorage.getItem("token");

    if (!userDataString || !userRole || !token || userRole.toLowerCase() !== "karyawan") {
      setMessage("Sesi anda telah berakhir. Silakan login kembali.");
      navigate("/login");
      return;
    }

    try {
      const userData = JSON.parse(userDataString);
      if (!userData.karyawanId) {
        setMessage("Data user tidak valid. Silakan login kembali.");
        navigate("/login");
        return;
      }
      setUserId(userData.karyawanId);
    } catch (error) {
      console.error("Error parsing user data:", error);
      setMessage("Terjadi kesalahan. Silakan login kembali.");
      navigate("/login");
    }
  }, [navigate]);

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const locationString = `${position.coords.latitude},${position.coords.longitude}`;
          setLocation(locationString);
        },
        (error) => {
          console.error("Error getting location:", error);
          setMessage("Error mendapatkan lokasi. Mohon aktifkan layanan lokasi.");
        }
      );
    } else {
      setMessage("Browser anda tidak mendukung geolocation.");
    }
  };

  const submitAttendance = async (imageData) => {
    if (!userId) {
      setMessage("ID User tidak ditemukan. Silakan login kembali.");
      return;
    }

    if (!location) {
      setMessage("Lokasi diperlukan. Mohon aktifkan layanan lokasi.");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      // Log untuk debugging
      console.log("Token:", token);
      console.log("UserId:", userId);
      console.log("Request Data:", {
        foto: imageData.foto.substring(0, 100) + "...", // Log sebagian data foto saja
        lokasi: location,
      });

      const response = await axios.post(
        `${API_URL}/checkin/${userId}`,
        {
          foto: imageData.foto,
          lokasi: location,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Pastikan format Bearer token benar
            "Content-Type": "application/json",
          },
        }
      );

      setMessage(response.data.message);
      setPostImage({ foto: "" });
    } catch (error) {
      console.error("Full error:", error);

      if (error.response?.status === 401) {
        // Handle unauthorized error dengan lebih baik
        localStorage.clear(); // Clear semua data login
        setMessage("Sesi anda telah berakhir. Silakan login kembali.");
        navigate("/login");
        return;
      }

      const errorMessage = error.response?.data?.message || "Error saat submit absensi";
      setMessage(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!postImage.foto) {
      setMessage("Silakan pilih foto terlebih dahulu");
      return;
    }
    submitAttendance(postImage);
  };

  const handleFileUpload = async (e) => {
    try {
      const file = e.target.files[0];
      if (!file) return;

      const validTypes = ["image/jpeg", "image/png", "image/jpg"];
      if (!validTypes.includes(file.type)) {
        setMessage("Silakan upload file dengan format JPG, JPEG atau PNG");
        return;
      }

      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        setMessage("Ukuran file tidak boleh melebihi 5MB");
        return;
      }

      const base64 = await convertToBase64(file);
      setPostImage({ ...postImage, foto: base64 });
      setMessage("");
    } catch (error) {
      console.error("Error handling file upload:", error);
      setMessage("Error saat memproses gambar");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="text-center">
          <label htmlFor="file-upload" className="cursor-pointer block">
            <img
              src={postImage.foto || avatar}
              alt="Profile preview"
              className="w-32 h-32 mx-auto rounded-full object-cover"
            />
          </label>

          <input
            type="file"
            name="foto"
            id="file-upload"
            accept=".jpeg, .png, .jpg"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>

        <div className="text-center">
          <h3 className="text-xl font-semibold">Form Absensi</h3>
          <p className="text-sm text-gray-600">Silakan upload foto anda dengan mengklik gambar di atas</p>
          <p className="mt-2 text-sm text-gray-500">Maksimal ukuran file: 5MB</p>
          {location && <p className="mt-2 text-sm text-green-600">Lokasi berhasil didapatkan</p>}
        </div>

        {message && (
          <div
            className={`text-center p-2 rounded ${
              message.includes("Error") || message.includes("Silakan") || message.includes("Sesi")
                ? "bg-red-100 text-red-700"
                : "bg-green-100 text-green-700"
            }`}
          >
            {message}
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !postImage.foto || !location}
          className={`w-full py-2 px-4 rounded ${
            loading || !postImage.foto || !location ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
          } text-white font-medium`}
        >
          {loading ? "Memproses..." : "Submit Absensi"}
        </button>
      </form>
    </div>
  );
}

export default StaffAttendance;

function convertToBase64(file) {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = () => {
      resolve(fileReader.result);
    };
    fileReader.onerror = (error) => {
      reject(error);
    };
  });
}
