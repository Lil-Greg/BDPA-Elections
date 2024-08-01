import CPLElections from '../../algo/CPL-Elections';
import { ElectionStatus, GetBallotsResponse, GetSingleBallotType, User } from "../../type";
import IRVElections from "../../algo/IRV-Elections";
import CacheFetch from '../../hooks/useCacheFetch';
import StarElections from '../../algo/STAR-Elections';
import FptpElection from '../../algo/FPTP-Election';
const url = import.meta.env.VITE_API_URL;
const APIKey = import.meta.env.VITE_API_KEY;

const options = {
    method: "GET",
    headers: {
        'Authorization': APIKey,
        'content-type': 'application/json'
    }
};
export default async function DistributeCalls(election_id: string, user: User) {
    let winner;
    const { election, ballots, userVote } = await GetElectionData(election_id, user);
    const ballotsConverted = ballots.ballots.map((ballots) => {
        return Object.keys(ballots.ranking);
    }) || [];
    if (election?.type === 'irv') {
        const data = IRVElections(ballotsConverted);
        console.log(data);
        winner = data;
    } else if (election?.type === 'cpl') {
        const { CPL } = CPLElections(ballotsConverted, election.options);
        winner = CPL;
    }
    console.log("Star Winner", StarElections(ballots.ballots));
    console.log("FPP Winner", FptpElection(ballots.ballots))
    return { election, winner, userVote, ballotsResponse: ballots, ballots: ballotsConverted };
}
async function GetElectionData(election_id: string, user: User) {
    const election: ElectionStatus = await CacheFetch(`${url}elections/${election_id}`, options);
    const ballots: GetBallotsResponse = await CacheFetch(`${url}elections/${election_id}/ballots`, options);
    const userVote: GetSingleBallotType = await CacheFetch(`${url}elections/${election_id}/ballots/${user.username}`, options);
    return { election: election.election, ballots, userVote };
}