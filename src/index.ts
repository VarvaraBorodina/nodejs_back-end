import express, {Express} from "express";
import router from "./routes";
import morgan from "morgan";
import cookies from "cookie-parser";
import upload from "./upload/upload";

const app: Express = express();
const port: number = Number(process.env.PORT || 5000); 

app.use(morgan("dev"));
app.use(express.json());
app.use(cookies());

app.use(router);


app.listen(port, '0.0.0.0',() => {
    console.log(`on port ${port}!`)
 })

