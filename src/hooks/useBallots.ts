import { useQuery } from "@tanstack/react-query";
import { GetBallotsResponse, GetSingleBallotType } from "../type";
import CacheFetch from "./useCacheFetch";
const url = import.meta.env.API_URL;
const APIKey = import.meta.env.API_KEY;

const options = {
    method:"GET",
    headers:{
        'Authorization': APIKey,
        'content-type':'application/json'
    }
};

export function GetBallots(election_id:string):GetBallotsResponse | undefined{
    const {data, error} = useQuery<GetBallotsResponse>({
        queryKey:["GetBallots"],
        queryFn: async () => {
            return await CacheFetch(`${url}elections/${election_id}/ballots`, options, "GetBallots");
        }
    });
    if(error !== null){
    console.warn("Error With GetBallots: ", error);
    }
    return data;
};
export function GetSingleBallot(election_id:string, user_id:string): GetSingleBallotType | undefined{
    const {data, error} = useQuery({
        queryKey:["GetSingleBallot"],
        queryFn: async () => {
            const data: GetSingleBallotType = await CacheFetch(`${url}elections/${election_id}/ballots/${user_id}`, options, "GetSingleBallot");
            return data;
        },
    });
    if(error !== null){
        console.warn("Error with GetSingleBallot: ", error);
    };
    return data;
};
export function MakeVote(election_id:string, voter_id:string, ranking:object){
    const puttingRankingInObject = {ranking};
    const optionsMakeVote = {
        method:"PUT",
        headers:{
            "Authorization": APIKey,
            "content-type":"application/json"
        },
        body:JSON.stringify(puttingRankingInObject)
    };
    const {data, error} = useQuery({
        queryKey:["MakeVote"],
        queryFn: async () => await CacheFetch(`${url}elections/${election_id}/ballots/${voter_id}`, optionsMakeVote, "MakeVote")
    });
    if(error !== null){
        console.warn("Error with making vote", error);
    };
    return data;
};
export default function EditVote(){

}