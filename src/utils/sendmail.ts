import nodemailer from "nodemailer"
import hbs, { NodemailerExpressHandlebarsOptions } from "nodemailer-express-handlebars"
import dotenv from "dotenv"
import path from "path"
dotenv.config()

const password = process.env.NODEMAILER_APP_PASSWORD

const transporter = nodemailer.createTransport({
    service:'gmail',
    auth:{
        user:'thakurdivyanshusingh600@gmail.com',
        pass:password,
    }
});

const handlebarOptions:NodemailerExpressHandlebarsOptions = {
    viewEngine:{
        extname:".handlebars",
        partialsDir:path.resolve(__dirname,'..', 'email-templates'),
        defaultLayout:false
    },
    viewPath:path.resolve(__dirname,'..','email-templates'),
    extName:'.handlebars',
}

transporter.use('compile', hbs(handlebarOptions));

export const  sendEmailVerificationEmail = async (receiverMailId: string ,link:string) =>{

    const mailOptions = {
        from:"thakurdivyanshusingh600@gmail.com",
        to:receiverMailId,
        subject:"Email Verification",
        template:'email',
        context:{link}
    }
        const mailInfo = await transporter.sendMail(mailOptions)

        return mailInfo;

}
export const  sendOrderSuccessEmail = async (receiverMailId: string ,orderId:string) =>{

    const mailOptions = {
        from:"thakurdivyanshusingh600@gmail.com",
        to:receiverMailId,
        subject:"Order Sucess",
        template:'order',
        context:{orderId}
    }
        const mailInfo = await transporter.sendMail(mailOptions)

        return mailInfo;

}
export const  sendOTPVerificationEmail = async (receiverMailId: string ,otp:string) =>{

    const mailOptions = {
        from:"thakurdivyanshusingh600@gmail.com",
        to:receiverMailId,
        subject:"OTP Verification",
        template:'otp',
        context:{otp}
    }
        const mailInfo = await transporter.sendMail(mailOptions)

        return mailInfo;

}
