import express, { request, response } from "express";
import { celebrate, Joi } from "celebrate";

import PointsController from "./controllers/PointsControllers";
import ItemsController from "./controllers/ItemsController";
import multer from "multer";
import multerConfig from "./config/multer";
//index, show, create, update, delete

const routes = express.Router();
const upload = multer(multerConfig);

const pointController = new PointsController();
const itemController = new ItemsController();

routes.get("/items", itemController.index);

routes.post(
  "/points",
  upload.single("image"),
  celebrate(
    {
      body: Joi.object().keys({
        name: Joi.string().required(),
        email: Joi.string().required().email(),
        whatsapp: Joi.number().required(),
        latitude: Joi.number().required(),
        longitude: Joi.number().required(),
        city: Joi.string().required(),
        uf: Joi.string().required(),
        items: Joi.string().required(),
      }),
    },
    {
      abortEarly: false,
    }
  ),
  pointController.create
);
routes.get("/points", pointController.index);

routes.get("/points/:id", pointController.show);

export default routes;
