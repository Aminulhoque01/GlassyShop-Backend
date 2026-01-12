import { sendEmail } from "./emailService";



const sendEmailFun = async(to, subject,text,html)=>{
    const result= await sendEmailFun(to,subject,text,html);
    if(result.success){
        return true;
    }
    else{
        return false;
    }
};

export default sendEmailFun;