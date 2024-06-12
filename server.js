const { MongoClient, ServerApiVersion } = require('mongodb');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require(`cors`)

const app = express();
app.use(bodyParser.json());
app.use(cors({ origin:  `*`}))

const uri = "mongodb+srv://currysc:LA0uU0hUSuY5CNsN@itscpms.pm9pufe.mongodb.net/?retryWrites=true&w=majority&appName=ITSCPMS";
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();

    const db = client.db("myDatabase"); // Replace "myDatabase" with your actual database name

    // Define timer schema
    const timerSchema = {
      name: "string",
      duration: "number",
      startTime: "date",
      endTime: "date"
      // Add more fields as needed
    };

    // Insert fake timer data
    const startTime = new Date(); // Get the current start time
    const fakeTimerData = [
      { name: "Timer 1 Test", duration: 3600, startTime: startTime, endTime: null },
      { name: "Timer 2 Test", duration: 1800, startTime: startTime, endTime: null },
      // Add more fake timer data as needed
    ];

    // Insert fake timer data into the collection
    const timerCollection = db.collection("timers"); 
    await timerCollection.insertMany(fakeTimerData);

    console.log("Fake timer data inserted successfully.");

    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    await client.close();
  }
}

app.get(`/`, (req, res) => {
  res.send(`hello`);
})

app.post('/username', async (req, res) => {
  try {
    const { username } = req.body;
    // Save the username to MongoDB using Prisma
    const savedUsername = await client.db("myDatabase").collection("users").insertOne({ username });
    res.json(savedUsername);
  } catch (error) {
    console.error('Error saving username:', error);
    res.status(500).json({ error: 'Failed to save username' });
  }
});

app.post('/time', async (req, res) => {
  try {
    const { username, time } = req.body;
    // Save the username to MongoDB using Prisma
    const dataToSave = { name: username, duration: 3600, startTime: time, endTime: null }
    const savedUsername = await client.db("myDatabase").collection("timers").insertOne({ username });
    res.json(savedUsername);
  } catch (error) {
    console.error('Error saving username:', error);
    res.status(500).json({ error: 'Failed to save username' });
  }
});

// Start the server
const PORT = 3100;
app.listen(PORT, () => {
  // await run().catch(console.dir);
  console.log(`Server is listening on port ${PORT}`);
});
