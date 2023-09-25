import sgMail from '@sendgrid/mail';

type msg = {
    to: string,
    from: string,
    subject: string,
    text: string,
    html?: string
}

class SendGrid {
    private apiKey: string | undefined;

    constructor() {
        this.apiKey = process.env.SENDGRID_API_KEY;
        if (!this.apiKey) throw new Error('Missing process.env.SENDGRID_API_KEY')

        sgMail.setApiKey(this.apiKey);
    }

    async sendEmail(msg: msg) {
        try {
            await sgMail.send(msg);
            console.log('Email sent successfully to ' + msg.to);
        } catch (error) {
            console.error(error);
        }
    }
}

export default SendGrid;