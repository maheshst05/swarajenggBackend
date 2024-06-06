const express = require("express");
const cors = require("cors");
const app = express();
app.use(express.json());
app.use(cors());

const connection = require("./db");
const userRouter = require("./routers/userRouter");

//userapi
app.use("/", userRouter);

app.listen(9090, async () => {
  try {
    await connection;
    console.log("connection established");
    console.log("server listening on 9090");
  } catch (error) {
    console.log(error);
  }
});
