//signup
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { findEmail, saveUser } from "../../model/user.model.js";
// import crypto from "crypto";

// Generate a 64-character secret code
// const secretCode = crypto.randomBytes(32).toString("hex");

// console.log(`Your secret code is: ${secretCode}`);

const tempUser = new Map();

async function signup(req, res) {
  try {
    const { name, email, password, gender, age } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    //check if email already exists
    const ExistingEmail = await findEmail(email);
    if (ExistingEmail) {
      return res.status(400).json({
        message: "User already created , please sign in",
      });
    }

    //check pasword length
    if (password.length < 6) {
      return res.status(400).json({
        message: "Password should be atleast 6 characters long",
      });
    }

    let OTP = Math.floor(Math.random() * 900000) + 100000;

    //stire user deatails temporarily
    tempUser.set(email.toLowerCase(), {
      name,
      email,
      password,
      gender,
      age,
      OTP,
    });
    console.log(OTP);
    // Send OTP to user (for simplicity, we log it here)
    return res.status(200).json({ message: "OTP sent to your email" });
  } catch (error) {
    console.log("Error in signup", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

//verify signup
async function verifySignup(req, res) {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({
        message: "Email or OTP is required",
      });
    }

    const temp = tempUser.get(email.toLowerCase());

    if (!temp) {
      return res.status(400).json({
        message: "Invalid otp",
      });
    }

    if (temp.OTP !== otp) {
      return res.status(400).json({
        message: " OTP doesn't match",
      });
    }

    //if otp is matched secure password
    const hashedPassword = await bcrypt.hash(temp.password, 10);

    //save user

    await saveUser(
      temp.name,
      temp.email,
      hashedPassword,
      temp.gender,
      temp.age
    );

    //create token
    const token = jwt.sign(
      {
        name: temp.name,
        email: temp.email,
        gender: temp.gender,
        age: temp.age,
      },
      process.env.SECRET_KEY,
      {
        expiresIn: "24h",
      }
    );

    // Remove the temporary user data
    tempUser.delete(email.toLowerCase());

    return res.status(201).json({
      message: "User created successfully ",
      token: token,
    });
  } catch (error) {
    console.log("Error in verifying otp", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export { signup, verifySignup };
