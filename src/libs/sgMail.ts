import sgMail from '@sendgrid/mail'
const key = process.env.SENDGRID_API_KEY
if (!key) throw new Error('Missing process.env.SENDGRID_API_KEY')

sgMail.setApiKey(key)
export default sgMail