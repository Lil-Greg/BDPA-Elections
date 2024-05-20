import { useEffect, useState } from "react";

export default function useElectionHistory(){
    const [elections, setElections] = useState();
    useEffect (()=>{
        async function fetchData(){
            try{
                const res = await fetch("https://elections_irv.api.hscc.bdpa.org/v1/elections");
                const data = await res.json();
                setElections(data);
            }
            catch(error){
                setElections({
                    "success": true,
                    "elections": [{
                        "election_id": "5ec8adf06e38137ff2e5876f",
                        "title": "My election #1",
                        "description": "My demo election!",
                        "options": [],
                        "createdAt": 1589347376211,
                        "opensAt": 1589347379811,
                        "closesAt": 1589347380731,
                        "owned": true,
                        "deleted": false
                    },{
                        "election_id": "5ec8adf06e38137ff2e5876e",
                        "title": "My election #2",
                        "description": "A custom election I made",
                        "options": ["Option 1", "Option 2"],
                        "createdAt": 1589347376211,
                        "opensAt": 1589347379811,
                        "closesAt": 1589347380731,
                        "owned": false,
                        "deleted": true
                    },{
                        "election_id": "5ec8adf06e38137ff2e5876d",
                        "title": "My election #3",
                        "description": "An election to end all elections?",
                        "options": ["Vanilla", "Chocolate"],
                        "createdAt": 1589347376211,
                        "opensAt": 1589347379811,
                        "closesAt": 1589347380731,
                        "owned": true,
                        "deleted": false
                    }]
                });
            }
        }
        fetchData();
        return ()=>{
            //setElections
        }
    },[])
    return elections
}