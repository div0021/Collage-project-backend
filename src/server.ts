import app from "./app"
import config from "config"
import { db } from "./utils/db";
import logger from "./utils/logger";

const PORT = config.get<number>('port')



app.listen(PORT,async()=>{
        logger.info(`Server is running at ${PORT}`)

        await db();
    })
