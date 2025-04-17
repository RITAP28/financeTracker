import axios from "axios"
import { publicURL } from "./utils";

export const fetchAllTransactions = async () => {
    const response = await axios.get(`${publicURL}/api/transactions/all`, {
        headers: {
            "Content-Type": "application/json"
        }
    });
    return response;
}