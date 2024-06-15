export default function CPLElections(ballots: string[][], candidates: string[]){
    const scores: {[key: string]:number} = candidates.reduce((acc, candidate) => (
        {...acc, [candidate]:0}
    ),{});

    for(let i = 0; i < candidates.length; i++){
        for(let j = i + 1; j < candidates.length; j++){
            const candidate1 = candidates[i];
            const candidate2 = candidates[j];
            let winsForOne = 0;
            let winsForTwo = 0;

            ballots.forEach((ballot) =>{
                if(ballot.indexOf(candidate1) < ballot.indexOf(candidate2)){
                    winsForOne ++;
                } else if(ballot.indexOf(candidate1) > ballot.indexOf(candidate2)){
                    winsForTwo ++;
                }
                // In case of a tie, neither candidate's score change s
            })
            if(winsForOne > winsForTwo){
                scores[candidate1] += 1;
                scores[candidate2] -= 1;
            }else if(winForOne < winForTwo){
                scores[candidate1] -= 1;
                scores[candidate2] += 1;
            }
        }
    }
    const winner = candidates.reduce((currentWinner, candidate) => (
        scores[currentWinner] > scores[candidate] ? currentWinner : candidate
    ))

    console.log(winner);
}