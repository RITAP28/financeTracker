import axios from "axios"

export const fetchAllTransactions = async () => {
    const response = await axios.get(`http://localhost:3000/api/transactions/all`, {
        headers: {
            "Content-Type": "application/json"
        }
    });
    return response;
}