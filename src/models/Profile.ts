import mongoose from "mongoose";

const { Schema } = mongoose;

const schema = new Schema({
  name: String,
  nickname: String,
  email: String,
  capital: Number,
  divisa: String,
  prefered_cryptocurrency: String,
  password: String
});

export const Profile = mongoose.model("Profile", schema);
