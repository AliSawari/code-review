import express from "express";
import auth from "../middlewares/auth";
import { Favorite } from "../models/Favorite";
import shouldHave from "../helpers/shouldHave";

export const router = express.Router();

router.get("/api/favorite", auth, async (req, res) => {
  try {
    const favorites = await Favorite.find().lean();
    res.json({ favorites });
  } catch (e) {
    console.log(e);
    res.status(500).send();
  }
});

router.get("/api/favorite/:profile_id", auth, async (req, res) => {
  try {
    const { profile_id } = req.params;
    const favorites = await Favorite.find({ profile_id });
    res.json({ favorites });
  } catch (e) {
    console.log(e);
    res.status(500).send();
  }
});


router.post('/api/favorite/', auth, async (req: any, res: any) => {
  let { results, notFounds } = shouldHave(req.body, ['name', 'favorite1', 'favorite2', 'favorite3']);
  if (notFounds.length > 0) res.status(400).send(`Please provide the required arguments. ${notFounds.join(',')}`);
  else {
    try {
      const { name, favorite1, favorite2, favorite3 } = results;
      const newFav = await Favorite.create({
        profile_id: req.user._id,
        name,
        favorite1,
        favorite2,
        favorite3
      });
      res.json(newFav);
    } catch (e) {
      console.log(e);
      res.status(500).send();
    }
  }
});


router.put('/api/favorite/', auth, async (req: any, res: any) => {
  let { results, notFounds } = shouldHave(req.body, ['id', 'name', 'favorite1', 'favorite2', 'favorite3']);
  if (notFounds.length > 0) res.status(400).send(`Please provide the required arguments. ${notFounds.join(',')}`);
  else {
    try {
      const { id, name, favorite1, favorite2, favorite3 } = results;
      const theFav = await Favorite.findOne({_id: id});
      if(theFav){
        if(theFav.profile_id == req.user._id){
          const newFav = await Favorite.updateOne(theFav, { name, favorite1, favorite2, favorite3 });
          res.send("Document Updated Successfully");
        } else res.status(403).send("You do not have permission to update or delete this Favorite");
      } else res.status(400).send("Favorite Not Found, please provide the correct Favorite id");
    } catch (e) {
      console.log(e);
      res.status(500).send();
    }
  }
});


router.delete("/api/favorite", auth, async (req: any, res: any) => {
  let { results, notFounds } = shouldHave(req.body, ['id']);
  if (notFounds.length > 0) res.status(400).send(`Please provide the required arguments. ${notFounds.join(',')}`);
  else {
    try {
      const { id } = results;
      const theFav = await Favorite.findOne({_id: id});
      if(theFav){
        if(theFav.profile_id == req.user._id){
          let deleteRes = await Favorite.deleteOne({_id: id});
          res.send("Document Deleted Successfully");
        } else res.status(403).send("You do not have permission to update or delete this Favorite");
      } else res.status(400).send("Favorite Not Found, please provide the correct Favorite id");
    } catch (e) {
      console.log(e);
      res.status(500).send();
    }
  }
});