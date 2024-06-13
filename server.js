const { MongoClient, ServerApiVersion } = require('mongodb');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors({ origin: '*' }));

const uri = "mongodb+srv://currysc:LA0uU0hUSuY5CNsN@itscpms.pm9pufe.mongodb.net/timerData?retryWrites=true&w=majority&appName=ITSCPMS";
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

    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
  }
}

app.get('/', (req, res) => {
  res.send('hello');
});

app.post('/data', async (req, res) => {
  try {
    const { username, startTime } = req.body;
    const dataToSave = { username, startTime: new Date(startTime) };
    const savedData = await client.db("timerData").collection("timerData").insertOne(dataToSave);
    res.json(savedData);
  } catch (error) {
    console.error('Error saving data:', error);
    res.status(500).json({ error: 'Failed to save data' });
  }
});

// Start the server
const PORT = 3100;
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
  run().catch(console.error);
});
