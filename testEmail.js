require('dotenv').config();
const sendEmail = require('./utils/sendEmail');

sendEmail('unknown84502@gmail.com', 'Test Email', '<h3>This is a test email</h3>')
  .then(() => console.log('✅ Email sent successfully'))
  .catch((err) => console.error('❌ Email sending failed:', err.message));
