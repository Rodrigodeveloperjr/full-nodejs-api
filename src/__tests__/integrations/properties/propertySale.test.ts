import {
  loginAdm,
  property,
  userAdm,
  userNotAdm,
} from "../../../mocks";
import { AppDataSource } from "../../../data-source";
import { DataSource } from "typeorm";
import { app } from "../../../app";
import request from "supertest";

describe("Tests for properties routes", () => {
  let connection: DataSource;

  beforeAll(async () => {
    await AppDataSource.initialize()
      .then((res) => (connection = res))
      .catch((err) =>
        console.error("Error during DataSource initialization", err)
      );
    await request(app).post("/users/signup").send(userAdm);
    await request(app).post("/users/signup").send(userNotAdm);
  });

  afterAll(async () => await connection.destroy());

  test("Must be able to sale a property", async () => {
    const login = await request(app).post("/signin").send(loginAdm);

    const token: string = login.body.token;

    const createProperty = await request(app)
      .post("/properties")
      .send(property)
      .set("Authorization", `Bearer ${token}`);

    const response = await request(app)
      .post(`/properties/${createProperty.body.id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("message");
  });

  test("Must prevent sale a tokenless property", async () => {
    const createProperty = await request(app)
      .post("/properties")
      .send(property);

    const response = await request(app).post(
      `/properties/${createProperty.body.id}`
    );

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message");
  });

  test("Must prevent sale a property with invalid id", async () => {
    const login = await request(app).post("/signin").send(loginAdm);

    const token: string = login.body.token;

    const response = await request(app)
      .post("/properties/05a429c8-ca25-4007-8854-25c25f734167")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message");
  });
});
