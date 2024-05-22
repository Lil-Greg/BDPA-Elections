import { useEffect, useState } from "react";

export default function useInfoApi(){
    const [info, setInfo] = useState();


    useEffect(()=>{
        async function fetchData(){
            try{
                const res = await fetch("https://elections_irv.api.hscc.bdpa.org/v1/info");
                const data = await res.json();
                setInfo(data);
            }
            catch (error){
                // console.log(error);
                setInfo({
                    "success": true,
                    "upcomingElections": 12,
                    "openElections": 20,
                    "closedElections": 423
                })
            }
        }
        fetchData();
        return () =>{
            // setInfo(undefined);
            //   setLoading(true);
            //   setError(null);
        };
    },[])
    return info
}
