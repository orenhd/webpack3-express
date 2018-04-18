import express from 'express';

// sub-routes imports
import user from './user.routes';
import chatbot from './chatbot.routes';

const router = express.Router();

// test route to make sure everything is working
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });   
});

// use sub routes
router.use('/user', user);
router.use('/chatbot', chatbot);

export default router;