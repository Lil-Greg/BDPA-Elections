import { Ballots } from "../type";

type Ranking = { [candidate: string]: number };
type Voter = { voter_id: string; ranking: Ranking };

export default function StarElections(voters: Ballots[]): string{

// Function to calculate the total scores
function calculateScores(voters: Voter[]): { [candidate: string]: number } {
  const scores: { [candidate: string]: number } = {};

  voters.forEach((voter) => {
    Object.keys(voter.ranking).forEach((candidate) => {
      scores[candidate] = (scores[candidate] || 0) + voter.ranking[candidate];
    });
  });

  return scores;
}

// Function to find the top two candidates
function findTopTwoCandidates(scores: { [candidate: string]: number }): [string, string] {
  const sortedCandidates = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  return [sortedCandidates[0][0], sortedCandidates[1][0]];
}

// Function to conduct a runoff
function conductRunoff(voters: Voter[], candidate1: string, candidate2: string): string {
  let candidate1Votes = 0;
  let candidate2Votes = 0;

  voters.forEach((voter) => {
    if (voter.ranking[candidate1] > voter.ranking[candidate2]) {
      candidate1Votes++;
    } else if (voter.ranking[candidate2] > voter.ranking[candidate1]) {
      candidate2Votes++;
    }
  });

  return candidate1Votes > candidate2Votes ? candidate1 : candidate2;
}

// Main function to determine the winner
function determineWinner(voters: Voter[]): string {
  const scores = calculateScores(voters);
  const [topCandidate1, topCandidate2] = findTopTwoCandidates(scores);
  return conductRunoff(voters, topCandidate1, topCandidate2);
}

// Determine and log the winner
const winner = determineWinner(voters);
voters.map((voter, index) => console.log(`Voter Data, ${index}: `,voter));
console.log(`The winner is: ${winner}`);
return winner;
}
