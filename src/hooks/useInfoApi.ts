import { useEffect, useState } from "react";
import { ElectionInfo } from "../type";

export default function useInfoApi(){
    const [info, setInfo] = useState<ElectionInfo>();

    useEffect(()=>{
        async function fetchData(){
            try{
                const res = await fetch("https://elections_irv.api.hscc.bdpa.org/v1/info");
                const data = await res.json();
                setInfo(data);
            }
            catch (error){
                console.warn(error);
                setInfo({
                    "success": true,
                    "upcomingElections": 12,
                    "openElection": 20,
                    "closedElections": 423
                })
            }
        }
        fetchData();
        return () =>{
            setInfo(undefined);
            //   setLoading(true);
            //   setError(null);
        };
    },[info]);
    return info;
}
