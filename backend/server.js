const express = require('express');
const path = require('path');
const generateProof = require('./generateProof');
const verifyProof = require('./verifyProof');

const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, '../dist')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
});

app.post('/generate-proof', (req, res) => {
    const score = req.body.score;
    const proof = generateProof(score);
    res.json({ proof });
});

app.post('/verify-proof', (req, res) => {
    const proof = req.body.proof;
    const isValid = verifyProof(proof);
    res.json({ isValid });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
