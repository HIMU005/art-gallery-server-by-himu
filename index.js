const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

// const uri = "mongodb://localhost:27017";

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.6xa5uzm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    const craftCollection = client.db("craft").collection("crafts");

    app.post("/crafts", async (req, res) => {
      const newCraft = req.body;
      console.log(newCraft);
      const result = await craftCollection.insertOne(newCraft);
      res.send(result);
    });

    app.get("/crafts", async (req, res) => {
      const cursor = craftCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/crafts/:email", async (req, res) => {
      const email = req.params.email;
      const cursor = craftCollection.find({ email });
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/crafts-info/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await craftCollection.findOne(query);
      res.send(result);
    });

    app.put("/crafts-info/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateData = req.body;
      const updateDatabase = {
        $set: {
          email: updateData.email,
          image: updateData.image,
          item_name: updateData.item_name,
          subcategory_Name: updateData.subcategory_Name,
          short_description: updateData.short_description,
          price: updateData.price,
          rating: updateData.rating,
          customization: updateData.customization,
          processing_time: updateData.processing_time,
          stockStatus: updateData.stockStatus,
        },
      };
      const result = await craftCollection.updateOne(
        filter,
        updateDatabase,
        options
      );
      res.send(result);
    });

    app.delete("/crafts-info/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await craftCollection.deleteOne(query);
      res.send(result);
    });

    // await client.db("admin").command({ ping: 1 });
    // console.log(
    //   "Pinged your deployment. You successfully connected to MongoDB!"
    // );
  } finally {
    // Ensures that the client will close when you finish/error
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("YAH!!!!!!!!   Server is on");
});

app.listen(port, () => {
  console.log("server is running on", port);
});
