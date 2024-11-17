import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import '../styles/ShowTime.css';

const Showtime = () => {
    const { id } = useParams();
    const location = useLocation();
    const { area, date } = location.state || {};

    const [showtimes, setShowtimes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [dates, setDates] = useState([]);
    const [areas, setAreas] = useState([]);
    const [selectedArea, setSelectedArea] = useState(area || '');
    const [selectedDate, setSelectedDate] = useState(date || '');
    const [movieDetails, setMovieDetails] = useState(null);

    const fetchData = async () => {
        try {
            const areaResponse = await fetch('https://www.finnkino.fi/xml/TheatreAreas/');
            const areaXml = await areaResponse.text();
            showAreaList(areaXml);

            const dateResponse = await fetch('https://www.finnkino.fi/xml/ScheduleDates/');
            const dateXml = await dateResponse.text();
            showDateList(dateXml);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const showAreaList = (xml) => {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xml, 'application/xml');
        const areas = Array.from(xmlDoc.getElementsByTagName('TheatreArea'));
        const tempAreas = areas.map(area => ({
            id: area.getElementsByTagName('ID')[0].textContent,
            name: area.getElementsByTagName('Name')[0].textContent
        }));
        setAreas(tempAreas);
    };

    const showDateList = (xml) => {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xml, 'application/xml');
        const dates = Array.from(xmlDoc.getElementsByTagName('dateTime'));
        const tempDates = dates.map(date => ({
            dateTime: date.textContent.split('T')[0]
        }));
        setDates(tempDates);
    };

    const fetchShowtimes = async () => {
        if (!selectedArea || !selectedDate) return;

        setLoading(true);
        try {
            const response = await fetch(`https://www.finnkino.fi/xml/Schedule/?id=${id}&area=${selectedArea}&date=${selectedDate}`);
            const xml = await response.text();
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(xml, 'application/xml');
            const showtimeElements = Array.from(xmlDoc.getElementsByTagName('Show'));

            const tempShowtimes = showtimeElements.map(showtime => ({
                date: showtime.getElementsByTagName('dttmShowStart')[0].textContent,
                area: showtime.getElementsByTagName('Theatre')[0].textContent,
                eventID: showtime.getElementsByTagName('EventID')[0].textContent
            }));

            const uniqueShowtimes = Array.from(new Set(tempShowtimes.map(show => show.date)))
                .map(date => tempShowtimes.find(show => show.date === date));

            setShowtimes(uniqueShowtimes);
            fetchMovieDetails(uniqueShowtimes.map(show => show.eventID)[0]);
        } catch (error) {
            setError('Failed to fetch showtimes.',error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchShowtimes();
    }, [selectedArea, selectedDate]);

    const groupedShowtimes = showtimes.reduce((acc, showtime) => {
        const area = showtime.area;
        if (!acc[area]) {
            acc[area] = [];
        }
        acc[area].push(showtime);
        return acc;
    }, {});

    const fetchMovieDetails = async (eventID) => {
        try {
            const eventsResponse = await fetch(`https://www.finnkino.fi/xml/Events/?id=${id}`);
            const eventsXml = await eventsResponse.text();
            const parser = new DOMParser();
            const eventsDoc = parser.parseFromString(eventsXml, 'application/xml');
            const eventElement = Array.from(eventsDoc.getElementsByTagName('Event')).find(event => 
                event.getElementsByTagName('ID')[0].textContent === eventID);
            
            if (eventElement) {
                const movie = {
                    id: eventElement.getElementsByTagName('ID')[0].textContent,
                    title: eventElement.getElementsByTagName('Title')[0].textContent,
                    overview: eventElement.getElementsByTagName('ShortSynopsis')[0]?.textContent || 'No description available',
                    poster: eventElement.getElementsByTagName('EventMediumImagePortrait')[0]?.textContent || 'No image available',
                };
                setMovieDetails(movie);
            } else {
                setMovieDetails(null);
            }
        } catch (error) {
            console.error(error);
            setError('Failed to fetch movie details.',error);
        }
    };

    return (
        <div>
            <Navbar />
            <div className="container">
                {loading ? (
                    <p>Loading movie details...</p>
                ) : error ? (
                    <p>{error}</p>
                ) : movieDetails ? (
                    <div className="movie-items" key={movieDetails.id}>
                        <img className="img" src={movieDetails.poster} alt={movieDetails.title} />
                        <h2>{movieDetails.title}</h2>
                        <p>{movieDetails.overview}</p>
                    </div>
                ) : (
                    <p>No movie details available.</p>
                )}
            </div>
            <div className="dropdown1">
                <div>
                    <label htmlFor="area-dropdown">Select Area:</label>
                    <select 
                        id="area-dropdown" 
                        value={selectedArea} 
                        onChange={(e) => {
                            setSelectedArea(e.target.value);
                            setShowtimes([]); 
                        }}
                    >
                        <option value="">Select Area</option>
                        {areas.map(area => (
                            <option key={area.id} value={area.id}>{area.name}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label htmlFor="date-dropdown">Select Date:</label>
                    <select 
                        id="date-dropdown" 
                        value={selectedDate} 
                        onChange={(e) => {
                            setSelectedDate(e.target.value);
                            setShowtimes([]); 
                        }}
                    >
                        <option value="">Select Date</option>
                        {dates.map(date => (
                            <option key={date.dateTime} value={date.dateTime}>{date.dateTime}</option>
                        ))}
                    </select>
                </div>
            </div>

            {loading && <p>Loading showtimes...</p>}
            {error && <p>{error}</p>}

            <div className="showtimes">
                {Object.keys(groupedShowtimes).map(area => (
                    <div key={area}>
                        <h2>{area}</h2>
                        <ul className="time-list">
                            {groupedShowtimes[area].map(showtime => {
                                const time = new Date(showtime.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                                return (
                                    <li className='time' key={showtime.date}>Showtime: {time}</li>
                                );
                            })}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Showtime;
