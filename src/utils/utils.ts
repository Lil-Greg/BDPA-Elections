import { Ballots } from "../type";

export function convertBallots(ballots: Ballots[]){
    const ballotsConverted = ballots.map((ballot) => {
        return Object.keys(ballot.ranking);
    });
    return ballotsConverted
}