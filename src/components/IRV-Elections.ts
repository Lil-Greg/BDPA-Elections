import { GetBallots } from "../hooks/useElection";

export default async function IRVElections(election_id:string){
    // -----ALGO-----
    // Count first choices
    // Find candidate with fewest votes within first places
    // Eliminate candidate
    // Add the vote to the 2nd placer

    const optionsResponse = await GetBallots(election_id);
    let ballotsConverted = optionsResponse?.ballots.map((ballots) => {
        return Object.keys(ballots.ranking);
    }) || [];

    const countFirstPlacers = () => {
        const firstPlaceCount: { [x: string]: number; } = {};
        for(const ballot of ballotsConverted){
            const firstChoice = ballot[0];
            if(firstPlaceCount[firstChoice]){
                firstPlaceCount[firstChoice] += 1;// Increases value if the same name in object
            }else{
                firstPlaceCount[firstChoice] = 1;// Sets new value if not the same name in object
            }
        }    
        return firstPlaceCount;// candidate name: number of first place votes.    
    }
    const findCandidateWithLeastVotes = (count: { [x: string]: number; }):string => {
        let fewestVotes = Infinity;
        let candidateWithFewest = '';

        for(const candidate in count){
            if(count[candidate] < fewestVotes){
                fewestVotes = count[candidate];
                candidateWithFewest = candidate;
            }
        }
        return candidateWithFewest;
    }
    const eliminateCandidateWithFewest = (ballots:string[][], candidateToElim:string) => {
        return ballots.map((ballot) => {
            return ballot.filter((candidate) => {
                return candidate !== candidateToElim;
            });
        });
    }

    // eslint-disable-next-line no-constant-condition
    while(true){
        const count = countFirstPlacers();
        for(const candidate in count){ // Checking each candidate to see if they have more than 50%
            if(count[candidate] > Math.floor(ballotsConverted.length / 2)){
                return candidate;
            }
        }
        ballotsConverted = eliminateCandidateWithFewest(ballotsConverted, findCandidateWithLeastVotes(count));
    }
}
// Confusion with finding the similar names
// and the logic flows with this.
// Also, confusion with array method usage.