const express = require('express');
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();

app.use(express.json());

app.listen(3001, () => {
  console.log('Server running on port 3001');
});

// Create a new timer
app.post('/timers', async (req, res) => {
  const { user, startTime, endTime, duration } = req.body;
  try {
    const timer = await prisma.timer.create({
      data: {
        user,
        startTime: new Date(startTime),
        endTime: endTime ? new Date(endTime) : null,
        duration,
      },
    });
    res.status(201).json(timer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all timers
app.get('/timers', async (req, res) => {
  try {
    const timers = await prisma.timer.findMany();
    res.json(timers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a single timer by ID
app.get('/timers/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const timer = await prisma.timer.findUnique({
      where: { id },
    });
    if (timer) {
      res.json(timer);
    } else {
      res.status(404).json({ error: 'Timer not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a timer by ID
app.put('/timers/:id', async (req, res) => {
  const { id } = req.params;
  const { user, startTime, endTime, duration } = req.body;
  try {
    const timer = await prisma.timer.update({
      where: { id },
      data: {
        user,
        startTime: new Date(startTime),
        endTime: endTime ? new Date(endTime) : null,
        duration,
      },
    });
    res.json(timer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a timer by ID
app.delete('/timers/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.timer.delete({
      where: { id },
    });
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
