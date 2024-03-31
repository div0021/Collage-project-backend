import crypto from "crypto"

export function randomstring(length:number){

    const randomBytes = crypto.randomBytes(length)

    return randomBytes.toString('hex').substring(0,6)

}
