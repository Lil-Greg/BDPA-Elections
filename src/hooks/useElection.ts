import { useEffect, useState } from "react";
import { Election, ElectionStatus, ElectionsStatus } from "../type.ts";
const url:string = import.meta.env.VITE_API_URL;
const APIKey:string = import.meta.env.VITE_API_KEY;
const options = {
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

export function UseSingleElection(id:number){
    const [election, setElection] = useState<Election>();
    useEffect(()=>{
        async function fetchData(){
            try{
                const data = await fetch(url + `/election/${id}`, options);
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