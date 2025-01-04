import { useState } from "react";
import PropTypes from "prop-types";
import EditStaffModal from "./EditStaffModal";
import DeleteStaffModal from "./DeleteStaffModal";

const StaffList = ({ staff, onUpdate, onDelete, loading }) => {
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);

  StaffList.propTypes = {
    staff: PropTypes.arrayOf(
      PropTypes.shape({
        karyawanId: PropTypes.string.isRequired,
        nama: PropTypes.string.isRequired,
        email: PropTypes.string.isRequired,
        noTelp: PropTypes.string.isRequired,
        alamat: PropTypes.string.isRequired,
      })
    ).isRequired,
    onUpdate: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
  };

  const handleEdit = (staffMember) => {
    setSelectedStaff(staffMember);
    setEditModalOpen(true);
  };

  const handleDelete = (staffMember) => {
    setSelectedStaff(staffMember);
    setDeleteModalOpen(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!staff.length) {
    return (
      <div className="bg-white rounded-lg shadow p-6 text-center">
        <p className="text-gray-600">No staff members found</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Address
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {staff.map((staffMember) => (
              <tr key={staffMember.karyawanId} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{staffMember.nama}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{staffMember.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{staffMember.noTelp}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{staffMember.alamat}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(staffMember)}
                      className="text-blue-600 hover:text-blue-900 transition-colors duration-200 bg-blue-100 px-6 py-2 rounded hover:bg-blue-300"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(staffMember)}
                      className="text-red-600 hover:text-red-900 transition-colors duration-200 bg-red-100 px-4 py-2 rounded hover:bg-red-300"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editModalOpen && (
        <EditStaffModal
          staff={selectedStaff}
          onClose={() => {
            setEditModalOpen(false);
            setSelectedStaff(null);
          }}
          onSubmit={async (formData) => {
            await onUpdate(selectedStaff.karyawanId, formData);
            setEditModalOpen(false);
            setSelectedStaff(null);
          }}
        />
      )}

      {deleteModalOpen && (
        <DeleteStaffModal
          staff={selectedStaff}
          onClose={() => {
            setDeleteModalOpen(false);
            setSelectedStaff(null);
          }}
          onDelete={async () => {
            await onDelete(selectedStaff.karyawanId);
            setDeleteModalOpen(false);
            setSelectedStaff(null);
          }}
        />
      )}
    </div>
  );
};

export default StaffList;
