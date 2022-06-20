const sgMail = require("@sendgrid/mail");

require("dotenv").config();

const orderConfirmed = (orderInfo) => {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY)
    const msg = {
        to: `${orderInfo.email}`, // Change to your recipient
        from: `erik.lagergren@hotmail.se`, // Change to your verified sender
        subject: 'Order Confirmed',
        text: 'Your order has been confirmed',
        html: `<h1 style="color: red; text-transform: uppercase">Hi ${orderInfo.firstname}! your order has been confirmed</h1>
        </br>
        <p>Thank you for supporting us</p>
        <p>Keep moving forward<p>`,
    }
    sgMail
        .send(msg)
        .then(() => {
            console.log('Email sent')
        })
        .catch((e) => {
            console.error(e)
        })
};

module.exports = orderConfirmed