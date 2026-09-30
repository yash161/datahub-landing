const nodemailer = require('nodemailer');

module.exports = async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const { name, email, company, jobTitle, message } = req.body || {};

  if (!name || !email || !company) {
    return res.status(400).json({ success: false, message: 'Name, email, and company are required.' });
  }

  // Build the email
  const htmlBody = `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #0b1324; color: #f5f8ff; padding: 24px 32px; border-radius: 12px 12px 0 0;">
        <h2 style="margin: 0; color: #5aa4ff;">New FinOps + AI Consultation Request</h2>
      </div>
      <div style="background: #12203a; color: #bfd0eb; padding: 28px 32px; border-radius: 0 0 12px 12px;">
        <table style="width: 100%; border-collapse: collapse; font-size: 15px;">
          <tr><td style="padding: 10px 0; color: #8fa3c1; width: 140px;">Name</td><td style="padding: 10px 0; color: #f5f8ff; font-weight: 600;">${escapeHtml(name)}</td></tr>
          <tr><td style="padding: 10px 0; color: #8fa3c1;">Work Email</td><td style="padding: 10px 0; color: #f5f8ff; font-weight: 600;"><a href="mailto:${escapeHtml(email)}" style="color: #5aa4ff;">${escapeHtml(email)}</a></td></tr>
          <tr><td style="padding: 10px 0; color: #8fa3c1;">Company</td><td style="padding: 10px 0; color: #f5f8ff; font-weight: 600;">${escapeHtml(company)}</td></tr>
          ${jobTitle ? `<tr><td style="padding: 10px 0; color: #8fa3c1;">Job Title</td><td style="padding: 10px 0; color: #f5f8ff; font-weight: 600;">${escapeHtml(jobTitle)}</td></tr>` : ''}
        </table>
        ${message ? `
          <div style="margin-top: 18px; padding-top: 18px; border-top: 1px solid rgba(255,255,255,0.1);">
            <p style="margin: 0 0 8px; color: #8fa3c1; font-size: 13px; text-transform: uppercase; letter-spacing: 0.1em;">AI Cost Management Needs</p>
            <p style="margin: 0; color: #f5f8ff; line-height: 1.7;">${escapeHtml(message)}</p>
          </div>
        ` : ''}
        <div style="margin-top: 24px; padding-top: 18px; border-top: 1px solid rgba(255,255,255,0.1);">
          <p style="margin: 0; font-size: 12px; color: #8fa3c1;">Sent from <a href="https://datahub-landing.vercel.app" style="color: #5aa4ff;">DataHub FinOps + AI Landing Page</a></p>
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
    jobTitle ? `Job Title: ${jobTitle}` : '',
    '',
    message ? `AI Cost Management Needs:\n${message}` : '',
    '',
    '─────────────────────────────────────',
    'Sent from DataHub FinOps + AI Landing Page',
    'https://datahub-landing.vercel.app'
  ].filter(Boolean).join('\n');

  try {
    // Use direct MX delivery to Jim's mail server
    const transporter = nodemailer.createTransport({
      host: 'mx1.cloudaccess.net',
      port: 25,
      secure: false,
      tls: { rejectUnauthorized: false },
      connectionTimeout: 15000,
      greetingTimeout: 10000,
      socketTimeout: 15000,
    });

    await transporter.sendMail({
      from: '"DataHub FinOps + AI" <finops-ai@datahub-landing.vercel.app>',
      to: 'jmcdonough@datahubusa.com',
      replyTo: email,
      subject: `FinOps + AI consultation: ${name} at ${company}`,
      text: textBody,
      html: htmlBody,
    });

    return res.status(200).json({ success: true, message: 'Email sent successfully.' });
  } catch (err) {
    console.error('Email send error:', err);

    // Fallback: try MX2
    try {
      const fallback = nodemailer.createTransport({
        host: 'mx2.cloudaccess.net',
        port: 25,
        secure: false,
        tls: { rejectUnauthorized: false },
        connectionTimeout: 15000,
        greetingTimeout: 10000,
        socketTimeout: 15000,
      });

      await fallback.sendMail({
        from: '"DataHub FinOps + AI" <finops-ai@datahub-landing.vercel.app>',
        to: 'jmcdonough@datahubusa.com',
        replyTo: email,
        subject: `FinOps + AI consultation: ${name} at ${company}`,
        text: textBody,
        html: htmlBody,
      });

      return res.status(200).json({ success: true, message: 'Email sent successfully (fallback).' });
    } catch (err2) {
      console.error('Fallback email error:', err2);
      return res.status(500).json({ success: false, message: 'Unable to send email. Please email jmcdonough@datahubusa.com directly.' });
    }
  }
};

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
