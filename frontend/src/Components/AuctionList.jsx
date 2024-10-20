import React, { useEffect, useState } from 'react';
import { fetchTodaysAuctions } from '../Utils/api';
import { Link } from 'react-router-dom';

const AuctionList = () => {
    const [auctions, setAuctions] = useState([]);

    useEffect(() => {
        const getAuctions = async () => {
            try {
                const data = await fetchTodaysAuctions();
                setAuctions(data);
            } catch (error) {
                console.error(error);
            }
        };
        getAuctions();
    }, []);

    return (
        <div>
            <h2>Today's Auctions</h2>
            <ul>
                {auctions.map(auction => (
                    <li key={auction._id}>
                        <Link to={`/auction/${auction._id}`}>{auction.title}</Link>
                    </li>
                ))}
            </ul>
            <Link to="/create-auction">
                <button>Create New Auction</button> {/* Button to go to auction creation page */}
            </Link>
        </div>
    );
};

export default AuctionList;
