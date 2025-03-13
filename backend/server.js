const express = require('express');
const path = require('path');
const generateProof = require('./generateProof');
const verifyProof = require('./verifyProof');

const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, '../frontend')));

// Endpoint to serve the game HTML
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Endpoint to generate ZK proof for the game score
app.post('/generate-proof', (req, res) => {
    // This is where you generate a ZK proof for the game score
    const score = req.body.score;  // You can send the score from the frontend
    const proof = generateProof(score);

    res.json({ proof });
});

// Endpoint to verify the ZK proof for the game score
app.post('/verify-proof', (req, res) => {
    const proof = req.body.proof;
    const isValid = verifyProof(proof);

    res.json({ isValid });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
