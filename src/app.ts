import "dotenv/config"
import express, { NextFunction, Request, Response } from "express"
import logger from "./utils/logger"
import routes from "./routes"
import deserializeUser from "./middleware/deserializeUser"
import cors from "cors"
import config from "config"
import cookieParser from "cookie-parser"

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended:false}));

app.use(cookieParser())

app.use(cors({
    origin:config.get<string>('origin'),
    credentials:true
}))
app.use(deserializeUser)

routes(app)

app.use((req,res,next)=> {
    next(Error("Endpoint not found"))
})


// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((error:unknown,req:Request,res:Response,next:NextFunction) => {
    logger.error(error)
    let errorMessage = "An unknown error occured.";
    if(error instanceof Error) errorMessage = error.message;
    res.status(500).json({error:errorMessage})
})

export default app;