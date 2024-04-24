const request = require("supertest");
import app from "./app";

function isJSON(data: any) {
  try {
    JSON.parse(JSON.stringify(data));
  } catch (error) {
    fail("Response body is not JSON");
  }
}

describe("burrito list end point", () => {
  test("should respond with 200 status code", async () => {
    const response = await request(app).get("/api/v1/burrito").send();
    expect(response.statusCode).toBe(200);
  });

  test("should respond json body", async () => {
    const response = await request(app).get("/api/v1/burrito").send();
    isJSON(response.body);
  });

  test("should not be empty", async () => {
    const response = await request(app).get("/api/v1/burrito").send();
    expect(response.body.length).toBeGreaterThan(0);
  });

  test("Correct burrito data format", async () => {
    const response = await request(app).get("/api/v1/burrito").send();
    for (let i = 0; i < response.body.length; i++) {
      let burrito = response.body[i];
      expect("id" in burrito).toBeTruthy();
      expect("name" in burrito).toBeTruthy();
      expect("size" in burrito).toBeTruthy();
      expect("price" in burrito).toBeTruthy();
    }
  });
});

describe("order end point", () => {
  test("should respond with 200 status code", async () => {
    const response = await request(app).get("/api/v1/orders").send();
    expect(response.statusCode).toBe(200);
  });

  test("should respond json body", async () => {
    const response = await request(app).get("/api/v1/orders").send();
    isJSON(response.body);
  });

  test("should respond with 201 status code", async () => {
    const order = [{ burrito_id: 1, count: 1 }];
    const response = await request(app).post("/api/v1/orders").send(order);
    expect(response.statusCode).toBe(201);
  });

  test("should respond with 400 status code, duplicate burritos", async () => {
    const order = [
      { burrito_id: 1, count: 1 },
      { burrito_id: 1, count: 1 },
    ];
    const response = await request(app).post("/api/v1/orders").send(order);
    expect(response.statusCode).toBe(400);
  });

  test("should return single order data", async () => {
    const order = [{ burrito_id: 1, count: 1 }];
    const response = await request(app).post("/api/v1/orders").send(order);
    expect(response.body.length).toBe(1);
  });

  test("correct new order format", async () => {
    const order = [{ burrito_id: 1, count: 1 }];
    const response = await request(app).post("/api/v1/orders").send(order);
    for (let i = 0; i < response.body.length; i++) {
      let order = response.body[i];
      expect("order_id" in order).toBeTruthy();
      expect("total" in order).toBeTruthy();
    }
  });
});

describe("order detail end point", () => {
  test("should respond with 200 status code", async () => {
    const order = [{ burrito_id: 1, count: 1 }];
    const response1 = await request(app).post("/api/v1/orders").send(order);
    const id = response1.body[0].order_id;
    const response2 = await request(app).get(`/api/v1/orders/${id}`).send();
    expect(response2.statusCode).toBe(200);
  });

  test("should respond with 400 status code", async () => {
    const response = await request(app).get("/api/v1/orders/a").send();
    expect(response.statusCode).toBe(400);
  });

  test("should respond json body", async () => {
    const response = await request(app).get("/api/v1/orders").send();
    isJSON(response.body);
  });

  test("correct order detail format", async () => {
    const order = [{ burrito_id: 1, count: 1 }];
    const response1 = await request(app).post("/api/v1/orders").send(order);
    const id = response1.body[0].order_id;
    const response2 = await request(app).get(`/api/v1/orders/${id}`).send();
    for (let i = 0; i < response2.body.length; i++) {
      let order_detail = response2.body[i];
      expect("name" in order_detail).toBeTruthy();
      expect("size" in order_detail).toBeTruthy();
      expect("price" in order_detail).toBeTruthy();
      expect("count" in order_detail).toBeTruthy();
    }
  });
});
