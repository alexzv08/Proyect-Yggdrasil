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
      from: 'Nexus <alexzv8@gmail.com>', // Reemplaza con tu nombre y correo
      to: userEmail,
      subject: 'Confirma tu cuenta',
      html: `
        <p>Hola ${userEmail},</p>
        <p>Gracias por registrarte en nuestra aplicación.</p>
        <p>Para confirmar tu cuenta, haz clic en el siguiente enlace:</p>
        <a href="http://localhost:80/api/verify/${confirmationToken}">Confirmar cuenta</a>
        <p>Este enlace solo es válido durante 24 horas.</p>
        <p>Atentamente,</p>
        <p>El equipo de Nexus</p>
      `
    };
  
    try {
      await transporter.sendMail(mailOptions);
      console.log('Correo electrónico de confirmación enviado a:', userEmail);
    } catch (error) {
      console.error('Error al enviar correo electrónico de confirmación:', error);
    }
}

async function token(userEmail, confirmationToken) {

    const res = await fetch(`http://localhost:80/api/register`,{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body: JSON.stringify({
                email: userEmail,
                token: confirmationToken
            })
        })
}

// // FALTA HACER QUE LA CUENTA ESTE VERIFICADA, AÑADIR NUEVO CAMPO EN LA BBDD DOND EINDIQUE QUE A VERIFICADO
// const { v4: uuidv4 } = require('uuid'); // Importar la biblioteca UUID
// const { sendConfirmationEmail } = require('./email'); // Importar la función de envío de correo electrónico

// // ... (En el código de registro de usuario)

// const confirmationToken = uuidv4(); // Generar token de confirmación
// await sendConfirmationEmail(userEmail, confirmationToken); // Enviar correo electrónico de confirmación
// await User.findOneAndUpdate({ email: userEmail }, { verified: true }); // Marcar la cuenta como verificada



const methods = {
    sendConfirmationEmail
};

export { methods };
