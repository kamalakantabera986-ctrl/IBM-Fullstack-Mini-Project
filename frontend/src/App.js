import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchWeather = async (e) => {
    e.preventDefault();
    if (!city) return;

    setLoading(true);
    setError('');
    setWeather(null);
    setForecast([]);

    try {
      // 1. Current Weather Call
      const res = await axios.get(`http://localhost:5001/api/weather?city=${encodeURIComponent(city)}`);
      setWeather(res.data);

      // 2. Demo Forecast List (List Rendering demonstration)
      const mockForecast = [
        { day: 'Tomorrow', temp: Math.round(res.data.main.temp + 1), condition: res.data.weather[0].main },
        { day: 'Day 2', temp: Math.round(res.data.main.temp - 1), condition: 'Cloudy' },
        { day: 'Day 3', temp: Math.round(res.data.main.temp + 2), condition: 'Sunny' },
        { day: 'Day 4', temp: Math.round(res.data.main.temp), condition: 'Rain' },
        { day: 'Day 5', temp: Math.round(res.data.main.temp - 2), condition: 'Clear' },
      ];
      setForecast(mockForecast);

    } catch (err) {
      if (err.response && err.response.status === 404) {
        setError('City not found. Please check spelling.');
      } else {
        setError('Failed to fetch weather data. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <h1>🌦️ WeatherPulse</h1>
      
      {/* Event Handling in React */}
      <form onSubmit={fetchWeather} className="search-box">
        <input
          type="text"
          placeholder="Enter city name (e.g. Kolkata)"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      {loading && <div className="loading">Fetching live weather data...</div>}
      {error && <div className="error-msg">{error}</div>}

      {weather && (
        <div className="weather-card">
          <h2 className="city-name">{weather.name}, {weather.sys.country}</h2>
          <div className="temp">{Math.round(weather.main.temp)}°C</div>
          <div className="desc">{weather.weather[0].description}</div>

          <div className="details-grid">
            <div className="detail-item">Feels Like<span>{Math.round(weather.main.feels_like)}°C</span></div>
            <div className="detail-item">Humidity<span>{weather.main.humidity}%</span></div>
            <div className="detail-item">Wind Speed<span>{weather.wind.speed} m/s</span></div>
            <div className="detail-item">Pressure<span>{weather.main.pressure} hPa</span></div>
          </div>

          {/* List Rendering Requirement */}
          <h3 className="forecast-title">5-Day Forecast</h3>
          <div className="forecast-list">
            {forecast.map((item, index) => (
              <div key={index} className="forecast-card">
                <p className="f-day">{item.day}</p>
                <p className="f-temp">{item.temp}°C</p>
                <p className="f-cond">{item.condition}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;