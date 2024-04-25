import express, { Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";
import { Order, OrderError } from "./order";
import cors from "cors";
import passport from "passport";
import session from "express-session";
import { authSetup, User } from "./auth";
import dotenv from "dotenv";
import {
  getBurritoList,
  getOrders,
  getOrderById,
  getOrderDetail,
  createNewOrder,
  burritoListInterface,
} from "./database";

dotenv.config();

const app = express();

const secret = process.env.SESSION_SECRET || "some-secret";
if (secret === undefined) throw Error("must define .env secret");

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(
  session({
    secret: secret,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

// authentication
authSetup();
const skipAuth: boolean = process.env.SKIP_AUTH === "true";

function isAuthenticated(req: Request, res: Response, next: Function) {
  if (skipAuth || req.isAuthenticated()) {
    return next();
  }
  res.redirect("/auth");
}

app.get("/auth", (req, res) => {
  res.send(`<a href="/auth/google">Authenticate with Google</a>`);
});

app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    successRedirect: "/auth/success",
    failureRedirect: "/auth/failed",
  })
);

app.get("/auth/success", (req: Request, res) => {
  const user: User = req.user as User;
  res.status(200).send(`Welcome ${user.displayName}`);
});

app.get("/auth/failed", (req: Request, res) => {
  res.status(401).send(`<p>Authentication failed.</p>
  <a href="/auth/google">Authenticate with Google</a>`);
});

app.get("/auth/logout", (req, res) => {
  req.logout(function (error) {
    if (error) console.log(error);
  });
  req.session.destroy(function (error) {
    if (error) console.log(error);
    res.send("good bye!");
  });
});

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

// burrito shop Routes
app.get("/api/v1/burrito", async (req, res) => {
  try {
    const rows = await getBurritoListCached();
    res.json(rows);
  } catch (error) {
    console.log(error);
    res.status(500).send("server failed to get burrito list.");
  }
});

app.get("/api/v1/orders", isAuthenticated, async (req, res) => {
  try {
    const rows = await getOrders();
    res.json(rows);
  } catch (error) {
    console.log(error);
    res.status(500).send("server failed to get orders.");
  }
});

app.get("/api/v1/orders/:orderId", isAuthenticated, async (req, res) => {
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

app.post("/api/v1/orders", isAuthenticated, async (req, res) => {
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
  res.status(500).send("Something broke!");
});

export default app;
