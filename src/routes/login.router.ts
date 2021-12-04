import express from 'express';
import { Profile } from '../models/Profile';
import { API_SECRET_KEY } from '../config';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import shouldHave from "../helpers/shouldHave";
import validateEmail from '../helpers/validateEmail';

export const router = express.Router();

router.post('/api/login', async (req, res) => {
  const { results, notFounds } = shouldHave(req.body, ['email', 'password']);
  if (notFounds.length > 0) res.status(400).send(`Please provide the required arguments. ${notFounds.join(',')}`);
  else {
    try {
      const { email, password } = results;
      if (validateEmail(email)) {
        const theUser = await Profile.findOne({ email }).lean();
        if (theUser) {
          const isMatch = await bcrypt.compare(password, theUser.password);
          if (isMatch) {
            const token = jwt.sign(theUser, API_SECRET_KEY);
            res.json({ token });
          } else res.status(400).send("Incorrect Password");
        } else {
          res.status(400).send("User Not found");
        }
      } else res.status(400).send("Please provide a valid email address");
    } catch (e) {
      console.log(e);
      res.status(500).send()
    }
  }
})