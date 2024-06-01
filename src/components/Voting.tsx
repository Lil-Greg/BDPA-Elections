export default function Voting(){
    const [firstVote, setFirstVote] = useState("");
    const [secondVote, setSecondVote] = useState("");
    const [thirdVote, setThirdVote] = useState("");
    const [votingValue, setVotingValue] = useState([firstVote, secondVote, thirdVote]);
}