import { Ballots } from "../type";

// Function to calculate the winner
type Rank = {
    [candidate: string]: number;
}
export default function FptpElection(voters: Ballots[]) {// Use ballots.ballot
    // 
    // const voters = [
    //     { "voter_id": "1", "ranking": { "Biden": 1, "Warren": 2, "Sanders": 3 } },
    //     { "voter_id": "2", "ranking": { "Sanders": 1, "Biden": 2, "Warren": 3 } },
    //     { "voter_id": "3", "ranking": { "Warren": 1, "Sanders": 2, "Biden": 3 } },
    //     // Add more voter data as needed
    // ];

    const voteCounts: Rank = {};
    const reduced = voters.reduce((acc, candidate) => (
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

/*
// For Candidate, use 

type Candidate = {
    name: string;
    votes: number;
};

type Voter = {
    voter_id: string;
    ranking: { [key: string]: number };
};

// Function to count the votes

////////////////// MAIN //////////////////

function countVotes(voters: Voter[], candidates: Candidate[]): Candidate {
    // Initialize vote counts
    candidates.forEach(candidate => candidate.votes = 0);

    // First round: count the first-choice votes
    voters.forEach(voter => {
        const firstChoice = Object.keys(voter.ranking).find(candidateName => voter.ranking[candidateName] === 1);
        if (firstChoice) {
            const candidate = candidates.find(c => c.name === firstChoice);
            if (candidate) {
                candidate.votes += 1;
            }
        }
    });

    // Find the candidate with the most votes
    let winner: Candidate = candidates[0];
    candidates.forEach(candidate => {
        if (candidate.votes > winner.votes) {
            winner = candidate;
        }
    });

    return winner;
}

//////////////// END ////////////////

// Example usage:
const voters: Voter[] = [
    { voter_id: "1", ranking: { "Biden": 1, "Warren": 2, "Sanders": 3 } },
    { voter_id: "2", ranking: { "Sanders": 1, "Biden": 2, "Warren": 3 } },
    { voter_id: "3", ranking: { "Warren": 1, "Sanders": 2, "Biden": 3 } },
    // Add more voter data as needed
];

const candidates: Candidate[] = [
    { name: "Biden", votes: 0 },
    { name: "Warren", votes: 0 },
    { name: "Sanders", votes: 0 },
];

const winner = countVotes(voters, candidates);
console.log(`The winner is ${winner.name} with ${winner.votes} votes.`);

*/

// const winner = calculateWinner(voters);
// console.log(`The winner is: ${winner}`);