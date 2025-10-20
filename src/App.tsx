import React from 'react';
import './App.css';

// Simple Airlines App component
function App() {
  const [searchData, setSearchData] = React.useState({
    from: '',
    to: '',
    departure: '',
    passengers: 1
  });

  const [flights, setFlights] = React.useState<Array<{
    id: string;
    flightNumber: string;
    airline: string;
    departure: { airport: string; city: string; time: string };
    arrival: { airport: string; city: string; time: string };
    price: number;
    duration: string;
  }>>([]);

  const [isSearching, setIsSearching] = React.useState(false);

  // Mock flight data
  const mockFlights = [
    {
      id: '1',
      flightNumber: 'AA123',
      airline: 'American Airlines',
      departure: { airport: 'JFK', city: 'New York', time: '10:00' },
      arrival: { airport: 'LAX', city: 'Los Angeles', time: '13:30' },
      price: 299,
      duration: '5h 30m'
    },
    {
      id: '2', 
      flightNumber: 'UA456',
      airline: 'United Airlines',
      departure: { airport: 'JFK', city: 'New York', time: '14:15' },
      arrival: { airport: 'LAX', city: 'Los Angeles', time: '17:45' },
      price: 325,
      duration: '5h 30m'
    },
    {
      id: '3',
      flightNumber: 'DL789',
      airline: 'Delta Airlines', 
      departure: { airport: 'JFK', city: 'New York', time: '18:30' },
      arrival: { airport: 'LAX', city: 'Los Angeles', time: '22:00' },
      price: 275,
      duration: '5h 30m'
    }
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchData.from || !searchData.to || !searchData.departure) {
      alert('Please fill in all required fields');
      return;
    }

    setIsSearching(true);
    // Simulate API call
    setTimeout(() => {
      setFlights(mockFlights);
      setIsSearching(false);
    }, 1000);
  };

  const handleInputChange = (field: string, value: string | number) => {
    setSearchData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="app">
      <header className="app-header" role="banner">
        <div className="container">
          <h1>✈️ AirlineDemo</h1>
          <p>Find and book your perfect flight</p>
        </div>
      </header>

      <main role="main" className="container">
        <section className="search-section" aria-label="Flight search">
          <h2>Search Flights</h2>
          <form onSubmit={handleSearch} className="search-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="from">From</label>
                <input
                  id="from"
                  type="text"
                  placeholder="e.g., JFK"
                  value={searchData.from}
                  onChange={(e) => handleInputChange('from', e.target.value.toUpperCase())}
                  maxLength={3}
                  required
                  aria-describedby="from-help"
                />
                <small id="from-help">Enter 3-letter airport code</small>
              </div>

              <div className="form-group">
                <label htmlFor="to">To</label>
                <input
                  id="to"
                  type="text"
                  placeholder="e.g., LAX"
                  value={searchData.to}
                  onChange={(e) => handleInputChange('to', e.target.value.toUpperCase())}
                  maxLength={3}
                  required
                  aria-describedby="to-help"
                />
                <small id="to-help">Enter 3-letter airport code</small>
              </div>

              <div className="form-group">
                <label htmlFor="departure">Departure Date</label>
                <input
                  id="departure"
                  type="date"
                  value={searchData.departure}
                  onChange={(e) => handleInputChange('departure', e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="passengers">Passengers</label>
                <select
                  id="passengers"
                  value={searchData.passengers}
                  onChange={(e) => handleInputChange('passengers', parseInt(e.target.value))}
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                    <option key={num} value={num}>{num} passenger{num > 1 ? 's' : ''}</option>
                  ))}
                </select>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isSearching}
              className="search-button"
            >
              {isSearching ? 'Searching...' : 'Search Flights'}
            </button>
          </form>
        </section>

        {flights.length > 0 && (
          <section className="results-section" aria-label="Flight results">
            <h2>Available Flights</h2>
            <div 
              className="results-announcement" 
              aria-live="polite"
              role="status"
            >
              {flights.length} flights found
            </div>
            
            <div className="flights-list">
              {flights.map((flight) => (
                <div key={flight.id} className="flight-card" data-testid="flight-card">
                  <div className="flight-header">
                    <h3>{flight.airline}</h3>
                    <div className="flight-number">{flight.flightNumber}</div>
                  </div>
                  
                  <div className="flight-route">
                    <div className="flight-location">
                      <div className="airport">{flight.departure.airport}</div>
                      <div className="city">{flight.departure.city}</div>
                      <div className="time">{flight.departure.time}</div>
                    </div>
                    
                    <div className="flight-duration">
                      <div>✈️</div>
                      <div>{flight.duration}</div>
                    </div>
                    
                    <div className="flight-location">
                      <div className="airport">{flight.arrival.airport}</div>
                      <div className="city">{flight.arrival.city}</div>
                      <div className="time">{flight.arrival.time}</div>
                    </div>
                  </div>
                  
                  <div className="flight-footer">
                    <div className="price">${flight.price}</div>
                    <button 
                      className="select-button"
                      onClick={() => alert(`Selected ${flight.flightNumber}`)}
                    >
                      Select Flight
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      <footer role="contentinfo" className="app-footer">
        <div className="container">
          <p>&copy; 2024 AirlineDemo. Constitutional compliance with accessibility-first design.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
