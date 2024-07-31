import UserDatabase from "./user.mongo.js";

//find email exists or not

const DEFAULT_USER_ID = 0;

async function getLatestId() {
  const latestId = await UserDatabase.findOne().sort("-user_id");

  if (!latestId) {
    return DEFAULT_USER_ID;
  }
  return latestId.user_id;
}

async function findEmail(email) {
  const user = await UserDatabase.findOne({
    email: email,
  });
  return user;
}

async function saveUser(name, email, password, gender, age) {
  try {
    const newUser = new UserDatabase({
      user_id: (await getLatestId()) + 1,
      name,
      email,
      password,
      gender,
      age,
    });
    await newUser.save();
    console.log("User saved successfully");
  } catch (error) {
    console.log("Unable to save user", error);
  }
}

export { findEmail, saveUser };
