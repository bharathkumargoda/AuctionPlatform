import React, { useState, useEffect } from 'react';
import { placeBid, getAuctionDetails } from '../Utils/api';
import { useParams } from 'react-router-dom';

const AuctionRoom = () => {
    const { id: auctionId } = useParams();
    const [auction, setAuction] = useState(null); // Auction state to store auction details
    const [bidAmount, setBidAmount] = useState(0);

    // Fetch auction details when component mounts
    useEffect(() => {

      console.log("Auction ID", auctionId);
        const fetchAuctionDetails = async () => {
            try {
                const auctionData = await getAuctionDetails(auctionId);
                setAuction(auctionData); // Set the auction details
            } catch (error) {
                console.error('Error fetching auction details:', error);
            }
        };

        fetchAuctionDetails();
    }, [auctionId]);

    const handleBid = async () => {
        const userId = 'some-user-id';  // Replace with actual userId from session or auth
        try {
            const item = await placeBid(auctionId, userId, bidAmount);
            // Handle UI update after successful bid, e.g., update current price
        } catch (error) {
            console.error('Error placing bid:', error);
        }
    };

    if (!auction) {
        return <div>Loading auction details...</div>;
    }

    return (
        <div>
            <h3>{auction.title}</h3>
            <div>
                <h4>Items in this auction:</h4>
                <ul>
                    {auction?.items?.map((item) => (
                        <li key={item?._id}>
                            {item?.name} - Current Price: ${item?.currentPrice}
                        </li>
                    ))}
                </ul>
            </div>
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
