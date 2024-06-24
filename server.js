const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const prisma = new PrismaClient();

// Endpoint to greet
app.get('/', (req, res) => {
  res.send('Hello');
});

// Endpoint to record start and pause times
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
      create: { sessionName, userId: user.id, issueId: issue.id, durations: [] },
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
        const stopTime = new Date(time);
        await prisma.timerData.update({
          where: {
            id: lastSession.id,
          },
          data: {
            stopTime,
          },
        });

        // Calculate session duration
        const sessionDuration = Math.round((stopTime - new Date(lastSession.startTime)) / 1000); // Duration in seconds

        // Update Session durations array
        await prisma.session.update({
          where: { id: session.id },
          data: {
            durations: {
              push: sessionDuration,
            },
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

// Endpoint to fetch issues and related data
app.get('/issues', async (req, res) => {
  try {
    const issues = await prisma.issue.findMany({
      include: {
        sessions: {
          include: {
            user: true,
            timerData: true
          }
        }
      }
    });

    // Format the response data
    const formattedIssues = issues.map(issue => ({
      issueName: issue.issueName,
      sessions: issue.sessions.map(session => ({
        username: session.user.username,
        totalDuration: session.timerData.reduce((total, timer) => {
          if (timer.stopTime) {
            return total + (new Date(timer.stopTime) - new Date(timer.startTime));
          }
          return total;
        }, 0)
      }))
    }));

    res.status(200).json(formattedIssues);
  } catch (error) {
    console.error('Error fetching issues:', error);
    res.status(500).json({ error: 'Failed to fetch issues' });
  }
});

// Endpoint to fetch users and related data
app.get('/users', async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      include: {
        sessions: {
          include: {
            issue: true,
            timerData: true
          }
        }
      }
    });

    // Format the response data
    const formattedUsers = users.map(user => ({
      username: user.username,
      issues: user.sessions.map(session => ({
        issueName: session.issue.issueName,
        totalDuration: session.timerData.reduce((total, timer) => {
          if (timer.stopTime) {
            return total + (new Date(timer.stopTime) - new Date(timer.startTime));
          }
          return total;
        }, 0)
      }))
    }));

    res.status(200).json(formattedUsers);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Endpoint to fetch issues joined on users
app.get('/issues-joined-on-users', async (req, res) => {
  try {
    const issues = await prisma.issue.findMany({
      include: {
        sessions: {
          include: {
            user: true,
            timerData: true
          }
        }
      }
    });

    // Format the response data
    const formattedData = issues.flatMap(issue =>
      issue.sessions.map(session => ({
        issueName: issue.issueName,
        username: session.user.username,
        totalDuration: session.timerData.reduce((total, timer) => {
          if (timer.stopTime) {
            return total + (new Date(timer.stopTime) - new Date(timer.startTime));
          }
          return total;
        }, 0)
      }))
    );

    res.status(200).json(formattedData);
  } catch (error) {
    console.error('Error fetching issues joined on users:', error);
    res.status(500).json({ error: 'Failed to fetch issues joined on users' });
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
