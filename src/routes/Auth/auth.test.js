import request from "supertest";

import { MongoConnect, MongoDisconnect } from "../../services/ConnectMongo";
import { app } from "../../app.js";

describe("signup process", () => {
  beforeAll(async () => {
    await MongoConnect();
  });

  afterAll(async () => {
    await MongoDisconnect();
  });

  describe("Test POST /signup", () => {
    const fullData = {
      name: "Bluetooth",
      email: "sujata@gmail.com",
      password: "John@123",
      gender: "female",
      age: 22,
    };

    const defectEmail = {
      name: "Bluetooth",
      email: "souvizra87@gmail.com",
      password: "John@123",
      gender: "male",
      age: 22,
    };
    const defectpassword = {
      name: "Bluetooth",
      email: "soizra87@gmail.com",
      password: "John",
      gender: "male",
      age: 22,
    };

    //we can signup once with an email id
    test("It should respond with 200 succcess", async () => {
      const response = await request(app)
        .post("/signup")
        .send(fullData)
        .expect("Content-Type", /json/)
        .expect(200);

      expect(response.body).toStrictEqual({
        message: "OTP sent to your email",
      });
    }, 10000);

    // signup with same email
    test("It should respond with 400 succcess", async () => {
      const response = await request(app)
        .post("/signup")
        .send(defectEmail)
        .expect("Content-Type", /json/)
        .expect(400);

      expect(response.body).toStrictEqual({
        message: "User already created , please sign in",
      });
    }, 10000);

    // signup with small length password
    test("It should respond with 400 succcess", async () => {
      const response = await request(app)
        .post("/signup")
        .send(defectpassword)
        .expect("Content-Type", /json/)
        .expect(400);

      expect(response.body).toStrictEqual({
        message: "Password should be atleast 6 characters long",
      });
    }, 10000);
  });
});

describe("verify the signup process", () => {
  beforeAll(async () => {
    await MongoConnect();
  });

  afterAll(async () => {
    await MongoDisconnect();
  });

  describe("Test POST /signup/verify", () => {
    const defectiveOtp = {
      email: "souvizra87@gmail.com",
    };

    const defectiveEmail = {
      otp: "899697",
    };
    const dectOtp = {
      email: "souvizra87@gmail.com",
      otp: "1234",
    };

    const notMatchOTP = {
      email: "souvizra87@gmail.com",
      otp: "123456",
    };

    const defectEmail = {
      name: "Bluetooth",
      email: "souvizra87@gmail.com",
      password: "John@123",
      gender: "male",
      age: 22,
    };
    const defectpassword = {
      name: "Bluetooth",
      email: "soizra87@gmail.com",
      password: "John",
      gender: "male",
      age: 22,
    };

    //we can signup once with an email id
    // test("It should respond with 200 succcess", async () => {
    //   const response = await request(app)
    //     .post("/signup/verify")
    //     .send(fullData)
    //     .expect("Content-Type", /json/)
    //     .expect(200);

    //   expect(response.body).toStrictEqual({
    //     message: "OTP sent to your email",
    //   });
    // }, 10000);

    // signup with only email
    test("It should respond with 400 Bad Request", async () => {
      const response = await request(app)
        .post("/signup/verify")
        .send(defectiveOtp)
        .expect("Content-Type", /json/)
        .expect(400);

      expect(response.body).toStrictEqual({
        message: "Email or OTP is required",
      });
    }, 10000);

    // signup with only otp
    test("It should respond with 400 Bad Request", async () => {
      const response = await request(app)
        .post("/signup/verify")
        .send(defectiveEmail)
        .expect("Content-Type", /json/)
        .expect(400);

      expect(response.body).toStrictEqual({
        message: "Email or OTP is required",
      });
    }, 10000);

    // signup with otp not match
    test("It should respond with 400 Bad Request", async () => {
      const response = await request(app)
        .post("/signup/verify")
        .send(notMatchOTP)
        .expect("Content-Type", /json/)
        .expect(400);

      expect(response.body).toStrictEqual({
        message: "Invalid otp",
      });
    }, 10000);
  });
});

describe("Signin process", () => {
  beforeAll(async () => {
    await MongoConnect();
  });

  afterAll(async () => {
    await MongoDisconnect();
  });

  describe("/signin POST", () => {
    const bodyWithoutEmail = {
      password: "Souradeep123",
    };

    const bodyWihtoutPassword = {
      email: "Souvikhazra@gmail.com",
    };

    const bodyWithWrongEmail = {
      email: "S@gmail.com",
      password: "123456",
    };

    // const password doesn't match
    const bodyWithWrongpassword = {
      email: "love@gmail.com",
      password: "Souradeep@123",
    };
    //all correct
    const body = {
      email: "love@gmail.com",
      password: "John@123",
    };

    // test("It should response with 200 statuscode")

    //bodyWithoutEmail
    test("It should response with 400 code(bodyWithoutEmail)", async () => {
      const response = await request(app)
        .post("/signin")
        .send(bodyWithoutEmail)
        .expect("Content-Type", /json/)
        .expect(400);

      expect(response.body).toStrictEqual({
        message: "All fields are required",
      });
    }, 10000);

    test("Its hould respond with 400 code(bodyWihtoutPassword)", async () => {
      const response = await request(app)
        .post("/signin")
        .send(bodyWihtoutPassword)
        .expect("Content-Type", /json/)
        .expect(400);

      expect(response.body).toStrictEqual({
        message: "All fields are required",
      });
    }, 10000);

    test("it should response with 400 code(bodyWithWrongEmail)", async () => {
      const response = await request(app)
        .post("/signin")
        .send(bodyWithWrongEmail)
        .expect("Content-Type", /json/)
        .expect(400);

      expect(response.body).toStrictEqual({
        message: "Email does not exist",
      });
    }, 10000);

    test("It should response with 400 code(bodyWithWrongpassword)", async () => {
      const response = await request(app)
        .post("/signin")
        .send(bodyWithWrongpassword)
        .expect("Content-Type", /json/)
        .expect(400);

      expect(response.body).toStrictEqual({
        message: "Invalid credentials",
      });
    }, 20000);

    test("It should response with 200 code(body)", async () => {
      const response = await request(app)
        .post("/signin")
        .send(body)
        .expect("Content-Type", /json/)
        .expect(200);
    }, 20000);
  });
});
