const { handleAuthCallback } = require('../controllers/ClientController');

const router = require('express').Router();
router.get('/auth/callback', handleAuthCallback);


module.exports = router;