import dotenv from "dotenv";
import mongooes from "mongoose";

dotenv.config();


mongooes.connect(
    process.env.PRODUCTION ? process.env.MONGO_URL_PROD : process.env.MONGO_URL,
    {
        useNewUrlParser: true,
        useFindAndModify: false,
        useUnifiedTopology: true
    }
);

const db = mongooes.connection;

const handleOpen = () => console.log("**Connected to DB**");
const handleError = () => console.log(`**Error on DB Connection`);
db.once("open", handleOpen);
db.on("error", handleError);
