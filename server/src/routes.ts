import express, { request, response } from "express";
import PointsController from "./controllers/PointsControllers";
import ItemsController from "./controllers/ItemsController";

//index, show, create, update, delete

const routes = express.Router();
const pointController = new PointsController();
const itemController = new ItemsController();

routes.get("/items", itemController.index);

routes.post("/points", pointController.create);
routes.get("/points", pointController.index);

routes.get("/points/:id", pointController.show);

export default routes;
