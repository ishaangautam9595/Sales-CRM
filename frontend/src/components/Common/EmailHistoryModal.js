import React from 'react';

function EmailHistoryModal({ lead, category, onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-3/4 max-w-2xl">
        <h2 className="text-2xl font-bold mb-4">Email History for {lead.schoolName} - {category}</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 text-left">Content</th>
              <th className="p-3 text-left">Sent By</th>
              <th className="p-3 text-left">Sent At</th>
            </tr>
          </thead>
          <tbody>
            {lead.emailCampaigns
              .filter((campaign) => campaign.category === category)
              .map((campaign) => (
                <tr key={campaign._id} className="border-b">
                  <td className="p-3">{campaign.content}</td>
                  <td className="p-3">{campaign.sentBy?.username || 'Unknown'}</td>
                  <td className="p-3">{new Date(campaign.sentAt).toLocaleString()}</td>
                </tr>
              ))}
          </tbody>
        </table>
        <button
          onClick={onClose}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
        >
          Close
        </button>
      </div>
    </div>
  );
}

export default EmailHistoryModal;