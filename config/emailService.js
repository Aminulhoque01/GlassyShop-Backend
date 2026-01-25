import nodemailer from "nodemailer";

 

const transporter= nodemailer.createTransport({
    host:'smtp.gmail.com',
    port:465,
    secure:true,
    auth:{
        user:process.env.Email,
        pass:process.env.Email_pass,
    }
});

async function sendEmail(to, subject,text, html){
    try {
        const info= await transporter.sendEmail({
            from:process.env.Email,
            to,
            subject,
            text,
            html,
        });
        return{success:true, messageId:info.messageId}
    } catch (error) {
        console.error('Error sending email', error);
        return {success:false, error:error.message}
    }
}

export  {sendEmail};