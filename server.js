const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const { v4: uuidv4 } = require('uuid'); // Import uuidv4 from uuid package

const app = express();
app.use(bodyParser.json());
app.use(cors());

const prisma = new PrismaClient();

app.get('/', (req, res) => {
  res.send('Hello');
});

app.post('/data', async (req, res) => {
  try {
    const { username, issueName, startTime } = req.body;
    const sessionName = uuidv4(); // Generate a random UUID for sessionName

    // Find or create the User
    let user = await prisma.user.upsert({
      where: { username },
      update: {},
      create: { username },
    });

    // Find or create the Issue
    let issue = await prisma.issue.upsert({
      where: { issueName },
      update: {},
      create: { issueName },
    });

    // Find or create the Session
    let session = await prisma.session.upsert({
      where: { sessionName },
      update: {},
      create: { sessionName },
    });

    // Create the TimerData
    const timerData = await prisma.timerData.create({
      data: {
        userId: user.id,
        issueId: issue.id,
        sessionId: session.id,
        startTime: new Date(startTime),
      },
    });

    res.json(timerData);
  } catch (error) {
    console.error('Error saving data:', error);
    res.status(500).json({ error: 'Failed to save data' });
  }
});

// Start the server
const PORT = 3100;
app.listen(PORT, async () => {
  try {
    await prisma.$connect();
    console.log('Connected to Prisma Client');
  } catch (error) {
    console.error('Error connecting to Prisma Client:', error);
  }
  console.log(`Server is listening on port ${PORT}`);
});
