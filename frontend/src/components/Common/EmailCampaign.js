import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import EmailHistoryModal from './EmailHistoryModal';

function EmailCampaign({ role }) {
  const { token} = useContext(AuthContext);
  const userId = localStorage.getItem('id');
  const [leads, setLeads] = useState([]);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [selectedLead, setSelectedLead] = useState(null);
  const [newCampaign, setNewCampaign] = useState({ leadId: '', category: 'Promotional', content: '', sentBy: '', sentAt: '' });
  const [editingCampaign, setEditingCampaign] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalCategory, setModalCategory] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [leadsResponse, usersResponse] = await Promise.all([
          axios.get(
            role === 'admin'
              ? `http://localhost:5001/api/leads`
              : `http://localhost:5001/api/leads/assigned/${userId}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          ),
          axios.get(
            role === 'admin'
              ? `http://localhost:5001/api/users`
              : `http://localhost:5001/api/users/user-public`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          ),
        ]);
        const fetchedLeads = leadsResponse.data || [];
        setLeads(fetchedLeads);
        const fetchedUsers = usersResponse.data || [];
        setUsers(fetchedUsers);
        if (fetchedLeads.length > 0) {
          setNewCampaign({
            ...newCampaign,
            leadId: fetchedLeads[0]._id,
            sentBy: role === 'admin' ? fetchedUsers[0]?._id || userId : userId,
          });
        } else if (role !== 'admin') {
          setError('No assigned leads found');
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch data');
      }
    };
    fetchData();
  }, [token, userId, role]);

  const handleAddCampaign = async () => {
    if (!newCampaign.leadId) {
      setError('Please select a lead');
      return;
    }
    if (!newCampaign.sentBy) {
      setError('Please select a user');
      return;
    }
    if (!newCampaign.sentAt) {
      setError('Please select a date and time');
      return;
    }
    try {
      const response = await axios.post(
        `http://localhost:5001/api/email-campaigns/${newCampaign.leadId}`,
        { category: newCampaign.category, content: newCampaign.content, sentBy: newCampaign.sentBy, sentAt: newCampaign.sentAt },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setLeads(leads.map((lead) => (lead._id === newCampaign.leadId ? response.data.lead : lead)));
      setNewCampaign({
        leadId: leads[0]?._id || '',
        category: 'Promotional',
        content: '',
        sentBy: role === 'admin' ? users[0]?._id || userId : userId,
        sentAt: '',
      });
      setError('');
      alert('Email campaign added');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add email campaign');
    }
  };

  const handleEditCampaign = async (leadId, campaignId) => {
    if (!editingCampaign.sentBy) {
      setError('Please select a user');
      return;
    }
    if (!editingCampaign.sentAt) {
      setError('Please select a date and time');
      return;
    }
    try {
      const response = await axios.put(
        `http://localhost:5001/api/email-campaigns/${leadId}/${campaignId}`,
        { category: editingCampaign.category, content: editingCampaign.content, sentBy: editingCampaign.sentBy, sentAt: editingCampaign.sentAt },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setLeads(leads.map((lead) => (lead._id === leadId ? response.data.lead : lead)));
      setEditingCampaign(null);
      setError('');
      alert('Email campaign updated');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update email campaign');
    }
  };

  const handleDeleteCampaign = async (leadId, campaignId) => {
    if (window.confirm('Are you sure you want to delete this email campaign?')) {
      try {
        const response = await axios.delete(
          `http://localhost:5001/api/email-campaigns/${leadId}/${campaignId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setLeads(leads.map((lead) => (lead._id === leadId ? response.data.lead : lead)));
        setError('');
        alert('Email campaign deleted');
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete email campaign');
      }
    }
  };

  const openHistoryModal = (lead, category) => {
    setSelectedLead(lead);
    setModalCategory(category);
    setShowModal(true);
  };

  const selectedLeadEmail = leads.find((lead) => lead._id === newCampaign.leadId)?.email || '';

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-3xl font-bold mb-4">Email Campaign Management</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {leads.length === 0 && role !== 'admin' && (
        <p className="text-gray-500 mb-4">No assigned leads available.</p>
      )}
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Add New Campaign</h3>
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          <select
            value={newCampaign.leadId}
            onChange={(e) => setNewCampaign({ ...newCampaign, leadId: e.target.value })}
            className="p-2 border rounded-lg"
            disabled={leads.length === 0}
          >
            <option value="">Select Lead</option>
            {leads.map((lead) => (
              <option key={lead._id} value={lead._id}>
                {lead.schoolName} ({lead.email})
              </option>
            ))}
          </select>
          <input
            type="text"
            value={selectedLeadEmail}
            readOnly
            placeholder="Lead email"
            className="p-2 border rounded-lg bg-gray-100"
          />
          <select
            value={newCampaign.sentBy}
            onChange={(e) => setNewCampaign({ ...newCampaign, sentBy: e.target.value })}
            className="p-2 border rounded-lg"
            disabled={role !== 'admin'}
          >
            <option value="">Select User</option>
            {users.map((user) => (
              <option key={user._id} value={user._id}>
                {user.username}
              </option>
            ))}
          </select>
          <select
            value={newCampaign.category}
            onChange={(e) => setNewCampaign({ ...newCampaign, category: e.target.value })}
            className="p-2 border rounded-lg"
          >
            <option value="Promotional">Promotional</option>
            <option value="Follow-up">Follow-up</option>
            <option value="Newsletter">Newsletter</option>
          </select>
          <input
            type="datetime-local"
            value={newCampaign.sentAt}
            onChange={(e) => setNewCampaign({ ...newCampaign, sentAt: e.target.value })}
            className="p-2 border rounded-lg"
          />
          <textarea
            placeholder="Email content"
            value={newCampaign.content}
            onChange={(e) => setNewCampaign({ ...newCampaign, content: e.target.value })}
            className="p-2 border rounded-lg"
          />
          <button
            onClick={handleAddCampaign}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
            disabled={leads.length === 0}
          >
            Add Campaign
          </button>
        </div>
      </div>
      {leads.map((lead) => (
        <div key={lead._id} className="mb-6 border-b pb-4">
          <h3 className="text-xl font-semibold">{lead.schoolName} ({lead.email})</h3>
          <table className="w-full mt-4 border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-3 text-left">Category</th>
                <th className="p-3 text-left">Content</th>
                <th className="p-3 text-left">Sent By</th>
                <th className="p-3 text-left">Sent At</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {lead.emailCampaigns.length > 0 ? (
                lead.emailCampaigns.map((campaign) => (
                  <tr key={campaign._id} className="border-b">
                    <td className="p-3">
                      <button
                        onClick={() => openHistoryModal(lead, campaign.category)}
                        className="text-blue-500 hover:underline"
                      >
                        {campaign.category}
                      </button>
                    </td>
                    <td className="p-3">{campaign.content.substring(0, 50)}...</td>
                    <td className="p-3">{campaign.sentBy?.username || 'Unknown'}</td>
                    <td className="p-3">{new Date(campaign.sentAt).toLocaleString()}</td>
                    <td className="p-3">
                      {(campaign.sentBy._id === userId || role === 'admin') && (
                        <button
                          onClick={() => setEditingCampaign({
                            id: campaign._id,
                            category: campaign.category,
                            content: campaign.content,
                            sentBy: campaign.sentBy._id,
                            sentAt: new Date(campaign.sentAt).toISOString().slice(0, 16),
                          })}
                          className="bg-yellow-500 text-white px-4 py-2 rounded-lg mr-2 hover:bg-yellow-600 transition"
                        >
                          Edit
                        </button>
                      )}
                      {role === 'admin' && (
                        <button
                          onClick={() => handleDeleteCampaign(lead._id, campaign._id)}
                          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                        >
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="p-3 text-center text-gray-500">
                    No email campaigns found for this lead.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          {editingCampaign && (
            <div className="mt-4">
              <h4 className="text-lg font-semibold">Edit Campaign</h4>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <select
                  value={editingCampaign.category}
                  onChange={(e) => setEditingCampaign({ ...editingCampaign, category: e.target.value })}
                  className="p-2 border rounded-lg"
                >
                  <option value="Promotional">Promotional</option>
                  <option value="Follow-up">Follow-up</option>
                  <option value="Newsletter">Newsletter</option>
                </select>
                <select
                  value={editingCampaign.sentBy}
                  onChange={(e) => setEditingCampaign({ ...editingCampaign, sentBy: e.target.value })}
                  className="p-2 border rounded-lg"
                  disabled={role !== 'admin'}
                >
                  <option value="">Select User</option>
                  {users.map((user) => (
                    <option key={user._id} value={user._id}>
                      {user.username}
                    </option>
                  ))}
                </select>
                <input
                  type="datetime-local"
                  value={editingCampaign.sentAt}
                  onChange={(e) => setEditingCampaign({ ...editingCampaign, sentAt: e.target.value })}
                  className="p-2 border rounded-lg"
                />
                <textarea
                  value={editingCampaign.content}
                  onChange={(e) => setEditingCampaign({ ...editingCampaign, content: e.target.value })}
                  className="p-2 border rounded-lg"
                />
                <button
                  onClick={() => handleEditCampaign(lead._id, editingCampaign.id)}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg mr-2 hover:bg-green-600 transition"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditingCampaign(null)}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
      {showModal && selectedLead && (
        <EmailHistoryModal
          lead={selectedLead}
          category={modalCategory}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}

export default EmailCampaign;