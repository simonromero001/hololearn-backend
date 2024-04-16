const express = require('express');
const router = express.Router();
const Video = require('../models/Video');
const HttpStatus = require('http-status-codes');  // npm install http-status-codes

// Get a random video
router.get('/random-video', async (req, res) => {
  try {
    const video = await Video.aggregate([{ $sample: { size: 1 } }]);
    if (!video.length) {
      return res.status(HttpStatus.NOT_FOUND).send('No videos found');
    }
    res.json(video[0]);
  } catch (err) {
    console.error('Random video fetch error:', err);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send('Server error');
  }
});

// Check answer
router.post('/videos/:id/guess', async (req, res) => {
  try {
    const { guess } = req.body;
    if (!guess || typeof guess !== 'string') {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: 'Invalid guess provided' });
    }
    const video = await Video.findById(req.params.id);

    if (!video) {
      return res.status(HttpStatus.NOT_FOUND).json({ message: 'Video not found' });
    }

    const isCorrect = video.word.toLowerCase() === guess.toLowerCase();
    res.json({ correct: isCorrect });
  } catch (err) {
    console.error('Guess check error:', err);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Server error' });
  }
});

module.exports = router;
