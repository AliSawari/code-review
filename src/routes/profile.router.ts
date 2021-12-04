import express from "express";
import { Profile } from "../models/Profile";
import auth from '../middlewares/auth';
import bcrypt from 'bcrypt';
import shouldHave from "../helpers/shouldHave";
import validateEmail from "../helpers/validateEmail";

export var router = express.Router();

router.get("/api/profile", auth, async (req, res) => {
  var profile = await Profile.find().lean();
  res.json({ profile });
});

router.post("/api/profile", async (req, res) => {
  let { results, notFounds } = shouldHave(req.body, ['email', 'name', 'nickname', 'password', 'capital', 'divisa', 'prefered_cryptocurrency']);
  if (notFounds.length) res.status(400).send(`Please provide the required arguments. ${notFounds.join(',')}`)
  else {
    try {
      const { name, email, nickname, password, capital, divisa, prefered_cryptocurrency } = results;
      if (validateEmail(email)) {
        let profile = await Profile.findOne({
          $or: [{ email }, { nickname }],
        }).exec();

        if (!profile) {
          const salt = await bcrypt.genSalt();
          const hashed = await bcrypt.hash(password, salt);
          profile = await Profile.create({ name, email, nickname, password: hashed, capital, divisa, prefered_cryptocurrency});
          res.json(profile);
        } else {
          res.send('there is already a profile with this email or nickname, please choose another one');
        }
      } else res.status(400).send("Please provide a valid email address");
    } catch (e) {
      console.log(e);
      res.status(500).send();
    }
  }
});