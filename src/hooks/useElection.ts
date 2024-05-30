import { useEffect, useState } from "react";
import { Election, ElectionStatus, ElectionsStatus, GetBallotsResponse } from "../type.ts";
const url:string = import.meta.env.VITE_API_URL;
const APIKey:string = import.meta.env.VITE_API_KEY;
const options = {
    method:"GET",
    headers:{
        'Authorization': APIKey,
        'content-type':'application/json'
    }
}

export default function UseElection(){
    const [elections, setElections] = useState<ElectionsStatus>();
    useEffect(()=>{
        async function fetchData(){
            try{
                const res = await fetch(url + `elections`, options);
                const data:ElectionsStatus = await res.json();
                setElections(data);
            } catch(error){
                console.error(error);
            }
        }
        fetchData();
    },[]);
    return elections;
}

export function UseSingleElection(id:string){
    const [election, setElection] = useState<Election>();

    useEffect(()=>{
        async function fetchData(){
            try{
                const data = await fetch(url + `elections/${id}`, options);
                const res:ElectionStatus = await data.json();
                setElection(res.election);
            }catch(error){
                console.error(error);
            }
        }
        fetchData();
    },[id]);
    return election;
}

export function GetBallots(election_id:string){
    const [ballots, setBallots] = useState<GetBallotsResponse>();

    useEffect(()=>{
        async function fetchData(){
            try{
                const data = await fetch(`${url}elections/${election_id}/ballots`, options).then(res => res.json());
                setBallots(data);
            } catch(error){
                console.error("Error With GetBallots",error);
            }
        }
        fetchData();
    }, []);
    return ballots;
}