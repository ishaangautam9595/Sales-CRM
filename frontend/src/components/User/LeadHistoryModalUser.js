import React, { useState } from 'react';

// function LeadHistoryModalUser({ lead, onClose, users, currentUserId, onUpdateLead }) {
//   const [editingHistoryId, setEditingHistoryId] = useState(null);
//   const [editedDescription, setEditedDescription] = useState('');
//   const [editedStatus, setEditedStatus] = useState('');

//   const LeadStatusOptions = [
//     { name: '1st Call', value: '1st Call' },
//     { name: 'Demo Done', value: 'Demo Done' },
//     { name: 'Credential Request', value: 'Credential Request' },
//     { name: 'Credential Sent', value: 'Credential Sent' },
//     { name: 'Pilot Done', value: 'Pilot Done' },
//     { name: 'School Onboarded', value: 'School Onboarded' },
//   ];

//   const getUsername = (assignedTo) => {
//   if (!assignedTo) return 'Unassigned';
//   if (typeof assignedTo === 'object' && assignedTo.username) return assignedTo.username;
//   const user = users.find((u) => u._id === assignedTo || u._id === assignedTo?._id);
//   return user ? user.username : 'Unknown';
// };

//   const startEditing = (history) => {
//     setEditingHistoryId(history._id);
//     setEditedDescription(history.description || '');
//     setEditedStatus(lead.progressStatus || '');
//   };

//   const saveChanges = (leadId, historyId) => {
//     if (!editedDescription.trim()) {
//       alert('Description cannot be empty');
//       return;
//     }
//     const updates = { description: editedDescription };
//     if (editedStatus && editedStatus !== lead.progressStatus) {
//       onUpdateLead(leadId, null, { progressStatus: editedStatus, description: editedDescription });
//     } else {
//       onUpdateLead(leadId, historyId, updates);
//     }
//     setEditingHistoryId(null);
//     setEditedDescription('');
//     setEditedStatus('');
//   };

//   const isEditable = lead.assignedTo?._id === currentUserId;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//       <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6">
//         <div className="flex justify-between items-center mb-4">
//           <h2 className="text-2xl font-bold">Lead History: {lead.schoolName}</h2>
//           <button
//             onClick={onClose}
//             className="text-gray-500 hover:text-gray-700 text-2xl"
//           >
//             ×
//           </button>
//         </div>
//         {lead.statusHistory.length === 0 ? (
//           <p className="text-gray-600">No history available for this lead.</p>
//         ) : (
//           <table className="w-full border-collapse">
//             <thead>
//               <tr className="bg-gray-100">
//                 <th className="p-3 text-left">Status</th>
//                 <th className="p-3 text-left">Assigned To</th>
//                 <th className="p-3 text-left">Description</th>
//                 <th className="p-3 text-left">Timestamp</th>
//                 <th className="p-3 text-left">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {lead.statusHistory.map((history) => (
//                 <tr key={history._id || history.updatedAt} className="border-b">
//                   <td className="p-3">{history.status || 'N/A'}</td>
//                   <td className="p-3">{getUsername(history.assignedTo) || 'Unassigned'}</td>
//                   <td className="p-3">
//                     {editingHistoryId === history._id && isEditable ? (
//                       <div className="flex flex-col space-y-2">
//                         <input
//                           type="text"
//                           value={editedDescription}
//                           onChange={(e) => setEditedDescription(e.target.value)}
//                           className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
//                           placeholder="Enter description"
//                         />
//                         <select
//                           value={editedStatus}
//                           onChange={(e) => setEditedStatus(e.target.value)}
//                           className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                         >
//                           <option value="">Select Status</option>
//                           {LeadStatusOptions.map((status) => (
//                             <option key={status.value} value={status.value}>
//                               {status.name}
//                             </option>
//                           ))}
//                         </select>
//                         <div className="flex space-x-2">
//                           <button
//                             onClick={() => saveChanges(lead._id, history._id)}
//                             className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 transition"
//                           >
//                             Save
//                           </button>
//                           <button
//                             onClick={() => {
//                               setEditingHistoryId(null);
//                               setEditedDescription('');
//                               setEditedStatus('');
//                             }}
//                             className="bg-gray-300 text-gray-700 px-3 py-1 rounded-lg hover:bg-gray-400 transition"
//                           >
//                             Cancel
//                           </button>
//                         </div>
//                       </div>
//                     ) : (
//                       <div className="flex items-center space-x-2">
//                         <span>{history.description || 'No description'}</span>
//                         {isEditable && (
//                           <button
//                             onClick={() => startEditing(history)}
//                             className="text-blue-500 hover:text-blue-700 text-sm"
//                           >
//                             Edit
//                           </button>
//                         )}
//                       </div>
//                     )}
//                   </td>
//                   <td className="p-3">{new Date(history.updatedAt).toLocaleString()}</td>
//                   <td className="p-3"><button>Edit</button></td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         )}
//         <div className="mt-6 flex justify-end">
//           <button
//             onClick={onClose}
//             className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
//           >
//             Close
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default LeadHistoryModalUser;


