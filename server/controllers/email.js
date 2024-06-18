import nodemailer from 'nodemailer';
import crypto from 'crypto';
import 'dotenv/config';


const transporter = nodemailer.createTransport({
  host: process.env.HOST_MAIL, // Corregido el host para usar Gmail SMTP
  port: process.env.PORT_MAIL, // Puerto SMTP
  secure: false, // true para 465, false para otros puertos
  auth: {
    user: process.env.USER_MAIL, // Reemplaza con tu correo electrónico
    pass: process.env.PASS_MAIL // Reemplaza con tu contraseña
  }
});

async function sendConfirmationEmail(userEmail, confirmationToken) {
    const mailOptions = {
      from: 'Nexus TCG <alexzv8@gmail.com>', // Reemplaza con tu nombre y correo
      to: userEmail,
      subject: 'Confirma tu cuenta',
      html: `
        <p>Hola ${userEmail},</p>
        <p>Gracias por registrarte en nuestra aplicación.</p>
        <p>Para confirmar tu cuenta, haz clic en el siguiente enlace:</p>
        <a href="http://alexfullstack.net/api/verify/${confirmationToken}">Confirmar cuenta</a>
        <p>Atentamente,</p>
        <p>El equipo de Nexus TCG</p>
      `
    };
  
    try {
      await transporter.sendMail(mailOptions);
      console.log('Correo electrónico de confirmación enviado a:', userEmail);
    } catch (error) {
      console.error('Error al enviar correo electrónico de confirmación:', error);
    }
}


const methods = {
    sendConfirmationEmail
};

export { methods };
