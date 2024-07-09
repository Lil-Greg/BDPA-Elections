import CPLElections from '../../algo/CPL-Elections';
import { Election, GetBallotsResponse, GetSingleBallotType, User } from "../../type";
import IRVElections from "../../algo/IRV-Elections";
import { useState } from 'react';
import { GetBallots, GetSingleBallot } from '../../hooks/useBallots';

export default function DistributeCalls(election: Election, user: User) {
    const [ballot, setBallot] = useState<GetSingleBallotType | undefined>();
    const ballotCall = GetSingleBallot(election.election_id, user.username);
    let winner;

    if (election !== undefined) {
        setBallot(ballotCall);
        const optionsResponse: GetBallotsResponse | undefined = GetBallots(election.election_id);
        if (optionsResponse !== undefined) {
            const ballotsConverted = optionsResponse?.ballots.map((ballots) => {
                return Object.keys(ballots.ranking);
            }) || [];
            if (election?.type === 'irv') {
                const data = IRVElections(ballotsConverted);
                winner = data;
            } else if (election?.type === 'cpl') {
                const { CPL } = CPLElections(ballotsConverted, election.options);
                winner = CPL;
            }
        }
    }
    return { ballot, winner };
}