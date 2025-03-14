const { SP1 } = require('succinct');

function generateProof(score) {
    const proof = SP1.generateProof({
        input: score,
        statement: "The player’s score is valid",
    });

    return proof;
}

module.exports = generateProof;
