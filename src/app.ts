import express, { Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";
import { Order, OrderError } from "./order";
import {
  getBurritoList,
  getOrders,
  getOrderById,
  getOrderDetail,
  createNewOrder,
  burritoListInterface,
} from "./database";
import cors from "cors";

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// burrito list cache data
let burritoListCachedData: burritoListInterface[];
let burritoIdSet: Set<number> = new Set();

async function getBurritoListCached() {
  if (!burritoListCachedData) {
    // future: update cache when burritoList database is updated
    burritoListCachedData = await getBurritoList();
    burritoListCachedData.forEach((element) => {
      burritoIdSet.add(element.id);
    });
  }
  return burritoListCachedData;
}

// get Routes
app.get("/api/v1/burrito", async (req, res) => {
  try {
    const rows = await getBurritoListCached();
    res.json(rows);
  } catch (error) {
    console.log(error);
    res.status(500).send("server failed to get burrito list.");
  }
});

app.get("/api/v1/orders", async (req, res) => {
  try {
    const rows = await getOrders();
    res.json(rows);
  } catch (error) {
    console.log(error);
    res.status(500).send("server failed to get orders.");
  }
});

app.get("/api/v1/orders/:orderId", async (req, res) => {
  const orderId = req.params.orderId;
  if (orderId === undefined) {
    res.status(400).send("Request does not contain an order id.");
  } else {
    const id = Number(orderId);
    if (isNaN(id)) {
      res.status(400).send("Request order id is not a number.");
    } else {
      try {
        const rows = await getOrderDetail(id);
        if (rows.length === 0) {
          res.status(400).send("Order id does not exist.");
        } else {
          res.json(rows);
        }
      } catch (error) {
        console.log(error);
        res.status(500).send("server failed to get order detail.");
      }
    }
  }
});

// post Routes
app.post("/api/v1/orders", async (req, res) => {
  if (req.body === undefined) {
    res.status(400).send("Body data is undefined.");
  } else {
    // make sure we cache our burrito id set
    try {
      await getBurritoListCached();
    } catch (error) {
      console.log(error);
      res.status(500).send("server failed to get burrito list.");
    }
    // create order
    let order;
    try {
      order = new Order(req);
      order.validateBurritoIds(burritoIdSet);
      const result = await createNewOrder(order);
      const rows = await getOrderById(result.insertId);
      res.status(201).json(rows);
    } catch (error) {
      if (error instanceof OrderError) {
        res.status(400).send(error.message);
      } else {
        console.log(error);
        res.status(500).send("server failed to create new order.");
      }
    }
  }
});

// Default error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send("Something broke 💩");
});

export default app;
