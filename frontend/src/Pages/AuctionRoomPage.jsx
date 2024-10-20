import React from 'react';
import Auction from '../Components/Auction';
import BidList from '../Components/BidList';

const AuctionPage = ({ auction }) => {
  return (
    <div>
      <Auction auction={auction} />
      <BidList auctionId={auction.id} />
    </div>
  );
};

export default AuctionPage;
