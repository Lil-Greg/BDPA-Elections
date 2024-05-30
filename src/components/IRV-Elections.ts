import { GetBallots } from "../hooks/useElection";

export default function IRVElections(election_id:string){
    // -----ALGO-----
    // Count first choices
    // Find candidate with fewest votes
    // Eliminate candidate

    const optionsResponse = GetBallots(election_id);
    const optionBallots = optionsResponse?.ballots;

    const convertedBallots = optionBallots?.map((ballots)=>{
        return Object.keys(ballots.ranking);
    });
    console.log(convertedBallots);

}