import {
  deleteData,
  getAllUsers,
  getSpecificUser,
  updateData,
} from "../../model/user.model.js";

async function showAllUserData(req, res) {
  const users = await getAllUsers();
  return res.status(200).json({ users });
}

async function specificUserData(req, res) {
  try {
    const { id } = req.params;

    const user = await getSpecificUser(id);
    if (user) {
      return res.status(200).json({ user });
    }
    return res.status(404).json({ message: "User not found" });
  } catch (error) {
    console.log("Error in specific user data", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function handleMissingUserId(req, res) {
  return res.status(400).json({ message: "User ID is required" });
}
async function UpdateAnUserdata(req, res) {
  const { id } = req.params;
  const { name, age, gender } = req.body;

  if (!id) {
    return res.status(200).json({
      message: "Please enter your id",
    });
  }

  //age veification

  if (age < 0 || age > 110) {
    return res.status(400).json({
      message: "Age is not valid",
    });
  }

  //if gender is neither male or female
  if (gender !== "male" && gender !== "female") {
    return res.status(400).json({
      message: "Please enter valid sex",
    });
  }

  const updatedData = {};
  if (name) updatedData.name = name;
  if (age) updatedData.age = age;
  if (gender) updatedData.gender = gender;

  //update user data
  const newData = await updateData(id, updatedData);

  if (!newData) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  res.status(202).json({
    message: "user data is updated sucessfully",
    data: newData,
  });
}

async function deleteUser(req, res) {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({
      message: "User Id is required",
    });
  }

  const deletedData = await deleteData(id);

  if (!deletedData) {
    return res.status(400).json({
      message: "User not found with this id",
    });
  }

  return res.status(200).json({
    message: "User data is deleted successfully",
  });
}
export {
  showAllUserData,
  specificUserData,
  UpdateAnUserdata,
  deleteUser,
  handleMissingUserId,
};
