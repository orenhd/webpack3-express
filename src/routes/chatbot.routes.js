import express from 'express';

import chatbot_controller from '../controllers/chatbot.controller';

const router = express.Router();

// define routes

router.get('/', (req, res) => {
    res.json({ message: 'hooray! welcome to our chatbot!' });   
});

router.get('/webhook', (req, res) => {
	if (req.query['hub.verify_token'] === process.env.VERIFY_TOKEN) {
      res.send(req.query['hub.challenge']);
    } else {
      res.send('Error, wrong validation token');    
    } 
});

router.post('/webhook', chatbot_controller.webhook);

/**
 * YouTube API Test Routes
 **/
 
router.get('/youtube_search', chatbot_controller.youtube_search);
	
module.exports = router;
	