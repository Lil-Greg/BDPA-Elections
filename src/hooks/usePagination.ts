import { useState } from "react";
import useElectionHistory from "./useElectionHistory";
import useInfoApi from "./useInfoApi";

export default function usePagination(){
    const info = useInfoApi();
    
    const { elections, setUrl } = useElectionHistory();
    const resultsPerPage = 10;
    const totalPages = info ? Math.ceil(info?.closedElections / resultsPerPage): 0;
    const [nextAfter, setNextAfter] = useState(elections && elections.elections.length > 0 ? elections.elections[elections.elections.length - 1].election_id: undefined);
    const [previousAfter, setPreviousAfter] = useState(undefined);
    const [currentPage, setCurrentPage] = useState(1);


    function handleNext(){
        setPreviousAfter(nextAfter);
        setCurrentPage((currentCurrentPage)=>{
            currentCurrentPage += 1;
        })
        setUrl((currentUrl)=>{
            return currentUrl.split('?')[0] + '?after=' + nextAfter;
        })
    }
    function handlePrev(){
        //setAfter = nextAfter;
    }

    return { elections, totalPages, nextAfter, previousAfter, currentPage, handleNext, handlePrev };
}