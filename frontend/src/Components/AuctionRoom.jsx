import React, { useState, useEffect } from 'react';
import { placeBid, getAuctionDetails } from '../Utils/api';  // For API calls
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';
// import moment from 'moment';  // For formatting timestamps

let socket;  // Declare socket outside of the component to avoid reinitialization

const AuctionRoom = () => {
    const { id: auctionId } = useParams();  // Get auction ID from the route
    const [auction, setAuction] = useState(null);
    const [bidAmount, setBidAmount] = useState(0);
    const [currentItem, setCurrentItem] = useState(null);  // Current running item
    const [bidHistory, setBidHistory] = useState([]);

    // Fetch auction details on component mount
    useEffect(() => {
        const fetchAuctionDetails = async () => {
            try {
                const auctionData = await getAuctionDetails(auctionId);
                setAuction(auctionData);

                // Set the first item as the active one (if needed)
                if (auctionData.items && auctionData.items.length > 0) {
                    setCurrentItem(auctionData.items[0]);
                    setBidHistory(auctionData.items[0].bids);
                }
            } catch (error) {
                console.error('Error fetching auction details:', error);
            }
        };

        fetchAuctionDetails();

        // Establish WebSocket connection when entering the auction
        socket = io('http://localhost:5000');  // Replace with your actual server URL
        socket.emit('joinAuction', { auctionId });  // Join auction room

        // Listen for real-time bid updates
        socket.on('newBid', ({ itemId, bids }) => {
            if (currentItem && currentItem._id === itemId) {
                setBidHistory(bids);  // Update bid history for the current item
            }
        });

        return () => {
            // Disconnect from the WebSocket when the user leaves the auction room
            socket.disconnect();
        };
    }, [auctionId]);

    const handleBid = () => {
        const userId = '6714fde0ff06712e526654f9';  // Replace with actual user ID from session or auth

        // Send the bid through WebSocket
        socket.emit('placeBid', { itemId: currentItem._id, userId, bidAmount });
    };

    if (!auction || !currentItem) {
        return <div>Loading auction...</div>;
    }

    return (
        <div>
            <h3>{auction.title}</h3>
            <h4>Current Item: {currentItem.name}</h4>
            <p>Current Price: ${currentItem.currentPrice}</p>

            <h4>Bid History</h4>
            <ul>
                {bidHistory.map((bid, index) => (
                    <li key={index}>
                        User: {bid.userId} - Bid: ${bid.amount} - Time: {bid.timestamp}
                    </li>
                ))}
            </ul>

            <input
                type="number"
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value)}
                placeholder="Enter your bid"
            />
            <button onClick={handleBid}>Place Bid</button>
        </div>
    );
};

export default AuctionRoom;
