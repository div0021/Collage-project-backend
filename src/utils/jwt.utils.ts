import jwt from "jsonwebtoken";
import config from "config"

const privateKey = config.get<string>("privateKey")
const publicKey = config.get<string>("publicKey");

export function signJwt(object:object,options?:jwt.SignOptions | undefined) {

    return jwt.sign(object,privateKey,{
        ...options,
        algorithm:"RS256"
    })
}

export function verfiyJwt(token:string){
    try{
        const decoded = jwt.verify(token,publicKey)

        return {
            valid:true,
            expired:false,
            decoded
        }
    }catch(e){
        if  (e instanceof jwt.JsonWebTokenError){
        return {
            valid:false,
            expired:e.message === "jwt expired",
            decoded:null
        }
    }else{
        return {
            valid:false,
            decoded:null
        }
    }
    }
}