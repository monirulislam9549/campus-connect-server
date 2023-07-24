const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.port || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.skg6sgn.mongodb.net/?retryWrites=true&w=majority`;

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
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const collegeCollection = client
      .db("collegeCollection")
      .collection("colleges");

    const admissionCollection = client
      .db("collegeCollection")
      .collection("admission");

    const usersCollection = client.db("collegeCollection").collection("users");

    // all user
    app.get("/users", async (req, res) => {
      const result = await usersCollection.find().toArray();
      console.log(result);
      res.send(result);
    });

    app.post("/users", async (req, res) => {
      const user = req.body;
      console.log(user);
      const query = { email: user.email };
      const existingUser = await usersCollection.findOne(query);
      if (existingUser) {
        return res.send({ message: "User Already exists" });
      }
      const result = await usersCollection.insertOne(user);
      res.send(result);
    });

    //   show all college card
    app.get("/colleges", async (req, res) => {
      const result = await collegeCollection.find().toArray();
      res.send(result);
    });

    // create = post
    app.post("/admission", async (req, res) => {
      const data = req.body;
      const result = await admissionCollection.insertOne(data);
      res.send(result);
    });

    // details
    app.get("/details/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const result = await collegeCollection.findOne(filter);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Campus connect is running");
});

app.listen(port, () => {
  console.log(`campus connect is running on port:${port}`);
});
