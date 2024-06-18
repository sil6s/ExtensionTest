const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const prisma = new PrismaClient();

app.get('/', (req, res) => {
  res.send('Hello');
});

app.post('/record-time', async (req, res) => {
  try {
    const { username, issueName, type, time } = req.body;

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

    // Generate a sessionName (assuming session is per user-issue combination)
    const sessionName = `${user.id}_${issue.id}`;

    // Find or create the Session
    let session = await prisma.session.upsert({
      where: { sessionName },
      update: {},
      create: { sessionName },
    });

    if (type === 'start') {
      // Create TimerData for start time
      await prisma.timerData.create({
        data: {
          userId: user.id,
          issueId: issue.id,
          sessionId: session.id,
          startTime: new Date(time),
          stopTime: null, // Initially set stopTime as null for active session
        },
      });

      res.status(201).json({ message: 'Start time recorded successfully' });
    } else if (type === 'pause') {
      // Find the last active session for the user-issue combination
      const lastSession = await prisma.timerData.findFirst({
        where: {
          userId: user.id,
          issueId: issue.id,
          stopTime: null, // Find the session with no stop time (active session)
        },
        orderBy: {
          startTime: 'desc', // Order by startTime in descending order
        },
      });

      if (lastSession) {
        // Update TimerData for stop time in the last session
        await prisma.timerData.update({
          where: {
            id: lastSession.id,
          },
          data: {
            stopTime: new Date(time),
          },
        });

        res.status(200).json({ message: 'Pause time recorded successfully' });
      } else {
        res.status(404).json({ error: 'No active session found to record pause time' });
      }
    } else {
      res.status(400).json({ error: 'Invalid request: unknown type' });
    }
  } catch (error) {
    console.error('Error recording time:', error);
    res.status(500).json({ error: 'Failed to record time' });
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