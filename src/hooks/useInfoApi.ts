import { useEffect, useState } from "react";
import { ElectionInfo } from "../type";
const url:string = import.meta.env.VITE_API_URL;
const APIKey:string = import.meta.env.VITE_API_KEY;
const options = {
    headers:{
        'Authorization': APIKey,
        'content-type':'application/json'
    }
}

export default function useInfoApi(){
    const [info, setInfo] = useState<ElectionInfo>();

    useEffect(()=>{
        async function fetchData(){
            try{
                const res = await fetch(`${url}info`, options);
                const data = await res.json();
                setInfo(data);
            }
            catch (error){
                console.warn(error);
                setInfo({
                    "success": true,
                    info:{
                        "upcomingElections": 12,
                        "openElection": 20,
                        "closedElections": 423
                    }
                })
            }
        }
        fetchData();
        return () =>{
            setInfo(undefined);
            //   setLoading(true);
            //   setError(null);
        };
    },[]); // Dependecies can't be same value that's set in the useEffect
               // If so, it results in re-render error
    return info;
}
