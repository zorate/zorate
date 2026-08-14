const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

router.get('/', async (req, res) => {
  const dbState = mongoose.connection.readyState;
  const dbStatus = dbState === 1 ? 'connected' : dbState === 2 ? 'connecting' : 'disconnected';

  res.json({
    status: 'operational',
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime()),
    services: {
      api:      { status: 'online' },
      database: { status: dbStatus },
      media:    { status: dbState === 1 ? 'online' : 'degraded' },
    },
  });
});

module.exports = router;