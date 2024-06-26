import { useEffect, useState } from "react";
import useElectionHistory from "./useElectionHistory";
import useInfoApi from "./useInfoApi";
const APIKey = import.meta.env.VITE_API_KEY;
const url = import.meta.env.VITE_API_URL;

export default function usePagination(pageSize: number = 5){
    const info = useInfoApi();
    const [elections, setElections] = useState<Election[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isErroring, setIsErroring] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const resultsPerPage = 10;
    const totalPages = info ? Math.ceil(info?.closedElections / resultsPerPage): 0;
    const [pageHistory, setPageHistory] = useState<{previous: string | undefined, next: string | undefined, page: number}[]>([]);
    const [nextAfter, setNextAfter] = useState<string | null>(null);
    const [previousAfters, setPreviousAfters] = useState<string[]>([]); // Keep track of previous `after` values for navigating back
    /*const [nextAfter, setNextAfter] = useState(elections && elections.elections.length > 0 ? elections.elections[elections.elections.length - 1].election_id: undefined);
    const [previousAfter, setPreviousAfter] = useState(undefined);
    const [currentPage, setCurrentPage] = useState(1);*/

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const afterParam = nextAfter ? `?after=${nextAfter}` : '';
                const res = await fetch(`${url}elections${afterParam}`, {
                    method: 'GET',
                    headers: {
                        "Authorization": APIKey,
                        "Content-Type": "application/json"
                    }
                });
                const data = await res.json() as ElectionsStatus;
                setElections(data.elections);
            } catch (error) {
                setIsErroring(true);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [nextAfter]);

    const handleNext = () => {
        if (elections.length > 0) {
            const lastElectionId = elections[elections.length - 1].election_id;
            setPreviousAfters([...previousAfters, nextAfter || '']);
            setNextAfter(lastElectionId);
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePrev = () => {
        if (previousAfters.length > 0) {
            const prevAfter = previousAfters.pop();
            setNextAfter(prevAfter);
            setPreviousAfters(previousAfters);
            setCurrentPage(currentPage - 1);
        }
    };

    return { elections, 
        totalPages, 
        pageHistory, 
        handleNext, 
        handlePrev,
        isLoading,
        isErroring,
        currentPage
    };
}