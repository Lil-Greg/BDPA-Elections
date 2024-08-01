
// Function to calculate the winner
export default function FPTPElection(/*voters:Ballots[],*/ ballots: string[][]) {
    const voters = [
        { "voter_id": "1", "ranking": { "Biden": 1, "Warren": 2, "Sanders": 3 } },
        { "voter_id": "2", "ranking": { "Sanders": 1, "Biden": 2, "Warren": 3 } },
        { "voter_id": "3", "ranking": { "Warren": 1, "Sanders": 2, "Biden": 3 } },
        // Add more voter data as needed
    ];
    const voteCounts: {[key: string]:number} = ballots.reduce((acc, candidate) => (
        {...acc, [candidate]:0}
    ),{});

    voters.forEach(voter => {
        const firstPreference = Object.keys(voter.ranking).find(candidate => voter.ranking[candidate] === 1);
        if (firstPreference) {
            voteCounts[firstPreference] = (voteCounts[firstPreference] || 0) + 1;
        }
    });

    let winner = null;
    let maxVotes = 0;

    for (const [candidate, votes] of Object.entries(voteCounts)) {
        if (votes > maxVotes) {
            maxVotes = votes;
            winner = candidate;
        }
    }

    return winner;
}

// const winner = calculateWinner(voters);
// console.log(`The winner is: ${winner}`);