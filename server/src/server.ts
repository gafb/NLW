import express, { request, response } from "express";
import cors from "cors";
import routes from "./routes";
import path from "path";
const app = express();

app.use(cors());
app.use(express.json());
app.use(routes);

app.use("/uploads", express.static(path.resolve(__dirname, "..", "uploads")));
// Request Params
// Query Params
// Request Body

app.listen(3333);
