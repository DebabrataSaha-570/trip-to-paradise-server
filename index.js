const { MongoClient, ServerApiVersion } = require("mongodb");
const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 5005;
const fileUpload = require("express-fileupload");
require("dotenv").config();

// middleware
app.use(cors());
app.use(express.json());
app.use(fileUpload());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.4nku3dr.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    const database = client.db("trip_to_paradise");
    const serviceCollection = database.collection("services");

    //GET API
    app.get("/services", async (req, res) => {
      const cursor = serviceCollection.find({});
      const result = await cursor.toArray();
      res.json(result);
    });

    // POST API
    app.post("/services", async (req, res) => {
      const {
        placeName,
        placeDescription,
        placeDuration,
        price,
        dressCode,
        status,
      } = req.body;
      const picture = req.files.image;
      const pictureData = picture.data;
      const encodedPicture = pictureData.toString("base64");
      const imageBuffer = Buffer.from(encodedPicture, "base64");

      const service = {
        placeName,
        placeDescription,
        placeDuration,
        price,
        dressCode,
        status,
        image: imageBuffer,
      };

      const result = await serviceCollection.insertOne(service);
      console.log(result);
      res.json(result);
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Welcome to trip to paradise server");
});

app.listen(port, () => {
  console.log(`Trip to Paradise server listening at ${port}`);
});
