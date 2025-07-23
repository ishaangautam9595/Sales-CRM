import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import EmailHistoryModal from '../Common/EmailHistoryModal';

function UserEmailGenerator() {
  const { token } = useContext(AuthContext);
  const userId = localStorage.getItem('id') || '';
  const [leads, setLeads] = useState([]);
  const [error, setError] = useState('');
  const [selectedLead, setSelectedLead] = useState(null);
  const [formData, setFormData] = useState({
    leadId: '',
    description: '',
    category: 'Promotional',
    sentAt: '',
  });
  const [generatedEmail, setGeneratedEmail] = useState({ subject: '', body: '' });
  const [showModal, setShowModal] = useState(false);
  const [modalCategory, setModalCategory] = useState('');

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5001/api/leads/assigned/${userId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const fetchedLeads = response.data || [];
        setLeads(fetchedLeads);
        if (fetchedLeads.length > 0) {
          setFormData({ ...formData, leadId: fetchedLeads[0]._id });
        } else {
          setError('No assigned leads available');
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch leads');
      }
    };
    fetchLeads();
  }, [token, userId]);

  const handleGenerateEmail = async () => {
    if (!formData.leadId) {
      setError('Please select a lead');
      return;
    }
    if (!formData.description) {
      setError('Please provide an email description');
      return;
    }
    try {
      const selectedLeadEmail = leads.find((lead) => lead._id === formData.leadId)?.email || '';
      const response = await axios.post(
        `http://localhost:5001/api/email-generator/generate`,
        {
          description: formData.description,
          leadEmail: selectedLeadEmail,
          category: formData.category,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setGeneratedEmail(response.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate email');
    }
  };

  const handleSaveCampaign = async () => {
    if (!formData.leadId) {
      setError('Please select a lead');
      return;
    }
    if (!formData.sentAt) {
      setError('Please select a date and time');
      return;
    }
    if (!generatedEmail.subject || !generatedEmail.body) {
      setError('Please generate an email first');
      return;
    }
    try {
      const response = await axios.post(
        `http://localhost:5001/api/email-campaigns/${formData.leadId}`,
        {
          category: formData.category,
          content: `Subject: ${generatedEmail.subject}\n\n${generatedEmail.body}`,
          sentBy: userId,
          sentAt: formData.sentAt,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setLeads(leads.map((lead) => (lead._id === formData.leadId ? response.data.lead : lead)));
      setFormData({ leadId: leads[0]?._id || '', description: '', category: 'Promotional', sentAt: '' });
      setGeneratedEmail({ subject: '', body: '' });
      setError('');
      alert('Email campaign saved');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save email campaign');
    }
  };

  const openHistoryModal = (lead, category) => {
    setSelectedLead(lead);
    setModalCategory(category);
    setShowModal(true);
  };

  const selectedLeadEmail = leads.find((lead) => lead._id === formData.leadId)?.email || '';

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-3xl font-bold mb-4">Email Generator (User)</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {leads.length === 0 && <p className="text-gray-500 mb-4">No assigned leads available.</p>}
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Generate Email</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <select
            value={formData.leadId}
            onChange={(e) => setFormData({ ...formData, leadId: e.target.value })}
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
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="p-2 border rounded-lg"
          >
            <option value="Promotional">Promotional</option>
            <option value="Follow-up">Follow-up</option>
            <option value="Newsletter">Newsletter</option>
          </select>
          <input
            type="datetime-local"
            value={formData.sentAt}
            onChange={(e) => setFormData({ ...formData, sentAt: e.target.value })}
            className="p-2 border rounded-lg"
          />
          <textarea
            placeholder="Describe how you want the email to be crafted (e.g., tone, key points, call-to-action)"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="p-2 border rounded-lg col-span-2"
            rows="4"
          />
          <button
            onClick={handleGenerateEmail}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition col-span-2"
            disabled={leads.length === 0 || !formData.description}
          >
            Generate Email
          </button>
        </div>
      </div>
      {generatedEmail.subject && generatedEmail.body && (
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2">Generated Email Preview</h3>
          <div className="p-4 border rounded-lg bg-gray-50">
            <p className="font-semibold">Subject: {generatedEmail.subject}</p>
            <p className="mt-2 whitespace-pre-wrap">{generatedEmail.body}</p>
            <button
              onClick={handleSaveCampaign}
              className="mt-4 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
            >
              Save as Campaign
            </button>
          </div>
        </div>
      )}
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
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="p-3 text-center text-gray-500">
                    No email campaigns found for this lead.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
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

export default UserEmailGenerator;