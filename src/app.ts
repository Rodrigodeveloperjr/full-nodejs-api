import { handleErrorMiddleware } from "./middlewares/handleError.middleware";
import { appRoutes } from "./routes";
import express from "express";
import "express-async-errors";
import "dotenv/config";

const app = express();
app.use(express.json());

appRoutes(app);

app.use(handleErrorMiddleware);

export { app };
