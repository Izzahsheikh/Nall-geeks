import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { firstName, lastName, phone, email, services, message } = req.body || {};

  if (!firstName || !lastName || !email) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const cleanServices = Array.isArray(services)
    ? services.filter((s) => typeof s === 'string' && s.trim()).map((s) => s.trim().slice(0, 100)).slice(0, 20)
    : [];

  if (cleanServices.length === 0) {
    return res.status(400).json({ error: 'Select at least one service' });
  }

  try {
    await resend.emails.send({
      from: 'NallGeeks Website <onboarding@resend.dev>', // swap once your domain is verified in Resend
      to: 'contact@nallgeeks.com', // where you want to receive leads
      replyTo: email,
      subject: `New inquiry from ${firstName} ${lastName}`,
      text: [
        `Name: ${firstName} ${lastName}`,
        `Email: ${email}`,
        `Phone: ${phone || '—'}`,
        `Services: ${cleanServices.join(', ')}`,
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
}
