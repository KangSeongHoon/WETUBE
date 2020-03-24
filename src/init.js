import "@babel/polyfill";
import dotenv from "dotenv";
import app from "./app";
import "./db";
dotenv.config();
import "./app";
import "./passport"
import "./models/Video";
import "./models/Comment";
import "./models/User";



const PORT = process.env.PORT;




const handleListening = () => {
  console.log(`Listening on: http://localhost:${PORT}`);
  console.log(process.env.FB_CALLBACK);

}

app.listen(PORT, handleListening);


