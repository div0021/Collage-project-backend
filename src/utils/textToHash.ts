import bcrypt from "bcrypt"
import config from "config"

export const textToHash =async  (text:string) => {
    const salt = await bcrypt.genSalt(config.get<number>('saltWorkFactor'));

    return await bcrypt.hash(text,salt);
}