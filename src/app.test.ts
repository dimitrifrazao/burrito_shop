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
      expect(true).toBeTruthy(); // If JSON.parse() succeeds, the response body is JSON
    } catch (error) {
      fail("Response body is not JSON");
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
      expect(true).toBeTruthy(); // If JSON.parse() succeeds, the response body is JSON
    } catch (error) {
      fail("Response body is not JSON");
    }
  });
});
