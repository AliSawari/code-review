import mongoose from "mongoose";
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
    nickname: "Ali",
    capital: `345`,
    divisa: `yes`,
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
      cryptocurrency: `ETH`,
      divisa: `String`,
      Crypto_price_start: `1`,
      Crypto_price_check: `4000`,
    });
    await simulator.save();

    const favorite = new Favorite({
      profile_id: result._id,
      name: `MyFav`,
      favorite1: `ETH`,
      favorite2: `ADA`,
      favorite3: `DOT`,
    });
    await favorite.save();

    console.log("created dummy data for testing out the server")

  })

  
}).catch(e => console.log(e))





