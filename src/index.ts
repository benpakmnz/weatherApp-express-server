import mongoose from "mongoose";
import { app } from "./app";

const start = async () => {
  if (!process.env.MONGO_CRED) {
    throw new Error("MONOGO_URI must be defined");
  }

  try {
    await mongoose.connect(
      `mongodb+srv://${process.env.MONGO_CRED}@cluster0.ost0hzg.mongodb.net/?retryWrites=true&w=majority`
    );
    console.log("connected");
  } catch (err) {
    console.log(err);
  }

  app.listen(process.env.PORT || 5004, function () {
    console.log(`App listening on port: ${process.env.PORT || 5004}`);
  });
};

start();
