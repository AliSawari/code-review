import express from "express";
import { Simulator } from "../models/Simulator";
import shouldHave from "../helpers/shouldHave";
import auth from '../middlewares/auth'

// var app = express();
// app.use(cors());

export var router = express.Router();

router.get("/api/simulator", auth, async (req, res) => {
  try {
    const simulators = await Simulator.find().lean();
    res.json({ simulators });
  } catch(e) {
    console.log(e);
    res.status(500).send();
  }
});

router.get("/api/simulator/:profile_id", auth, async (req, res) => {
  try {
    const { profile_id } = req.params;
    const simulators = await Simulator.find({ profile_id })
    res.json({simulators});
  } catch(e){
    console.log(e);
    res.status(500).send();
  }
});


router.post("/api/simulator", auth, async (req: any, res: any) => {
  let { results, notFounds } = shouldHave(req.body, ['dateRecorded', 'cryptocurrency', 'euros', 'price', 'quantity']);
  if (notFounds.length > 0) res.status(400).send(`Please provide the required arguments. ${notFounds.join(',')}`);
  else {
    try {
      const { dateRecorded, cryptocurrency, euros, price, quantity } = results;
      let newSim = await Simulator.create({ profile_id: req.user._id, dateRecorded, cryptocurrency, euros, price, quantity });
      res.json(newSim);
    } catch (e) {
      console.log(e);
      res.status(500).send();
    }
  }
});

router.put("/api/simulator", auth, async (req: any, res: any) => {
  let { results, notFounds } = shouldHave(req.body, ['id', 'dateRecorded', 'cryptocurrency', 'euros', 'price', 'quantity']);
  if (notFounds.length > 0) res.status(400).send(`Please provide the required arguments. ${notFounds.join(',')}`);
  else {
    try {
      const { id, dateRecorded, cryptocurrency, euros, price, quantity } = results;
      const theSim = await Simulator.findOne({_id: id});
      if(theSim){
        if(theSim.profile_id == req.user._id){
          const newSim = await Simulator.updateOne(theSim, { dateRecorded, cryptocurrency, euros, price, quantity });
          res.send("Document Updated Successfully");
        } else res.status(403).send("You do not have permission to update or delete this Simulator");
      } else res.status(400).send("Simulator Not Found, please provide the correct Simulator id");
    } catch (e) {
      console.log(e);
      res.status(500).send();
    }
  }
});

router.delete("/api/simulator", auth, async (req: any, res: any) => {
  let { results, notFounds } = shouldHave(req.body, ['id']);
  if (notFounds.length > 0) res.status(400).send(`Please provide the required arguments. ${notFounds.join(',')}`);
  else {
    try {
      const { id } = results;
      const theSim = await Simulator.findOne({_id: id});
      if(theSim){
        if(theSim.profile_id == req.user._id){
          let deleteRes = await Simulator.deleteOne({_id: id});
          res.send("Document Deleted Successfully");
        } else res.status(403).send("You do not have permission to update or delete this Simulator");
      } else res.status(400).send("Simulator Not Found, please provide the correct Simulator id");
    } catch (e) {
      console.log(e);
      res.status(500).send();
    }
  }
});

// router.post("/api/simulator/:profile_id", async (req, res) => {
//   var { profile_id } = req.params;
//   var newData = {
//     ...req.body,
//     profile_id,
//   };
//   console.log(newData);
//   var simulator = await Simulator.create(newData);
//   res.json(simulator);
// });
