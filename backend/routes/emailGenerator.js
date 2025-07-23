const express = require('express');
const axios = require('axios');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

// Generate email content using xAI API
router.post('/generate', authMiddleware, async (req, res) => {
  try {
    const { description, leadEmail, category } = req.body;

    if (!description || !leadEmail || !category) {
      return res.status(400).json({ message: 'Description, lead email, and category are required' });
    }

    const prompt = `Generate a professional email for a CRM system with the following details:
    - Recipient: ${leadEmail}
    - Category: ${category} (e.g., Promotional, Follow-up, Newsletter)
    - Description: ${description}
    Ensure the email is concise, professional, and tailored to the education sector (e.g., addressing a school). Include a subject line and body with a clear call-to-action. Return the response in JSON format with fields: { subject: string, body: string }`;

    const response = await axios.post(
      'https://api.x.ai/v1/chat/completions',
      {
        model: 'grok-3',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 500,
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.XAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const generatedContent = response.data.choices[0].message.content;
    let parsedContent;
    try {
      parsedContent = JSON.parse(generatedContent);
    } catch (error) {
      return res.status(500).json({ message: 'Failed to parse AI-generated content', error: error.message });
    }

    if (!parsedContent.subject || !parsedContent.body) {
      return res.status(500).json({ message: 'Invalid AI-generated content format' });
    }

    res.json({ subject: parsedContent.subject, body: parsedContent.body });
  } catch (error) {
    res.status(500).json({ message: 'Error generating email content', error: error.message });
  }
});

module.exports = router;