function LeadHistoryModalUser({ lead, onClose, users, currentUserId, onUpdateLead }) {
  const [editingHistoryId, setEditingHistoryId] = useState(null);
  const [editedDescription, setEditedDescription] = useState('');
  const [editedStatus, setEditedStatus] = useState('');

  const isEditable = lead.assignedTo?._id === currentUserId;

  const getUsername = (assignedTo) => {
    if (!assignedTo) return 'Unassigned';
    if (typeof assignedTo === 'object' && assignedTo.username) return assignedTo.username;
    const user = users.find((u) => u._id === assignedTo || u._id === assignedTo?._id);
    return user ? user.username : 'Unknown';
  };

  const startEditing = (history) => {
    setEditingHistoryId(history._id);
    setEditedDescription(history.description || '');
    setEditedStatus(history.status || '');
  };

  const saveChanges = (leadId, historyId) => {
    if (!editedDescription.trim()) {
      alert('Description cannot be empty');
      return;
    }
    const updates = { description: editedDescription };
    onUpdateLead(leadId, historyId, updates);
    setEditingHistoryId(null);
    setEditedDescription('');
    setEditedStatus('');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Lead History: {lead.schoolName}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>
        {lead.statusHistory.length === 0 ? (
          <p className="text-gray-600">No history available for this lead.</p>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Assigned To</th>
                <th className="p-3 text-left">Description</th>
                <th className="p-3 text-left">Timestamp</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {lead.statusHistory.map((history) => (
                <tr key={history._id || history.updatedAt} className="border-b">
                  <td className="p-3">{history.status || 'N/A'}</td>
                  <td className="p-3">{getUsername(history.assignedTo) || 'Unassigned'}</td>
                  <td className="p-3">
                    {editingHistoryId === history._id && isEditable ? (
                      <div className="flex flex-col space-y-2">
                        <input
                          type="text"
                          value={editedDescription}
                          onChange={(e) => setEditedDescription(e.target.value)}
                          className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                          placeholder="Enter description"
                        />
                        <div className="flex space-x-2 mt-2">
                          <button
                            onClick={() => saveChanges(lead._id, history._id)}
                            className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 transition"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => {
                              setEditingHistoryId(null);
                              setEditedDescription('');
                              setEditedStatus('');
                            }}
                            className="bg-gray-300 text-gray-700 px-3 py-1 rounded-lg hover:bg-gray-400 transition"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <span>{history.description || 'No description'}</span>
                        {isEditable && (
                          <button
                            onClick={() => startEditing(history)}
                            className="text-blue-500 hover:text-blue-700 text-sm"
                          >
                            Edit
                          </button>
                        )}
                      </div>
                    )}
                  </td>
                  <td className="p-3">{new Date(history.updatedAt).toLocaleString()}</td>
                  <td className="p-3"></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default LeadHistoryModalUser;