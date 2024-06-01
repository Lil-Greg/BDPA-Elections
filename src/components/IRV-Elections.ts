import { useState } from "react";
import { GetBallots } from "../hooks/useElection";
import { GetBallotsResponse } from "../type";

export default function IRVElections(election_id:string){
    // -----ALGO-----
    // Count first choices
    // Find candidate with fewest votes within first places
    // Eliminate candidate
    // Add the vote to the 2nd placer

    const optionsResponse = GetBallots(election_id);
    const [similarName, setSimilarName] = useState<string>('');

    const countFirstPlacers = (options: GetBallotsResponse | undefined) => {
        // Double For Loop?
        const order = <string[]>[];
        const ballotsConverted = options?.ballots.map((ballots) => {
            return Object.keys(ballots.ranking);
        });
        console.log("Converted Ballots: ", ballotsConverted)
        const firstPlacers = ballotsConverted?.map((array) => {
            const spliced = array.splice(0,1)
            return spliced.toString();
        });
        firstPlacers?.map((placings, index) => {
            setSimilarName(placings);
            if(index > 0){
                if(similarName === firstPlacers[index-1] || firstPlacers[index-2]){
                    const findSimilarName = (value:string) => {return value === firstPlacers[index-1]}
                    order.find(findSimilarName)
                }
            }else{order.push(placings)}
        });
        console.log(order);
        return firstPlacers;
    }
    console.log('Testing Function: ', countFirstPlacers(optionsResponse));
}
// Confusion with finding the similar names
// and the logic flows with this.
// Also, confusion with array method usage.