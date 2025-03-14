const { SP1 } = require('succinct');

function verifyProof(proof) {
    const isValid = SP1.verifyProof({
        proof,
        statement: "The player’s score is valid",
    });

    return isValid;
}

module.exports = verifyProof;
