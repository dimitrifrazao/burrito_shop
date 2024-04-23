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
    // make sure we cache our burrito list
    try {
      await getBurritoListCached();
    } catch (error) {
      console.log(error);
      res.status(500).send("server failed to get burrito list.");
    }
    // validate order data
    let isValid = true;
    let data: orderItemDataInterface[] = [];
    let bSet: Set<number> = new Set();
    let errorMessage: string = "";
    for (let i = 0; i < req.body.length; i++) {
      const burrito_id = Number(req.body[i].burrito_id);
      const count = Number(req.body[i].count);
      if (isNaN(burrito_id)) {
        isValid = false;
        errorMessage = "burrito id is not a number.";
        break;
      }
      if (isNaN(count)) {
        isValid = false;
        errorMessage = "count is not a number.";
        break;
      }
      if (!burritoIdSet.has(burrito_id)) {
        isValid = false;
        errorMessage = "invalid burrito id.";
        break;
      }
      if (count < 1) {
        isValid = false;
        errorMessage = "count can't be negative or zero.";
        break;
      }
      if (bSet.has(burrito_id)) {
        isValid = false;
        errorMessage = "order has duplicate burrito ids.";
        break;
      }
      bSet.add(burrito_id);
      data.push({ burrito_id: burrito_id, count: count });
    }
    if (data.length === 0) {
      isValid = false;
      errorMessage = "order data is empty.";
    }
    // end of validation
    if (isValid === true) {
      try {
        const result = await createNewOrder(data);
        res.status(201).json(result);
      } catch (error) {
        console.log(error);
        res.status(500).send("server failed to create new order.");
      }
    } else {
      if (errorMessage.length === 0) {
        res.status(500).send("server failed to generate error message.");
      } else {
        res.status(400).send(errorMessage);
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
