import { Request } from "express";
import dotenv from "dotenv";

dotenv.config();

export class OrderError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

interface orderItemDataInterface {
  burrito_id: number;
  count: number;
}

export class Order {
  private data: orderItemDataInterface[] = [];
  private static count_limit = Number(process.env.COUNT_LIMIT) || 100;

  constructor(req: Request) {
    let bSet: Set<number> = new Set();
    for (let i = 0; i < req.body.length; i++) {
      const burrito_id = Number(req.body[i].burrito_id);
      const count = Number(req.body[i].count);
      if (isNaN(burrito_id)) throw new OrderError("burrito id is not a number");
      if (isNaN(count)) throw new OrderError("count is not a number");
      if (count < 1) throw new OrderError("count can't be negative or zero");
      if (count > Order.count_limit)
        throw new OrderError(`count larger than limit: ${Order.count_limit}`);
      if (bSet.has(burrito_id))
        throw new OrderError("order has duplicate burrito ids");
      bSet.add(burrito_id);
      this.data.push({ burrito_id: burrito_id, count: count });
    }
    if (this.data.length === 0) throw new OrderError("order data is empty");
  }

  validateBurritoIds(burritoIdSet: Set<number>) {
    this.data.forEach((element) => {
      if (!burritoIdSet.has(element.burrito_id))
        throw new OrderError("invalid burrito id");
    });
  }

  getSize(): number {
    return this.data.length;
  }
  getData(i: number): orderItemDataInterface {
    return this.data[i];
  }
}
