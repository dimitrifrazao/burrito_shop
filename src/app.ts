import express, { Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";
import {
  getBurritoList,
  getOrders,
  getOrderDetail,
  createNewOrder,
  burritoListInterface,
  orderItemDataInterface,
} from "./database";

const app = express();

// burrito list cache and burrito id set
let cachedBurritoData: burritoListInterface[];
let burritoIdSet: Set<number> = new Set();

// Middleware
app.use(bodyParser.json());

async function getBurritoListJSON() {
  if (!cachedBurritoData) {
    // future: update cache when burritoList database is updated
    cachedBurritoData = await getBurritoList();
    cachedBurritoData.forEach((element) => {
      burritoIdSet.add(element.id);
    });
  }
  return cachedBurritoData;
}

// get Routes
app.get("/api/v1/burrito", async (req, res) => {
  try {
    const rows = await getBurritoListJSON();
    res.json(rows);
  } catch (error) {
    console.log(error);
    res.status(500).send("server failed to get burrito list");
  }
});

app.get("/api/v1/orders", async (req, res) => {
  try {
    const rows = await getOrders();
    res.json(rows);
  } catch (error) {
    console.log(error);
    res.status(500).send("server failed to get orders");
  }
});

app.get("/api/v1/orders/:orderId", async (req, res) => {
  const orderId = req.params.orderId;
  if (orderId === undefined) {
    res.status(400).send("Request does not contain an order id");
  } else {
    const id = Number(orderId);
    if (isNaN(id)) {
      res.status(400).send("Request order id is not a number");
    } else {
      try {
        const rows = await getOrderDetail(id);
        if (rows.length === 0) {
          res.status(400).send("Order id does not exist");
        } else {
          res.json(rows);
        }
      } catch (error) {
        console.log(error);
        res.status(500).send("server failed to get order detail");
      }
    }
  }
});

// post Routes
app.post("/api/v1/orders", async (req, res) => {
  if (req.body === undefined) {
    res.status(400).send("Body data is undefined");
  } else {
    try {
      await getBurritoListJSON();
    } catch (error) {
      console.log(error);
      res.status(500).send("server failed to get burrito list");
    }
    let isValid = true;
    let data: orderItemDataInterface[] = [];
    for (let i = 0; i < req.body.length; i++) {
      const burrito_id = Number(req.body[i].burrito_id);
      const count = Number(req.body[i].count);
      if (
        isNaN(burrito_id) ||
        isNaN(count) ||
        burrito_id < 1 ||
        count < 1 ||
        !burritoIdSet.has(burrito_id)
      ) {
        isValid = false;
        break;
      }
      data.push({ burrito_id: burrito_id, count: count });
    }
    if (isValid === true && data.length > 0) {
      try {
        const result = await createNewOrder(data);
        res.status(201).json(result);
      } catch (error) {
        console.log(error);
        res.status(500).send("server failed to create new order");
      }
    } else {
      const errorMessage = isValid
        ? "orderData is empty"
        : "orderData has invalid data";
      res.status(400).send(errorMessage); // needs to be more descriptive
    }
  }
});

// Default error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send("Something broke 💩");
});

export default app;
