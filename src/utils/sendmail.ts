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
        defaultLayout:path.resolve(__dirname,"..",'email-templates','otp')
    },
    viewPath:path.resolve(__dirname,'..','email-templates'),
    extName:'.handlebars',
}

transporter.use('compile', hbs(handlebarOptions));

export const  sendEmail = async (receiverMailId: string ,template:string,subject:string,context:object) =>{

    const mailOptions = {
        from:"thakurdivyanshusingh600@gmail.com",
        to:receiverMailId,
        subject:subject,
        template:template,
        context:context
    }
        const mailInfo = await transporter.sendMail(mailOptions)

        return mailInfo;

}
