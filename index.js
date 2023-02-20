const express = require("express")
const mongoose = require("mongoose")
const cookieParser = require('cookie-parser');
const dotenv = require("dotenv")
dotenv.config()

const connectDB = require("./db/dbConn");
const urlRouter = require("./routes/urlRouter");
const port = process.env.PORT || 5000

const app = express()
connectDB();

app.set('view engine', 'ejs')
app.use(cookieParser());
app.use(express.urlencoded({extended:false}))

app.use('/', urlRouter);


mongoose.connection.once("open", () => {
    console.log("connected to DB");
    app.listen(port, () => {
      console.log(`connected to backend - ${port}`);
    });
  });
  //with this setup, app won't listen until mongoDB is cconnected. Helps avoid future error