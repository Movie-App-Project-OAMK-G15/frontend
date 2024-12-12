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

    useEffect(() => {
        fetchShowtimes();
    }, [selectedArea, selectedDate]);

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
        const today = new Date();
        const tempDates = dates.map(date => ({
            dateTime: date.textContent.split('T')[0]
        }))
        .filter(date => {
            const dateObj = new Date(date.dateTime);
            const diffDays = (dateObj - today) / (1000 * 60 * 60 * 24);
            return diffDays >= 0 && diffDays < 14;
        });
        setDates(tempDates);
    };

    const fetchShowtimes = async () => {
        if (!selectedArea || !selectedDate) return;
        setLoading(true);
        try {
            const response = await fetch(`https://www.finnkino.fi/xml/Schedule/?area=${selectedArea}&dt=${selectedDate}`);
            const xml = await response.text();
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(xml, 'application/xml');
            const showtimeElements = Array.from(xmlDoc.getElementsByTagName('Show')).filter(show =>
                show.getElementsByTagName('EventID')[0].textContent === id);

            const tempShowtimes = showtimeElements.map(showtime => ({
                date: showtime.getElementsByTagName('dttmShowStart')[0].textContent,
                area: showtime.getElementsByTagName('Theatre')[0].textContent,
                eventID: showtime.getElementsByTagName('EventID')[0].textContent 
            }));

            setShowtimes(tempShowtimes);

            if (tempShowtimes.length > 0) {
                fetchMovieDetails(id);
            } else {
                setLoading(false);
            }
        } catch (error) {
            setError('Failed to fetch showtimes.');
            setLoading(false);
        }
    };

    const fetchMovieDetails = async (eventID) => {
        try {
            const eventsResponse = await fetch('https://www.finnkino.fi/xml/Events/');
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
            setError('Failed to fetch movie details.');
        } finally {
            setLoading(false);
        }
    };

    const groupedShowtimes = showtimes.reduce((acc, showtime) => {
        const area = showtime.area;
        if (!acc[area]) {
            acc[area] = [];
        }
        acc[area].push(showtime);
        return acc;
    }, {});

    return (
    <div>
        <Navbar />
        <div className="container-text-center">
            {loading ? (
                <p>Loading movie details...</p>
            ) : error ? (
                <p>{error}</p>
            ) : movieDetails ? (
                <div class="container p-3 shadow-sm rounded" className='container1'>
                    <img className='img1' class="img-fluid img1" src={movieDetails.poster} alt={movieDetails.title} />
                    <div className='text-container'>
                        <h2 className='movietitle' class="movietitle col-md-7">{movieDetails.title}</h2>
                        <p className='description' class="description col-md-8">{movieDetails.overview}</p>
                    </div>
                </div>
            ) : (
                <p>No movie details available.</p>
            )}
        </div>
        <div className="dropdown1 container text-center mt-3">
            <div className="row">
                <div className="col-md-6">
                    <label htmlFor="area-dropdown" className="form-label">Select Area:</label>
                    <select 
                        id="area-dropdown" 
                        value={selectedArea} 
                        onChange={(e) => {
                            setSelectedArea(e.target.value);
                            setShowtimes([]);
                            setMovieDetails(null);
                        }}
                        className="form-control-text form-select"
                    >
                        <option value="">Select Area</option>
                        {areas.map(area => (
                            <option key={area.id} value={area.id}>{area.name}</option>
                        ))}
                    </select>
                </div>
                <div className="col-md-6">
                    <label htmlFor="date-dropdown" className="form-label">Select Date:</label>
                    <select 
                        id="date-dropdown" 
                        value={selectedDate} 
                        onChange={(e) => {
                            setSelectedDate(e.target.value);
                            setShowtimes([]);
                            setMovieDetails(null);
                        }}
                        className="form-control-text form-select"
                    >
                        <option value="">Select Date</option>
                        {dates.map(date => (
                            <option key={date.dateTime} value={date.dateTime}>{date.dateTime}</option>
                        ))}
                    </select>
                </div>
            </div>
        </div>

        {loading && <p>Loading showtimes...</p>}
        {error && <p>{error}</p>}

        <div className="showtimes container">
            {Object.keys(groupedShowtimes).map(area => (
                <div key={area}>
                    <h2 className='place'>{area}</h2>
                    <ul className="time-list">
                        {groupedShowtimes[area].map(showtime => {
                            const time = new Date(showtime.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                            return (
                              <li className='time' key={showtime.date}>Movie start at: {time}</li>
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
