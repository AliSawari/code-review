import mongoose from "mongoose";
import _ from "lodash";
import { Profile } from "../models/Profile";
import { Simulator } from "../models/Simulator";
import { Favorite } from "../models/Favorite";
import { DBURL } from "../config";


mongoose.connect(DBURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then((conn) => {

  console.log("one");

  const profile = new Profile({
    name: `Ali`,
    email: `ali@ali.com`,
    capital: `345`,
    divisa: `sure`,
    prefered_cryptocurrency: `ETH`,
    password: '123456789'
  });

  profile.save().then(async (result) => {

    console.log("two");

    const simulator = new Simulator({
      profile_id: result._id,
      name: `String`,
      start_date: `01/05/2021`,
      check_date: `01/05/2021`,
      cryptocurrency: `String`,
      divisa: `String`,
      Crypto_price_start: `123`,
      Crypto_price_check: `123`,
    });
    await simulator.save();

    const favorite = new Favorite({
      profile_id: result._id,
      name: `String`,
      favorite1: `String`,
      favorite2: `String`,
      favorite3: `String`,
    });
    await favorite.save();

    console.log("created dummy data for testing out the server")

  })

  
}).catch(e => console.log(e))





