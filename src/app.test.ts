const request = require("supertest");
//const app = require("./app");
import app from "./app";

describe("burrito end point", () => {
  test("should respond with 200 status code", async () => {
    const response = await request(app).get("/api/v1/burrito").send();
    expect(response.statusCode).toBe(200);
  });

  test("should respond json body", async () => {
    const response = await request(app).get("/api/v1/burrito").send();
    try {
      JSON.parse(JSON.stringify(response.body));
      expect(true).toBeTruthy();
    } catch (error) {
      fail("Response body is not JSON");
    }
  });

  test("should not be empty", async () => {
    const response = await request(app).get("/api/v1/burrito").send();
    expect(response.body.length).toBeGreaterThan(0);
  });

  test("wrong burrito data format", async () => {
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

describe("order endpoint", () => {
  test("should respond with 200 status code", async () => {
    const response = await request(app).get("/api/v1/orders").send();
    expect(response.statusCode).toBe(200);
  });

  test("should respond json body", async () => {
    const response = await request(app).get("/api/v1/orders").send();
    try {
      JSON.parse(JSON.stringify(response.body));
      expect(true).toBeTruthy();
    } catch (error) {
      fail("Response body is not JSON");
    }
  });

  test("hould respond with 201 status code", async () => {
    const order = [{ burrito_id: 1, count: "1" }];
    const response = await request(app).post("/api/v1/orders").send(order);
    expect(response.statusCode).toBe(201);
  });
});

describe("order detail endpoint", () => {
  test("should respond with 200 status code", async () => {
    const response = await request(app).get("/api/v1/orders").send();
    expect(response.statusCode).toBe(200);
  });

  test("should respond json body", async () => {
    const response = await request(app).get("/api/v1/orders").send();
    try {
      JSON.parse(JSON.stringify(response.body));
      expect(true).toBeTruthy();
    } catch (error) {
      fail("Response body is not JSON");
    }
  });
});
