import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import LeadHistoryModalUser from './LeadHistoryModalUser';

function LeadListing() {
  const { token, user } = useContext(AuthContext);
  const [leads, setLeads] = useState([]);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [selectedLead, setSelectedLead] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [leadsResponse, usersResponse] = await Promise.all([
          axios.get(`http://localhost:5001/api/leads`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`http://localhost:5001/api/users/public`, {
            headers: { Authorization: `Bearer ${token}` },
          }).catch((err) => {
            console.warn('Failed to fetch users:', err.response?.data?.message || err.message);
            return { data: [] };
          }),
        ]);
        setLeads(leadsResponse.data);
        setUsers(usersResponse.data);
        if (!usersResponse.data.length) {
          setError('Unable to fetch user data; usernames may not display correctly.');
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch leads');
      }
    };
    fetchData();
  }, [token]);

  const updateLead = async (leadId, historyId, updates) => {
    try {
      let endpoint = `http://localhost:5001/api/leads/${leadId}`;
      if (historyId) {
        endpoint += `/history/${historyId}`;
      }
      await axios.put(endpoint, updates, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setError('');
      const response = await axios.get(`http://localhost:5001/api/leads`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLeads(response.data);
      if (selectedLead && selectedLead._id === leadId) {
        const updatedLead = response.data.find((lead) => lead._id === leadId);
        setSelectedLead(updatedLead);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update lead');
    }
  };

  const openHistoryModal = (lead) => {
    setSelectedLead(lead);
  };

  const closeHistoryModal = () => {
    setSelectedLead(null);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-3xl font-bold mb-4">Lead Listing</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-3 text-left">School Name</th>
            <th className="p-3 text-left">Address</th>
            <th className="p-3 text-left">Phone</th>
            <th className="p-3 text-left">Status</th>
            <th className="p-3 text-left">Assigned To</th>
            <th className="p-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => (
            <tr key={lead._id} className="border-b">
              <td className="p-3">{lead.schoolName}</td>
              <td className="p-3">{lead.address}</td>
              <td className="p-3">{lead.phoneNumber}</td>
              <td className="p-3">{lead.progressStatus || 'N/A'}</td>
              <td className="p-3">{lead.assignedTo?.username || 'Unassigned'}</td>
              <td className="p-3">
                <button
                  onClick={() => openHistoryModal(lead)}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
                >
                  View History
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {selectedLead && (
        <LeadHistoryModalUser
          lead={selectedLead}
          onClose={closeHistoryModal}
          users={users}
          currentUserId={users.id}
          onUpdateLead={updateLead}
        />
      )}
    </div>
  );
}

export default LeadListing;