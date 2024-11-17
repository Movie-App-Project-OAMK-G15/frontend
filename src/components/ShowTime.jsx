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

    useEffect(() => {
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
            }));

            setShowtimes(tempShowtimes);
        } catch (error) {
            setError('Failed to fetch showtimes. Please try again later.',error);
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
            <div className="dropdown">
                <div>
                    <label htmlFor="area-dropdown">Select an Area:</label>
                    <select 
                        id="area-dropdown" 
                        value={selectedArea} 
                        onChange={(e) => {
                            setSelectedArea(e.target.value);
                            setShowtimes([]); 
                        }}
                    >
                        <option value="">--Choose area or cinema--</option>
                        {areas.map(area => (
                            <option key={area.id} value={area.id}>{area.name}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label htmlFor="date-dropdown">Select a Date:</label>
                    <select 
                        id="date-dropdown" 
                        value={selectedDate} 
                        onChange={(e) => {
                            setSelectedDate(e.target.value);
                            setShowtimes([]); 
                        }}
                    >
                        <option value="">--Select a Date--</option>
                        {dates.map((date, index) => (
                            <option key={index} value={date.dateTime}>{date.dateTime}</option>
                        ))}
                    </select>
                </div>
                <button onClick={fetchShowtimes}>Show Showtimes</button>
            </div>

            {loading ? (
                <p>Loading showtime details...</p>
            ) : error ? (
                <p>{error}</p>
            ) : Object.keys(groupedShowtimes).length > 0 ? (
                <div>
                    <h2>Showtimes:</h2>
                    {Object.entries(groupedShowtimes).map(([area, showtimes]) => (
                        <div key={area}>
                            <h3>{area}</h3>
                            <ul className= "time-list">
                                {showtimes.map((showtime, index) => {
                                    const time = new Date(showtime.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                                    return (
                                        <li className='time' key={index}>
                                            <p>Time: {time}</p>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    ))}
                </div>
            ) : (
                <p>No showtimes available for this movie.</p>
            )}
        </div>
    );
};

export default Showtime;