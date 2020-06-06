import { Request, Response } from "express";
import knex from "../database/connection";

class PointsController {
  async index(request: Request, response: Response) {
    const { city, uf, items } = request.query;

    console.log(city, uf, items);
    const parsedItems = String(items)
      .split(",")
      .map((item) => Number(item.trim()));

    const points = await knex("points")
      .join("point_items", "points.id", "=", "point_items.point_id")
      .whereIn("point_items.item_id", parsedItems)
      .where("city", String(city))
      .where("uf", String(uf))
      .distinct()
      .select("points.*");

    const serializedPoints = points.map((point) => {
      //const tmp_url = "10.0.2.2:3333";

      return {
        ...point,

        image_url: `http://192.168.1.5:3333/uploads/${point.image}`,
      };
    });

    return response.json(serializedPoints);

    return response.json(points);
  }
  async create(request: Request, response: Response) {
    const {
      name,
      email,
      whatsapp,
      latitude,
      longitude,
      city,
      uf,
      items,
    } = request.body;
    const trx = await knex.transaction(); //if the first transaction doesn't work the others will not either
    const point = {
      image: request.file.filename,
      name,
      email,
      whatsapp,
      latitude,
      longitude,
      city,
      uf,
    };
    console.log(point);
    const insertedIds = await trx("points").insert(point);

    const point_id = insertedIds[0];
    console.log("Inserted Ids", point_id);

    const pointItems = items
      .split(",")
      .map((item: string) => Number(item.trim()))
      .map((item_id: number) => {
        console.log("item_id", item_id);
        return {
          item_id,
          point_id,
        };
      });

    await trx("point_items").insert(pointItems);
    await trx.commit();

    return response.json({ id: point_id, ...point }); //spread operator
  }

  async show(request: Request, response: Response) {
    const { id } = request.params;
    const point = await knex("points").where("id", id).first();

    if (!point) {
      return response.status(400).json({ message: "Point not found." });
    }

    const serializedPoint = {
      //const tmp_url = "10.0.2.2:3333";

      ...point,

      image_url: `http://192.168.1.5:3333/uploads/${point.image}`,
    };

    const items = await knex("items")
      .join("point_items", "items.id", "=", "point_items.item_id")
      .where("point_items.point_id", id)
      .select("items.title");

    return response.json({ point: serializedPoint, items });
  }
}
export default PointsController;
