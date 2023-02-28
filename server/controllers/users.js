import mongoose from "mongoose";
import users from "../models/auth.js";

export const getAllUsers = async (req, res) => {
  try {
    const allUsers = await users.find();
    const allUserDetails = [];
    allUsers.forEach((user) => {
      allUserDetails.push({
        _id: user._id,
        name: user.name,
        about: user.about,
        tags: user.tags,
        joinedOn: user.joinedOn,
      });
    });
    res.status(200).json(allUserDetails);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const updateProfile = async (req, res) => {
  const { id: _id } = req.params;
  const { name, about, tags } = req.body;

  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(404).send("question unavailable...");
  }

  try {
    const updatedProfile = await users.findByIdAndUpdate(
      _id,
      { $set: { name: name, about: about, tags: tags } },
      { new: true }
    );
    res.status(200).json(updatedProfile);
  } catch (error) {
    res.status(405).json({ message: error.message });
  }
};
export const setUserSubscription = async (req, res) => {
  try {
      const { userId, type } = req.body;
      const user = await users.findById(userId);
      user.subscription = type;

      let noOfQuestions = 1;
      if (type === "1") { noOfQuestions = 2 }
      if (type === "2") { noOfQuestions = 5 }

      user.noOfQuestions = noOfQuestions;
      await Users.findByIdAndUpdate(userId, user)
      res.status(200).json({ data: user })
  } catch (err) {
      res.status(500).json({ data: null })

  }
}

export const setUserQuestionLeft = async (req, res) => {
  try {
      const { userId, quesLeft } = req.body;
      const user = await users.findById(userId);
      user.noOfQuestions = quesLeft

      await Users.findByIdAndUpdate(userId, user)
      res.status(200).json(user)
  } catch (err) { console.log(err) }
}