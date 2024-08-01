import { useState } from "react";
import EditElectionsModal from "./EditElectionModal";
import { Button, Container, Pagination } from "react-bootstrap";
import useAllElections from "../../../hooks/useElection";
import { useQuery } from "@tanstack/react-query";

export default function AdminElections() {
    const [show, setShow] = useState(false);
    const [selectedId, setSelectedId] = useState('');
    const { data, isLoading } = useQuery({
        queryKey: ["GetAllElections"],
        queryFn: () => useAllElections(),
    });
    const elections = data;
    const [currentPage, setCurrentPage] = useState<number>(1);
    const itemsPerPage = 5;

    if (isLoading) {
        return <p>Loading...</p>
    }
    if (!elections) {
        console.warn("Elections in AdminElections Component Has an Error");
        return;
    }
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentElections = elections.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(elections.length / itemsPerPage);

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
    const handleClose = () => {
        setShow(false);
    }
    return <Container className="AdminElections-container">
        <Container>
            <Pagination className="pagination d-flex justify-content-center">
                <Pagination.Prev
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                />
                {Array.from({ length: totalPages }, (_, i) => (
                    <Pagination.Item
                        key={i}
                        active={currentPage === i + 1}
                        onClick={() => paginate(i + 1)}
                    >
                        {i + 1}
                    </Pagination.Item>
                ))}
                <Pagination.Next
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                />
            </Pagination>
            <div className="AdminElections-button-stuff d-flex flex-column">
                {currentElections.map((election, index) => <Button
                    key={election.title}
                    variant={index % 2 === 0 ? "secondary" : "info"}
                    onClick={() => { setSelectedId(election.election_id); setShow(true); }}
                >
                    {election.title}
                </Button>
                )}
            </div>
        </Container>
        {selectedId && (
            <EditElectionsModal show={show} handleClose={handleClose} election_id={selectedId} />
        )}
    </Container>
}