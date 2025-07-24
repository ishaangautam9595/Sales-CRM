const express = require('express');
const Lead = require('../models/Lead');
const authMiddleware = require('../middleware/auth');
const adminMiddleware = require('../middleware/admin');
const User = require('../models/User');
const router = express.Router();

// Create Lead (Admin only)
router.post('/', authMiddleware, adminMiddleware, async (req, res) => {
  const { schoolName, email, address, phoneNumber, progressStatus, assignedTo } = req.body;
  try {
    const lead = new Lead({ schoolName, email, address, phoneNumber, progressStatus, assignedTo });
    await lead.save();
    res.json({ message: 'Lead created', lead });
  } catch (error) {
    res.status(500).json({ message: 'Error creating lead', error: error.message });
  }
});

// Get All Leads (Admin and User)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const leads = await Lead.find()
      .populate('assignedTo', 'username')
      .populate('emailCampaigns.sentBy', 'username')
      .populate('statusHistory.assignedTo', 'username');
    res.json(leads);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching leads', error: error.message });
  }
});

// Update Lead (Admin and User)
router.put('/:id', authMiddleware, async (req, res) => {
  const { schoolName, email, address, phoneNumber, progressStatus, assignedTo } = req.body;
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ message: 'Lead not found' });

    // Users can only update leads assigned to them
    if (req.user.role !== 'admin' && lead.assignedTo?.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized to update this lead' });
    }

    // Log changes to statusHistory
    const changes = [];
    if (schoolName && schoolName !== lead.schoolName) {
      changes.push({ 
        status: progressStatus || lead.progressStatus, 
        assignedTo: assignedTo || lead.assignedTo, 
        description: `School name changed from "${lead.schoolName}" to "${schoolName}"`,
        updatedAt: new Date()
      });
    }
    if (email && email !== lead.email) {
      changes.push({ 
        status: progressStatus || lead.progressStatus, 
        assignedTo: assignedTo || lead.assignedTo, 
        description: `Email changed from "${lead.email}" to "${email}"`,
        updatedAt: new Date()
      });
    }
    if (address && address !== lead.address) {
      changes.push({ 
        status: progressStatus || lead.progressStatus, 
        assignedTo: assignedTo || lead.assignedTo, 
        description: `Address changed from "${lead.address}" to "${address}"`,
        updatedAt: new Date()
      });
    }
    if (phoneNumber && phoneNumber !== lead.phoneNumber) {
      changes.push({ 
        status: progressStatus || lead.progressStatus, 
        assignedTo: assignedTo || lead.assignedTo, 
        description: `Phone number changed from "${lead.phoneNumber}" to "${phoneNumber}"`,
        updatedAt: new Date()
      });
    }
    if (progressStatus && progressStatus !== lead.progressStatus) {
      changes.push({ 
        status: progressStatus, 
        assignedTo: assignedTo || lead.assignedTo, 
        description: `Progress status changed from "${lead.progressStatus || 'N/A'}" to "${progressStatus}"`,
        updatedAt: new Date()
      });
    }
    if (assignedTo && assignedTo !== lead.assignedTo?.toString()) {
      changes.push({ 
        status: progressStatus || lead.progressStatus, 
        assignedTo: assignedTo, 
        description: `Assigned to changed from "${lead.assignedTo?.toString() || 'Unassigned'}" to "${assignedTo}"`,
        updatedAt: new Date()
      });
    }

    lead.schoolName = schoolName || lead.schoolName;
    lead.email = email || lead.email;
    lead.address = address || lead.address;
    lead.phoneNumber = phoneNumber || lead.phoneNumber;
    lead.progressStatus = progressStatus || lead.progressStatus;
    lead.assignedTo = assignedTo || lead.assignedTo;
    if (changes.length > 0) {
      lead.statusHistory.push(...changes);
    }
    await lead.save();
    res.json({ message: 'Lead updated', lead });
  } catch (error) {
    res.status(500).json({ message: 'Error updating lead', error: error.message });
  }
});

// Delete Lead (Admin only)
router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    await Lead.findByIdAndDelete(req.params.id);
    res.json({ message: 'Lead deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting lead', error: error.message });
  }
});

// Get leads assigned to a specific user
router.get('/assigned/:userId', authMiddleware, async (req, res) => {
  try {
    const { userId } = req.params;

    // Validate userId
    if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: 'Invalid user ID format' });
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Restrict access: Users can only access their own leads; Admins can access any
    if (req.user.role !== 'admin' && req.user.id !== userId) {
      return res.status(403).json({ message: 'Unauthorized to access this user’s leads' });
    }

    // Fetch leads assigned to userId
    const leads = await Lead.find({ assignedTo: userId })
      .populate('assignedTo', 'username')
      .populate('emailCampaigns.sentBy', 'username')
      .populate('statusHistory.assignedTo', 'username')
      .lean();

    res.json(leads.length ? leads : []);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching assigned leads', error: error.message });
  }
});

// Update a specific statusHistory entry's description
router.put('/:leadId/history/:historyId', authMiddleware, async (req, res) => {
  const { leadId, historyId } = req.params;
  const { description } = req.body;
  try {
    const lead = await Lead.findById(leadId);
    if (!lead) return res.status(404).json({ message: 'Lead not found' });

    const history = lead.statusHistory.id(historyId);
    if (!history) return res.status(404).json({ message: 'History entry not found' });

    // Optionally: Only allow assigned user or admin to edit
    if (req.user.role !== 'admin' && lead.assignedTo?.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    history.description = description;
    await lead.save();

    res.json({ message: 'History description updated', lead });
  } catch (error) {
    res.status(500).json({ message: 'Error updating history description', error: error.message });
  }
});

module.exports = router;