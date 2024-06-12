const { MongoClient, ServerApiVersion } = require('mongodb');

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
    const fakeTimerData = [
      { name: "Timer 1", duration: 3600, startTime: new Date(), endTime: new Date() },
      { name: "Timer 2", duration: 1800, startTime: new Date(), endTime: new Date() },
      // Add more fake timer data as needed
    ];

    // Insert fake timer data into the collection
    const timerCollection = db.collection("timers"); // Replace "timers" with your desired collection name
    await timerCollection.insertMany(fakeTimerData);

    console.log("Fake timer data inserted successfully.");

    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    await client.close();
  }
}

run().catch(console.dir);
