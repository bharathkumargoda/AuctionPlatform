const API_URL = 'http://localhost:5000/api';
import axios from 'axios';

export const fetchTodaysAuctions = async () => {
    const response = await fetch(`${API_URL}/auctions/today`);
    if (!response.ok) {
        throw new Error('Failed to fetch auctions');
    }
    return await response.json();
};

export const placeBid = async (itemId, userId, bidAmount) => {
    const response = await fetch(`${API_URL}/items/bid`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId, userId, bidAmount }),
    });
    if (!response.ok) {
        throw new Error('Failed to place bid');
    }
    return await response.json();
};


export const getAuctionDetails = async (auctionId) => {
    try {
        const response = await axios.get(`${API_URL}/auctions/${auctionId}`);
        console.log("Response", response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching auction details:', error);
        throw error;
    }
};

export const createAuction = async (auctionData) => {
    try {
        const response = await axios.post(`${API_URL}/auctions/addItems`, auctionData);
        return response.data;
    } catch (error) {
        console.error('Error creating auction:', error);
        throw error;
    }
};

