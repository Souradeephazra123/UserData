import UserDatabase from "./user.mongo.js";
import redis from "redis";

//find email exists or not

//connect to redis
// let client;
// (async () => {
//   // Connect to your internal Redis instance using the REDIS_URL environment variable
//   // The REDIS_URL is set to the internal Redis URL e.g. redis://red-343245ndffg023:6379
//   client = redis.createClient({
//     url: process.env.REDIS_URL,
//   });

//   client.on("error", (err) => console.log("Redis Client Error", err));

//   await client.connect();

//   // Send and retrieve some values
//   await client.set("key", "node redis");
//   const value = await client.get("key");

//   console.log("found value: ", value);
// })();

const DEFAULT_USER_ID = 0;

async function getLatestId() {
  const latestId = await UserDatabase.findOne().sort("-user_id");

  if (!latestId) {
    return DEFAULT_USER_ID;
  }
  return latestId.user_id;
}

async function findEmail(email) {
  const user = await UserDatabase.findOne(
    {
      email: email,
    },
    { _id: 0, __v: 0 }
  );
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

async function getAllUsers() {
  const users = await UserDatabase.find({}, { _id: 0, __v: 0 });
  return users;
}

async function getSpecificUser(id) {
  try {
    // console.log("id from API request", params.id);
    const userId = Number(id); // Convert the id to a number

    //check if cached query data present in redis
    // const cachedData = await client.get(`id:${userId}`);
    // if (cachedData) {
    //   console.log("Returning cached data from Redis");
    //   return JSON.parse(cachedData);
    // }

    //validate id
    if (isNaN(userId)) {
      throw new Error("Invalid user Id");
    }

    const user = await UserDatabase.findOne(
      { user_id: userId },
      { _id: 0, __v: 0 }
    );

    // Store the result in Redis
    // await client.set(`id:${userId}`, JSON.stringify(user));

    return user;
  } catch (error) {
    console.log("Error in finding specific user", error);
  }
}

async function updateData(id, body) {
  try {
    const userId = Number(id);

    //validate id
    if (isNaN(userId)) {
      console.log("Invalid user ID:", id);
      throw new Error("Invalid user Id");
    }

    //here new:true returns the updated document
    //whereas upsert:true creates a new document if no match is found
    const updatedUser = await UserDatabase.findOneAndUpdate(
      {
        user_id: userId,
      },
      { $set: body },
      { new: true }
    );

    // if (!updatedUser) {
    //   console.log("User not found with ID:", userId);
    //   return false;
    // }

    return updatedUser;
  } catch (error) {
    console.log("Error in updating user", error);
  }
}

async function deleteData(id) {
  try {
    const deletedUser = await UserDatabase.findOneAndDelete({ user_id: id });
    return deletedUser;
  } catch (error) {
    console.error(`Error deleting user with id ${id}:`, error);
    throw error;
  }
}

export { findEmail, saveUser, getAllUsers, getSpecificUser, updateData,deleteData };
