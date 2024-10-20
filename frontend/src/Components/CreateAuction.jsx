import React, { useState } from 'react';
import { createAuction } from '../Utils/api';
// import { useNavigate } from 'react-router-dom';

const CreateAuction = () => {
    // const history = useHistory();

    const [title, setTitle] = useState('');
    const [minimumBidIncrement, setMinimumBidIncrement] = useState(0);
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [items, setItems] = useState([{ name: '', startingPrice: 0 }]);

    // Handle adding a new item row
    const handleAddItem = () => {
        setItems([...items, { name: '', startingPrice: 0 }]);
    };

    // Handle removing an item row
    const handleRemoveItem = (index) => {
        const newItems = [...items];
        newItems.splice(index, 1);
        setItems(newItems);
    };

    // Handle changing item data
    const handleItemChange = (index, field, value) => {
        const newItems = [...items];
        newItems[index][field] = value;
        setItems(newItems);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const auctionData = { title, minimumBidIncrement,startTime, endTime, items };

        try {
            await createAuction(auctionData); // Call the API to create an auction
            // history.push('/auctions'); // Redirect after creation
        } catch (error) {
            console.error('Error creating auction:', error);
        }
    };

    return (
        <div>
            <h2>Create New Auction</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Auction Title</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Minimum Bid Increment</label>
                    <input
                        type="number"
                        value={minimumBidIncrement}
                        onChange={(e) => setMinimumBidIncrement(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label>Start Time</label>
                    <input
                        type="datetime-local"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label>End Time</label>
                    <input
                        type="datetime-local"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                        required
                    />
                </div>

                <h3>Items</h3>
                {items?.map((item, index) => (
                    <div key={index} style={{ marginBottom: '10px' }}>
                        <label>Item Name</label>
                        <input
                            type="text"
                            value={item.name}
                            onChange={(e) => handleItemChange(index, 'name', e.target.value)}
                            required
                        />
                        <label>Starting Price</label>
                        <input
                            type="number"
                            value={item.startingPrice}
                            onChange={(e) => handleItemChange(index, 'startingPrice', e.target.value)}
                            required
                        />
                        {items.length > 1 && (
                            <button type="button" onClick={() => handleRemoveItem(index)}>
                                Remove Item
                            </button>
                        )}
                    </div>
                ))}

                <button type="button" onClick={handleAddItem}>
                    Add Item
                </button>
                <br />
                <button type="submit">Create Auction</button>
            </form>
        </div>
    );
};

export default CreateAuction;
