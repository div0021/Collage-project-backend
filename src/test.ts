import bcrypt from "bcrypt"
import { textToHash } from "./utils/textToHash";

const secret = "98ce6a2c-4e08-47a3-b401-8ae37ad9f1e5";

const test = async ()=> {

const salt = await bcrypt.genSalt(10);

const hash = await bcrypt.hash(secret,salt);

console.log("hash is ",hash);

// const hash2 = await bcrypt.hash(secret,salt);

const hash2 = await textToHash(secret)

console.log("hash is ",hash2);

console.log(hash===hash2);

}
test()