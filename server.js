const { PrismaClient } = require('@prisma/client');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors({ origin: '*' }));

const prisma = new PrismaClient();

app.get('/', (req, res) => {
  res.send('hello');
});

app.post('/data', async (req, res) => {
  try {
    const { username, startTime, issueName } = req.body;
    const data = await prisma.timerData.create({
      data: {
        username,
        startTime: new Date(startTime),
        issueName,
      },
    });
    res.json(data);
  } catch (error) {
    console.error('Error saving data:', error);
    res.status(500).json({ error: 'Failed to save data' });
  }
});

// Start the server
const PORT = 3100;
app.listen(PORT, async () => {
  try {
    await prisma.$connect({
      datasources: {
        db: {
          url: "mongodb+srv://currysc:LA0uU0hUSuY5CNsN@itscpms.pm9pufe.mongodb.net",
        },
      },
    });
    console.log('Connected to MongoDB successfully');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
  console.log(`Server is listening on port ${PORT}`);
});
