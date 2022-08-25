const nodemailer = require('nodemailer');

const sendEmail = async options=>{
    const transport = nodemailer.createTransport({
// putt all these properties in env.
        host: "smtp.mailtrap.io",
        port: 2525,
        auth: {
          user: "93d4b68a16b929",
          pass: "7e57ac37b94fe1"
        }
      });

      const messages ={
          from:"E-Commerce <ecomm@gmail.com>",
          to: options.email,
          subject: options.subject,
          text: options.message
      }

      await transport.sendMail(messages);
}
module.exports =sendEmail;