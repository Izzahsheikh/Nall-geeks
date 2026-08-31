import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
import express from 'express';
import { Resend } from 'resend';

const app = express();
const PORT = 5000;

app.use(express.json());

const resend = new Resend(process.env.RESEND_API_KEY);

app.post('/api/contact', async (req, res) => {
  const { firstName, lastName, phone, email, company, message } = req.body || {};

  if (!firstName || !lastName || !email) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    await resend.emails.send({
      from: 'NallGeeks Website <onboarding@resend.dev>',
      to: 'contact@nallgeeks.com',
      replyTo: email,
      subject: `New inquiry from ${firstName} ${lastName}`,
      text: [
        `Name: ${firstName} ${lastName}`,
        `Email: ${email}`,
        `Phone: ${phone || '—'}`,
        `Company: ${company || '—'}`,
        '',
        'Message:',
        message || '—',
      ].join('\n'),
    });

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Resend error:', err);
    return res.status(500).json({ error: 'Failed to send email' });
  }
});

app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
});