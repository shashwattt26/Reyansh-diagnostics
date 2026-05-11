const { Resend } = require('resend');

// Initialize Resend with your API Key
const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async (options) => {
  try {
    const data = await resend.emails.send({
      // ⚠️ NOTE: While on the free tier without a custom domain, 
      // you MUST use this exact 'onboarding' email address as the sender.
      from: 'Reyansh Diagnostics <admin@reyanshdiagnostics.com>', 
      to: options.email,
      subject: options.subject,
      text: options.message,
    });

    console.log('Email successfully sent via Resend:', data);
    return data;

  } catch (error) {
    console.error('Failed to send email via Resend:', error);
    throw new Error('Email could not be sent');
  }
};

module.exports = sendEmail;