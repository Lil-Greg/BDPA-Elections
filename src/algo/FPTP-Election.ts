import { Ballots } from "../type";

export default function FptpElection(voters: Ballots[]) {
    const voteCounts = {};

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