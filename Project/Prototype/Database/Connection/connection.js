const mongoose = require("mongoose");

// mongodb server
const uri = "mongodb+srv://jonaverd:q78h7zo4zkHYpQp@dialogflowcluster.oujgv.mongodb.net/OdiseoDB?retryWrites=true&w=majority";

mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .catch(err => console.log(err));

const db = mongoose.connection;

db.once("open", _ => {
  console.log("Database is connected to:", uri);
});

// to test the error stop mongod
db.on("error", err => {
  console.log(err);
});