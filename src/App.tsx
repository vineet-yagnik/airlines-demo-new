import React from 'react';
import './App.css';
import { searchFlights } from './lib/flight-api';
import { BookingFlow } from './components/BookingFlow';
import type { FlightOffer, FlightSearchParams } from './lib/flight-api';

// Enhanced Airlines App component with real API integration and booking flow
function App() {
  const [searchData, setSearchData] = React.useState({
    from: '',
    to: '',
    departure: '',
    passengers: 1
  });

  const [flights, setFlights] = React.useState<FlightOffer[]>([]);
  const [isSearching, setIsSearching] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [isUsingMockData, setIsUsingMockData] = React.useState(false);
  
  // Booking flow state
  const [selectedFlight, setSelectedFlight] = React.useState<FlightOffer | null>(null);
  const [isBookingFlow, setIsBookingFlow] = React.useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchData.from || !searchData.to || !searchData.departure) {
      alert('Please fill in all required fields');
      return;
    }

    setIsSearching(true);
    setError(null);
    setFlights([]);

    try {
      const searchParams: FlightSearchParams = {
        originLocationCode: searchData.from.toUpperCase(),
        destinationLocationCode: searchData.to.toUpperCase(),
        departureDate: searchData.departure,
        adults: searchData.passengers,
        currencyCode: 'USD',
        max: 10
      };

      const flightOffers = await searchFlights(searchParams);
      setFlights(flightOffers);
      setIsUsingMockData(false);
      
      if (flightOffers.length === 0) {
        setError('No flights found for your search criteria. Please try different dates or airports.');
      }
    } catch (err) {
      console.error('Flight search error:', err);
      if (err instanceof Error && err.message === 'API_CREDENTIALS_MISSING') {
        setIsUsingMockData(true);
        // Don't show error for mock data - it's expected behavior
      } else {
        setError('Unable to search flights at the moment. Please try again later.');
      }
    } finally {
      setIsSearching(false);
    }
  };

  const handleInputChange = (field: string, value: string | number) => {
    setSearchData(prev => ({ ...prev, [field]: value }));
  };

  const handleFlightSelect = (flight: FlightOffer) => {
    setSelectedFlight(flight);
    setIsBookingFlow(true);
  };

  const handleBookingCancel = () => {
    setIsBookingFlow(false);
    setSelectedFlight(null);
  };

  const handleBookingComplete = () => {
    setIsBookingFlow(false);
    setSelectedFlight(null);
    // Reset search data for new search
    setFlights([]);
    setSearchData({
      from: '',
      to: '',
      departure: '',
      passengers: 1
    });
  };

  const formatTime = (dateTimeString: string) => {
    return new Date(dateTimeString).toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  const formatDuration = (duration: string) => {
    // Convert ISO 8601 duration (PT3H30M) to readable format (3h 30m)
    const match = duration.match(/PT(\d+H)?(\d+M)?/);
    if (!match) return duration;
    
    const hours = match[1] ? match[1].replace('H', 'h ') : '';
    const minutes = match[2] ? match[2].replace('M', 'm') : '';
    return (hours + minutes).trim();
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
        {isBookingFlow && selectedFlight ? (
          <BookingFlow
            selectedFlight={selectedFlight}
            passengerCount={searchData.passengers}
            onCancel={handleBookingCancel}
            onComplete={handleBookingComplete}
          />
        ) : (
          <>
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
              <section className="results-section" aria-label="Flight search results">
                <div 
                  className="results-count" 
                  role="status" 
                  aria-live="polite"
                >
                  {flights.length} flights found
                </div>
                
                {error && (
                  <div className="error-message" role="alert" aria-live="assertive">
                    {error}
                  </div>
                )}
                
                {isUsingMockData && (
                  <div className="info-message" role="status" aria-live="polite">
                    ℹ️ Demo Mode: Showing sample flight data. <a href="https://developers.amadeus.com/" target="_blank" rel="noopener noreferrer">Get API keys</a> for real flight search.
                  </div>
                )}
                
                <div className="flights-list">
                  {flights.map((flight) => {
                    const segment = flight.itineraries[0].segments[0];
                    const departureTime = formatTime(segment.departure.at);
                    const arrivalTime = formatTime(segment.arrival.at);
                    const duration = formatDuration(flight.itineraries[0].duration);
                    
                    return (
                      <div key={flight.id} className="flight-card" data-testid="flight-card">
                        <div className="flight-header">
                          <h3>{segment.carrierCode} Airlines</h3>
                          <div className="flight-number">{segment.carrierCode}{segment.number}</div>
                        </div>
                        
                        <div className="flight-route">
                          <div className="flight-location">
                            <div className="airport">{segment.departure.iataCode}</div>
                            <div className="city">{segment.departure.iataCode}</div>
                            <div className="time">{departureTime}</div>
                          </div>
                          
                          <div className="flight-duration">
                            <div>✈️</div>
                            <div>{duration}</div>
                          </div>
                          
                          <div className="flight-location">
                            <div className="airport">{segment.arrival.iataCode}</div>
                            <div className="city">{segment.arrival.iataCode}</div>
                            <div className="time">{arrivalTime}</div>
                          </div>
                        </div>
                        
                        <div className="flight-footer">
                          <div className="price">${flight.price.total}</div>
                          <button 
                            className="select-button"
                            onClick={() => handleFlightSelect(flight)}
                          >
                            Book Flight
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}
          </>
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
