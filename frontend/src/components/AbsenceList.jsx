import { useState } from "react";
import PropTypes from "prop-types";

const AbsenceList = ({ absences, loading }) => {
  const [filterMonth, setFilterMonth] = useState("");
  const [filterYear, setFilterYear] = useState("");
  const dates = absences.map((absence) => new Date(absence.tanggal));
  const years = [...new Set(dates.map((date) => date.getFullYear()))];
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const filteredAbsences = absences.filter((absence) => {
    const date = new Date(absence.tanggal);
    const matchYear = filterYear ? date.getFullYear() === parseInt(filterYear) : true;
    const matchMonth = filterMonth ? date.getMonth() === parseInt(filterMonth) : true;
    return matchYear && matchMonth;
  });

  AbsenceList.propTypes = {
    absences: PropTypes.arrayOf(
      PropTypes.shape({
        karyawanId: PropTypes.string.isRequired,
        lokasi: PropTypes.string.isRequired,
        foto: PropTypes.string.isRequired,
      })
    ).isRequired,
    loading: PropTypes.bool.isRequired,
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!absences.length) {
    return (
      <div className="bg-white rounded-lg shadow p-6 text-center">
        <p className="text-gray-600">No absence records found</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-white p-4 rounded-lg shadow flex gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
          <select
            value={filterYear}
            onChange={(e) => setFilterYear(e.target.value)}
            className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Years</option>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Month</label>
          <select
            value={filterMonth}
            onChange={(e) => setFilterMonth(e.target.value)}
            className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Months</option>
            {months.map((month, index) => (
              <option key={index} value={index}>
                {month}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Staff Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Check In
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Check Out
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Photo
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAbsences.map((absence) => {
                const checkInDate = new Date(absence.checkIn);
                const checkOutDate = absence.checkOut ? new Date(absence.checkOut) : null;

                return (
                  <tr key={absence._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{absence.karyawanId?.nama || "N/A"}</div>
                      <div className="text-sm text-gray-500">{absence.karyawanId?.email || "N/A"}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{checkInDate.toLocaleDateString()}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{checkInDate.toLocaleTimeString()}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {checkOutDate ? checkOutDate.toLocaleTimeString() : "-"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{absence.lokasi || "-"}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {absence.foto ? (
                        <img
                          src={absence.foto}
                          alt="Attendance"
                          className="h-10 w-10 rounded-full object-cover cursor-pointer hover:opacity-80"
                          onClick={() => window.open(absence.foto, "_blank")}
                        />
                      ) : (
                        <span className="text-sm text-gray-500">No photo</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AbsenceList;
