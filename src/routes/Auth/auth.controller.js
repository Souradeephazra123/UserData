//signup
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { findEmail, saveUser } from "../../model/user.model.js";
import nodemailer from "nodemailer";
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
    // console.log(ExistingEmail);
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

    //creating otp
    let OTP = Math.floor(Math.random() * 900000) + 100000;

    //otp nodemailer
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    let info = await transporter.sendMail({
      from: '"Souradeep Hazra 👻" <yasmin42@ethereal.email>', // sender address
      to: email, // list of receivers
      subject: "OTP", // Subject line
      text: `This is your OTP: ${OTP}`, // plain text body
      html: `<div> <p>This is your otp</p> <br/> <p>${OTP}</p></div>`, // html body
    });

    console.log("Email sent: %s", info.messageId);

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

    //check length of otp
    if (otp.length !== 6) {
      return res.status(400).json({
        message: "OTP length should be lenght of 6(strict)",
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

//signIn
async function signIn(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    //emails exists?
    const existingEmail = await findEmail(email);
    if (!existingEmail) {
      return res.status(400).json({
        message: "Email does not exist",
      });
    }
    console.log(existingEmail);

    //match email and password
    // Compare the provided password with the stored hashed password
    const isMatch = await bcrypt.compare(password, existingEmail.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    //create token
    const token = jwt.sign(
      {
        name: existingEmail.name,
        email: existingEmail.email,
        gender: existingEmail.gender,
        age: existingEmail.age,
      },
      process.env.SECRET_KEY,
      {
        expiresIn: "24h",
      }
    );

    return res.status(200).json({
      message: "Sign in successful",
      token: token,
      userDetails: existingEmail,
    });
  } catch (error) {
    console.log("Error in signin", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

//refresh token

async function refreshToken(req, res) {
  try {
    const { token } = req.body;
    //verify the token to ensure it is valid

    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
      if (err) {
        return res.status(401).json({
          message: "Invalid Token",
        });
      }

      //create new token with same payload with new expiration time
      const newToken = jwt.sign(
        {
          name: decoded.name,
          email: decoded.email,
          gender: decoded.gender,
          age: decoded.age,
        },
        process.env.SECRET_KEY,
        {
          expiresIn: "24h",
        }
      );

      return res.status(200).json({
        token: newToken,
      });
    });
  } catch (error) {
    res.status(500).json({ msg: "An error occurred", error: error.message });
  }
}

export { signup, verifySignup, signIn, refreshToken };
