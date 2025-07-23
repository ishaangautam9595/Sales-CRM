const express = require('express');
const Lead = require('../models/Lead');
const authMiddleware = require('../middleware/auth');
const adminMiddleware = require('../middleware/admin');
const router = express.Router();

// Add Email Campaign
router.post('/:leadId', authMiddleware, async (req, res) => {
  const { category, content, sentBy, sentAt } = req.body;
  try {
    const lead = await Lead.findById(req.params.leadId);
    if (!lead) return res.status(404).json({ message: 'Lead not found' });

    // Users can only set sentBy to themselves
    if (req.user.role !== 'admin' && sentBy !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized to set sentBy to another user' });
    }

    // Validate sentAt if provided
    const sentAtDate = sentAt ? new Date(sentAt) : new Date();
    if (sentAt && isNaN(sentAtDate.getTime())) {
      return res.status(400).json({ message: 'Invalid sentAt date' });
    }

    lead.emailCampaigns.push({
      category,
      content,
      sentBy: sentBy || req.user.id,
      sentAt: sentAtDate,
    });
    await lead.save();
    res.json({ message: 'Email campaign added', lead });
  } catch (error) {
    res.status(500).json({ message: 'Error adding email campaign', error: error.message });
  }
});

// Update Email Campaign
router.put('/:leadId/:campaignId', authMiddleware, async (req, res) => {
  const { category, content, sentBy, sentAt } = req.body;
  try {
    const lead = await Lead.findById(req.params.leadId);
    if (!lead) return res.status(404).json({ message: 'Lead not found' });

    const campaign = lead.emailCampaigns.id(req.params.campaignId);
    if (!campaign) return res.status(404).json({ message: 'Campaign not found' });

    // Users can only edit campaigns they sent
    if (req.user.role !== 'admin' && campaign.sentBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized to edit this campaign' });
    }

    // Users can only set sentBy to themselves
    if (req.user.role !== 'admin' && sentBy !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized to set sentBy to another user' });
    }

    // Validate sentAt if provided
    const sentAtDate = sentAt ? new Date(sentAt) : campaign.sentAt;
    if (sentAt && isNaN(sentAtDate.getTime())) {
      return res.status(400).json({ message: 'Invalid sentAt date' });
    }

    campaign.category = category || campaign.category;
    campaign.content = content || campaign.content;
    campaign.sentBy = sentBy || campaign.sentBy;
    campaign.sentAt = sentAtDate;
    await lead.save();
    res.json({ message: 'Email campaign updated', lead });
  } catch (error) {
    res.status(500).json({ message: 'Error updating email campaign', error: error.message });
  }
});

// Delete Email Campaign (Admin only)
router.delete('/:leadId/:campaignId', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.leadId);
    if (!lead) return res.status(404).json({ message: 'Lead not found' });

    const campaign = lead.emailCampaigns.id(req.params.campaignId);
    if (!campaign) return res.status(404).json({ message: 'Campaign not found' });

    campaign.remove();
    await lead.save();
    res.json({ message: 'Email campaign deleted', lead });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting email campaign', error: error.message });
  }
});

module.exports = router;