import 'bootstrap/dist/css/bootstrap.min.css';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { QueueProvider } from './context/QueueContext';
import { QueuePosition } from './pages/QueuePosition';
import { RestaurantDetail } from './pages/RestaurantDetail';
import { RestaurantList } from './pages/RestaurantList';

function App() {
  return (
    <QueueProvider>
      <Router>
        <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
          <Routes>
            <Route path="/" element={<RestaurantList />} />
            <Route path="/restaurant/:id" element={<RestaurantDetail />} />
            <Route path="/queue/:userId" element={<QueuePosition />} />
          </Routes>
        </div>
      </Router>
    </QueueProvider>
  );
}

export default App;