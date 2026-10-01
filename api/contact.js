const nodemailer = require('nodemailer');

module.exports = async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ success: false, message: 'Method not allowed' });

  const { name, email, company, jobTitle, message } = req.body || {};

  if (!name || !email || !company) {
    return res.status(400).json({ success: false, message: 'Name, email, and company are required.' });
  }

  if (!process.env.SMTP_HOST || !process.env.SMTP_USER) {
    console.error('SMTP not configured — missing SMTP_HOST or SMTP_USER');
    return res.status(500).json({ success: false, message: 'Mail service not configured.' });
  }

  const htmlBody = `
    <div style="font-family:'Segoe UI',Arial,sans-serif;max-width:600px;margin:0 auto;">
      <div style="background:#0b1324;color:#f5f8ff;padding:24px 32px;border-radius:12px 12px 0 0;">
        <h2 style="margin:0;color:#5aa4ff;">New FinOps + AI Consultation Request</h2>
      </div>
      <div style="background:#12203a;color:#bfd0eb;padding:28px 32px;border-radius:0 0 12px 12px;">
        <table style="width:100%;border-collapse:collapse;font-size:15px;">
          <tr><td style="padding:10px 0;color:#8fa3c1;width:140px;">Name</td><td style="padding:10px 0;color:#f5f8ff;font-weight:600;">${esc(name)}</td></tr>
          <tr><td style="padding:10px 0;color:#8fa3c1;">Work Email</td><td style="padding:10px 0;color:#f5f8ff;font-weight:600;"><a href="mailto:${esc(email)}" style="color:#5aa4ff;">${esc(email)}</a></td></tr>
          <tr><td style="padding:10px 0;color:#8fa3c1;">Company</td><td style="padding:10px 0;color:#f5f8ff;font-weight:600;">${esc(company)}</td></tr>
          ${jobTitle ? `<tr><td style="padding:10px 0;color:#8fa3c1;">Job Title</td><td style="padding:10px 0;color:#f5f8ff;font-weight:600;">${esc(jobTitle)}</td></tr>` : ''}
        </table>
        ${message ? `
          <div style="margin-top:18px;padding-top:18px;border-top:1px solid rgba(255,255,255,0.1);">
            <p style="margin:0 0 8px;color:#8fa3c1;font-size:13px;text-transform:uppercase;letter-spacing:0.1em;">AI Cost Management Needs</p>
            <p style="margin:0;color:#f5f8ff;line-height:1.7;">${esc(message)}</p>
          </div>
        ` : ''}
        <div style="margin-top:24px;padding-top:18px;border-top:1px solid rgba(255,255,255,0.1);">
          <p style="margin:0;font-size:12px;color:#8fa3c1;">Sent from <a href="https://datahub-landing.vercel.app" style="color:#5aa4ff;">DataHub FinOps + AI Landing Page</a></p>
        </div>
      </div>
    </div>
  `;

  const textBody = [
    'New FinOps + AI Consultation Request',
    '─────────────────────────────────────',
    '',
    `Name: ${name}`,
    `Work Email: ${email}`,
    `Company: ${company}`,
    jobTitle ? `Job Title: ${jobTitle}` : null,
    '',
    message ? `AI Cost Management Needs:\n${message}` : null,
    '',
    '─────────────────────────────────────',
    'Sent from DataHub FinOps + AI Landing Page',
    'https://datahub-landing.vercel.app'
  ].filter(Boolean).join('\n');

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: `"DataHub FinOps + AI" <${process.env.SMTP_USER}@gmail.com>`,
      to: process.env.CONTACT_EMAIL || 'jmcdonough@datahubusa.com',
      replyTo: email,
      subject: `FinOps + AI consultation: ${name} at ${company}`,
      text: textBody,
      html: htmlBody,
    });

    return res.status(200).json({ success: true, message: 'Email sent successfully.' });
  } catch (err) {
    console.error('SMTP send error:', err.message);
    return res.status(500).json({ success: false, message: 'Unable to send email. Please try again or email jmcdonough@datahubusa.com directly.' });
  }
};

function esc(str) {
  if (!str) return '';
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
