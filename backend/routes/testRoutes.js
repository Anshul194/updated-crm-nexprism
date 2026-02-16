const express = require('express');
const router = express.Router();
const geoip = require('geoip-lite');

// Test endpoint to check IP and location
router.get('/check-ip', (req, res) => {
    const ip = req.ip || req.connection.remoteAddress || req.headers['x-forwarded-for'];
    const cleanIP = ip.replace(/^::ffff:/, '');

    const geo = geoip.lookup(cleanIP);

    res.json({
        original_ip: ip,
        cleaned_ip: cleanIP,
        geoip_result: geo,
        headers: {
            'x-forwarded-for': req.headers['x-forwarded-for'],
            'x-real-ip': req.headers['x-real-ip'],
            'user-agent': req.headers['user-agent']
        }
    });
});

module.exports = router;
