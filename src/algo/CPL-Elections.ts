export default function CPLElections(ballots: string[][], candidates: string[]){
    const scores: {[key: string]:number} = candidates.reduce((acc, candidate) => (
        {...acc, [candidate]:0}
    ),{});
    for(let i = 0; i < candidates.length; i++){
        for(let j = i + 1; j < candidates.length; j++){
            const candidate1 = candidates[i];
            const candidate2 = candidates[j];
            let winForOne = 0;
            let winForTwo = 0;

            ballots.forEach((ballot) => {
                if(ballot.indexOf(candidate1) < ballot.indexOf(candidate2)){
                    winForOne++;
                } else if(ballot.indexOf(candidate1) > ballot.indexOf(candidate2)){
                    winForTwo++;
                }
                // In Case of a tie, neither candidate's score changes
            });
            if(winForOne > winForTwo){
                scores[candidate1] += 1;
                scores[candidate2] -= 1;
            }else if (winForOne < winForTwo){
                scores[candidate1] -= 1;
                scores[candidate2] += 1;
            }
        }
    }
    const winner = candidates.reduce((currentWinner, candidate) => (
        scores[currentWinner] > scores[candidate] ? currentWinner : candidate
    ));
    return{CPL:winner}
}
