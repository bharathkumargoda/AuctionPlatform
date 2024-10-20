import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';  // Use Routes instead of Switch
import AuctionList from './Components/AuctionList';
import AuctionRoom from './Components/AuctionRoom';
import CreateAuction from './Components/CreateAuction'; // Import CreateAuction component

const App = () => {
    return (
      <Router>
      <Routes>  {/* Use Routes instead of Switch */}
          <Route path="/" element={<AuctionList />} />  {/* Use element prop */}
          <Route path="/auction/:id" element={<AuctionRoom />} />  {/* Use element prop */}
          <Route path="/create-auction" element={<CreateAuction />} />  {/* Use element prop */}
      </Routes>
  </Router>
    );
};

export default App;
