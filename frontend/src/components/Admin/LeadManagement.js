import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import LeadHistoryModal from './LeadHistoryModal';
import EmailHistoryModal from '../Common/EmailHistoryModal';

function LeadManagement() {
  const { token } = useContext(AuthContext);
  const [leads, setLeads] = useState([]);
  const [users, setUsers] = useState([]);
  const [newLead, setNewLead] = useState({
    schoolName: '',
    address: '',
    phoneNumber: '',
    assignedTo: '',
  });
  const [error, setError] = useState('');
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showLeadModal, setShowLeadModal] = useState(false);
    const [selectedLead, setSelectedLead] = useState(null);
    const [modalCategory, setModalCategory] = useState('');


  const LeadStatusOptions = [
    { name: '1st Call', value: '1st Call' },
    { name: 'Demo Done', value: 'Demo Done' },
    { name: 'Credential Request', value: 'Credential Request' },
    { name: 'Credential Sent', value: 'Credential Sent' },
    { name: 'Pilot Done', value: 'Pilot Done' },
    { name: 'School Onboarded', value: 'School Onboarded' },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [leadsResponse, usersResponse] = await Promise.all([
          axios.get(`http://localhost:5001/api/leads`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`http://localhost:5001/api/users`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        setLeads(leadsResponse.data);
        setUsers(usersResponse.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch data');
      }
    };
    fetchData();
  }, [token]);

  const createLead = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`http://localhost:5001/api/leads`, newLead, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNewLead({
        schoolName: '',
        address: '',
        phoneNumber: '',
        assignedTo: '',
      });
      setError('');
      const response = await axios.get(`http://localhost:5001/api/leads`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLeads(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create lead');
    }
  };

  const deleteLead = async (id) => {
    if (window.confirm('Are you sure you want to delete this lead?')) {
      try {
        await axios.delete(`http://localhost:5001/api/leads/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLeads(leads.filter((lead) => lead._id !== id));
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete lead');
      }
    }
  };

  const updateLeadStatus = async (id, status) => {
    try {
      await axios.put(
        `http://localhost:5001/api/leads/${id}`,
        { progressStatus: status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setError('');
      const response = await axios.get(`http://localhost:5001/api/leads`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLeads(response.data);
      setOpenDropdownId(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update lead status');
    }
  };

  const updateAssignedTo = async (id, assignedTo, description = 'Reassigned user') => {
    try {
      await axios.put(
        `http://localhost:5001/api/leads/${id}`,
        { assignedTo, description },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setError('');
      const response = await axios.get(`http://localhost:5001/api/leads`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLeads(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update assigned user');
    }
  };

  const updateHistoryDescription = async (leadId, historyId, description) => {
    try {
      await axios.put(
        `http://localhost:5001/api/leads/${leadId}/history/${historyId}`,
        { description },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setError('');
      const response = await axios.get(`http://localhost:5001/api/leads`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLeads(response.data);
      setSelectedLead({
        ...selectedLead,
        statusHistory: response.data.find((lead) => lead._id === leadId).statusHistory,
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update history description');
    }
  };

  const toggleDropdown = (id) => {
    setOpenDropdownId(openDropdownId === id ? null : id);
  };

  const openEmailHistoryModal = (lead, category) => {
    setSelectedLead(lead);
    setModalCategory(category);
    setShowEmailModal(true);
  };

  const openLeadHistoryModal = (lead) => {
    setSelectedLead(lead);
    setShowLeadModal(true);
  };
  const closeHistoryModal = () => {
    setSelectedLead(null);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-3xl font-bold mb-4">Lead Management</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Create Lead</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="School Name"
            value={newLead.schoolName}
            onChange={(e) => setNewLead({ ...newLead, schoolName: e.target.value })}
            className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="Address"
            value={newLead.address}
            onChange={(e) => setNewLead({ ...newLead, address: e.target.value })}
            className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="Phone Number"
            value={newLead.phoneNumber}
            onChange={(e) => setNewLead({ ...newLead, phoneNumber: e.target.value })}
            className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
            <input
            type="text"
            placeholder="Email Address"
            value={newLead.email}
            onChange={(e) => setNewLead({ ...newLead, email: e.target.value })}
            className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={newLead.assignedTo}
            onChange={(e) => setNewLead({ ...newLead, assignedTo: e.target.value })}
            className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select User</option>
            {users.map((user) => (
              <option key={user._id} value={user._id}>
                {user.username}
              </option>
            ))}
          </select>
          <button
            onClick={createLead}
            className="bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition"
          >
            Create Lead
          </button>
        </div>
      </div>
      <h3 className="text-xl font-semibold mb-4">Leads</h3>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-3 text-left">School Name</th>
            <th className="p-3 text-left">Address</th>
            <th className="p-3 text-left">Phone</th>
            <th className="p-3 text-left">Status</th>
            <th className="p-3 text-left">Assigned To</th>
            <th className="p-3 text-left">Email Campaigns</th>
            <th className="p-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => (
            <tr key={lead._id} className="border-b">
              <td className="p-3">{lead.schoolName}</td>
              <td className="p-3">{lead.address}</td>
              <td className="p-3">{lead.phoneNumber}</td>
              <td className="p-3">
                <div className="relative">
                  <button
                    onClick={() => toggleDropdown(lead._id)}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition flex items-center"
                  >
                    {lead.progressStatus || 'Select Status'}
                    <svg
                      className="w-4 h-4 ml-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                  {openDropdownId === lead._id && (
                    <div className="absolute z-10 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg">
                      <ul className="py-1 text-sm text-gray-700">
                        {LeadStatusOptions.map((status) => (
                          <li key={status.value}>
                            <button
                              onClick={() => updateLeadStatus(lead._id, status.value)}
                              className="block w-full text-left px-4 py-2 hover:bg-gray-100 transition"
                            >
                              {status.name}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </td>
              <td className="p-3">
                <select
                  value={lead.assignedTo?._id || ''}
                  onChange={(e) => updateAssignedTo(lead._id, e.target.value)}
                  className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Unassigned</option>
                  {users.map((user) => (
                    <option key={user._id} value={user._id}>
                      {user.username}
                    </option>
                  ))}
                </select>
              </td>
              <td className="p-3">
                {lead.emailCampaigns.length > 0 ? (
                  lead.emailCampaigns.map((campaign) => (
                    <button
                      key={campaign._id}
                      onClick={() => openEmailHistoryModal(lead, campaign.category)}
                      className="text-blue-500 hover:underline mr-2"
                    >
                      {campaign.category}
                    </button>
                  ))
                ) : (
                  'None'
                )}
              </td>
              <td className="p-3 flex space-x-2">
                <button
                  onClick={() => openLeadHistoryModal(lead)}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
                >
                  View History
                </button>
                 <button
                  onClick={() => openEmailHistoryModal(lead)}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
                >
                  View Email History
                </button>
                <button
                  onClick={() => deleteLead(lead._id)}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {selectedLead && showLeadModal && (
        <LeadHistoryModal
          lead={selectedLead}
          onClose={closeHistoryModal}
          users={users}
          onUpdateHistory={updateHistoryDescription}
        />
      )}
         {selectedLead && showEmailModal && (
        <EmailHistoryModal
          lead={selectedLead}
          category={modalCategory}
          onClose={() => setShowEmailModal(false)}
        />
      )}
    </div>
  );
}

export default LeadManagement;