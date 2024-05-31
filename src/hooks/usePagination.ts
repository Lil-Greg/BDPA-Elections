import { useEffect, useState } from "react";
import useElectionHistory from "./useElectionHistory";
import useInfoApi from "./useInfoApi";

export default function usePagination(){
    const info = useInfoApi();
    
    const { elections, setUrl } = useElectionHistory();
    const resultsPerPage = 10;
    const totalPages = info ? Math.ceil(info?.closedElections / resultsPerPage): 0;
    const [pageHistory, setPageHistory] = useState<{previous: string | undefined, next: string | undefined, page: number}[]>([]);
    /*const [nextAfter, setNextAfter] = useState(elections && elections.elections.length > 0 ? elections.elections[elections.elections.length - 1].election_id: undefined);
    const [previousAfter, setPreviousAfter] = useState(undefined);
    const [currentPage, setCurrentPage] = useState(1);*/
    useEffect(()=>{
        getElections()
    },[])


    function getElections(nextAfter : string | undefined = undefined, direction = "next"){
        setUrl((currentUrl: string)=>{
            return currentUrl.split('?')[0] + '?after=' + nextAfter;
        })
        if(direction == "next"){
            setPageHistory((previousHistory)=>{
                return[
                ...previousHistory,
                {previous: nextAfter,
                next: elections?.elections[elections.elections.length - 1].election_id,
                page: ++pageHistory.length}
            ]})
        }
    }

    function handleNext(){
        getElections(pageHistory[pageHistory.length - 1].next, "next");
    }
    function handlePrev(){
        getElections(pageHistory[pageHistory.length - 1].previous, "previous");
    }

    return { elections, totalPages, pageHistory, handleNext, handlePrev };
}