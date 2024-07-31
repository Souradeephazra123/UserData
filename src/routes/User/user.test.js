import request from "supertest";

import { MongoConnect, MongoDisconnect } from "../../services/ConnectMongo";
import { app } from "../../app.js";

describe("Get All users data", () => {
  beforeAll(async () => {
    await MongoConnect();
  });

  afterAll(async () => {
    await MongoDisconnect();
  });

  describe("Test GET /users", () => {
    test("It should respond with 200 succcess", async () => {
      const response = await request(app)
        .get("/users")
        .set("Authorization", `Bearer ${process.env.new_token}`)
        .expect("Content-Type", /json/)
        .expect(200);
    }, 10000);

    //without auth header
    test("It should respond with 401 unauthorized", async () => {
      const response = await request(app)
        .get("/users")
        .expect("Content-Type", /json/)
        .expect(401);
    }, 10000);

    //without token
    test("It should respond with 401 unauthorized", async () => {
      const response = await request(app)
        .get("/users")
        .set("Authorization", `Bearer`)
        .expect("Content-Type", /json/)
        .expect(401);
    }, 10000);
  });
});

describe("Get specific user data", () => {
  beforeAll(async () => {
    await MongoConnect();
  });

  afterAll(async () => {
    await MongoDisconnect();
  });

  describe("test /POST /user/:id", () => {
    test("It should respond with 200", async () => {
      const response = await request(app)
        .get("/user/1")
        .set("Authorization", `Bearer ${process.env.new_token}`)
        .expect("Content-Type", /json/)
        .expect(200);
    });

    //here i am using a id that does not exist
    test("It should respond with 404", async () => {
      const response = await request(app)
        .get("/user/3")
        .set("Authorization", `Bearer ${process.env.new_token}`)
        .expect("Content-Type", /json/)
        .expect(404);

      expect(response.body).toStrictEqual({
        message: "User not found",
      });
    });

    //not giving an id
    test("It should respond with 400", async () => {
      const response = await request(app)
        .get("/user/")
        .set("Authorization", `Bearer ${process.env.new_token}`)
        .expect("Content-Type", /json/)
        .expect(400);

      expect(response.body).toStrictEqual({
        message: "User ID is required",
      });
    });
  });
});

describe("Update specific user data", () => {
  beforeAll(async () => {
    await MongoConnect();
  });

  afterAll(async () => {
    await MongoDisconnect();
  });

  describe("test /PUT /user/:id", () => {
    const fullbody = {
      name: "Cutie pie",
      age: 22,
      gender: "female",
    };

    const defectedAge = {
      age: -5,
    };
    const defectedGender = {
      gender: "Unknown",
    };
    //all data
    test("It should respond with 202", async () => {
      const response = await request(app)
        .put("/user/2")
        .send(fullbody)
        .set("Authorization", `Bearer ${process.env.new_token}`)
        .expect("Content-Type", /json/)
        .expect(202);

      expect(response.body?.data?.name).toStrictEqual(fullbody?.name);
      expect(response.body?.data?.age).toStrictEqual(fullbody?.age);
      expect(response.body?.data?.gender).toStrictEqual(fullbody?.gender);
    });

    //defected age
    test("It should respond with 400", async () => {
      const response = await request(app)
        .put("/user/2")
        .send(defectedAge)
        .set("Authorization", `Bearer ${process.env.new_token}`)
        .expect("Content-Type", /json/)
        .expect(400);

      expect(response.body).toStrictEqual({
        message: "Age is not valid",
      });
    });

    //defected gender
    test("It should respond with 400", async () => {
      const response = await request(app)
        .put("/user/2")
        .send(defectedGender)
        .set("Authorization", `Bearer ${process.env.new_token}`)
        .expect("Content-Type", /json/)
        .expect(400);

      expect(response.body).toStrictEqual({
        message: "Please enter valid sex",
      });
    });

    // here i am using a id that does not exist
    test("It should respond with 404", async () => {
      const response = await request(app)
        .put("/user/3")
        .send(fullbody)
        .set("Authorization", `Bearer ${process.env.new_token}`)
        .expect("Content-Type", /json/)
        .expect(404);

      expect(response.body).toStrictEqual({
        message: "User not found",
      });
    });
  });
});

describe("Delete specific user data", () => {
  beforeAll(async () => {
    await MongoConnect();
  });

  afterAll(async () => {
    await MongoDisconnect();
  });

  describe("test /DELETE /user/:id", () => {
    //successfull

    //this will work for first time
    
    // test("It should respond with 200", async () => {
    //   const response = await request(app)
    //     .delete("/user/4")
    //     .set("Authorization", `Bearer ${process.env.new_token}`)
    //     .expect("Content-Type", /json/)
    //     .expect(200);

    //   expect(response.body).toStrictEqual({
    //     message: "User data is deleted successfully",
    //   });
    // });

    //here i am using a id that does not exist
    test("It should respond with 400", async () => {
      const response = await request(app)
        .delete("/user/3")
        .set("Authorization", `Bearer ${process.env.new_token}`)
        .expect("Content-Type", /json/)
        .expect(400);

      expect(response.body).toStrictEqual({
        message: "User not found with this id",
      });
    });

    //not giving an id
    test("It should respond with 400", async () => {
      const response = await request(app)
        .get("/user/")
        .set("Authorization", `Bearer ${process.env.new_token}`)
        .expect("Content-Type", /json/)
        .expect(400);

      expect(response.body).toStrictEqual({
        message: "User ID is required",
      });
    });
  });
});
