import Navbar from "./Navbar";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import '../styles/Screenings.css'

const Screenings = () => {
    const [dates, setDates] = useState([]);
    const [areas, setAreas] = useState([]);
    const [selectedArea, setSelectedArea] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleShowtimeNavigation = (id) => {
        if (selectedArea && selectedDate) {
            navigate(`/showtime/${id}`, { state: { area: selectedArea, date: selectedDate } });
        }
    };

    async function showAreaList(xml) {
        try {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(xml, 'application/xml');
            const areas = Array.from(xmlDoc.getElementsByTagName('TheatreArea'));
            const tempAreas = areas.map(area => ({
                id: area.getElementsByTagName('ID')[0].textContent,
                name: area.getElementsByTagName('Name')[0].textContent
            }));
            setAreas(tempAreas);
        } catch (error) {
            alert('Error fetching or parsing XML data:', error);
        }
    }

    async function showTimeList(xml) {
        try {
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
        } catch (error) {
            alert('Error fetching or parsing XML data:', error);
        }
    }

    async function fetchMovies() {
        if (!selectedArea || !selectedDate) return;

        setLoading(true);
        try {
            const scheduleResponse = await fetch(`https://www.finnkino.fi/xml/Schedule/?area=${selectedArea}&dt=${selectedDate}`);
            const scheduleXml = await scheduleResponse.text();
            const scheduleParser = new DOMParser();
            const scheduleDoc = scheduleParser.parseFromString(scheduleXml, 'application/xml');
            const scheduleMovies = Array.from(scheduleDoc.getElementsByTagName('Show'));

            const eventIDs = new Set(scheduleMovies.map(movie => movie.getElementsByTagName('EventID')[0].textContent));

            const eventsResponse = await fetch(`https://www.finnkino.fi/xml/Events/`);
            const eventsXml = await eventsResponse.text();
            const eventsParser = new DOMParser();
            const eventsDoc = eventsParser.parseFromString(eventsXml, 'application/xml');
            const movieElements = eventsDoc.getElementsByTagName('Event');

            const tempMovies = [];
            Array.from(movieElements).forEach(movie => {
                const id = movie.getElementsByTagName('ID')[0].textContent;
                if (eventIDs.has(id)) { 
                    tempMovies.push({
                        title: movie.getElementsByTagName('Title')[0].textContent,
                        image: movie.getElementsByTagName('EventSmallImagePortrait')[0].textContent,
                        duration: movie.getElementsByTagName('LengthInMinutes')[0].textContent,
                        rating: movie.getElementsByTagName('Rating')[0].textContent, 
                        releaseDate: movie.getElementsByTagName('dtLocalRelease')[0].textContent.split('T')[0], 
                        id: id
                    });
                }
            });

            setMovies(tempMovies);
        } catch (error) {
            alert('Error fetching movies:', error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const areaResponse = await fetch('https://www.finnkino.fi/xml/TheatreAreas/');
                const areaXml = await areaResponse.text();
                showAreaList(areaXml);

                const dateResponse = await fetch('https://www.finnkino.fi/xml/ScheduleDates/');
                const dateXml = await dateResponse.text();
                showTimeList(dateXml);
            } catch (error) {
                console.log(error);
            }
        }

        fetchData();
    }, []);

    useEffect(() => {
        fetchMovies();
    }, [selectedArea, selectedDate]);

    return (
        <div>
            <Navbar />
            <div className="dropdown">
                <div>
                    <label htmlFor="area-dropdown">Select an Area:</label>
                    <select 
                        id="area-dropdown" 
                        value={selectedArea} 
                        onChange={(e) => setSelectedArea(e.target.value)}
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
                        onChange={(e) => setSelectedDate(e.target.value)}
                    >
                        <option value="">--Select a Date--</option>
                        {dates.map((date, index) => (
                            <option key={index} value={date.dateTime}>{date.dateTime}</option>
                        ))}
                    </select>
                </div>
            </div>
            <div>
                <h2>Available movies:</h2>
                {loading ? (
                    <p className="loading">Loading movies...</p>
                ) : movies.length > 0 ? (
                    <div className="movies-lists">
                        {movies.map(movie => (
                            <div className="movie-items" key={movie.id}>
                                <img className="img" src={movie.image} alt={movie.title} />
                                <div className="movie-details">
                                    <h2>{movie.title}</h2>
                                    <p>Duration: {movie.duration} minutes</p>
                                    <p>Rating: {movie.rating}</p>
                                    <p>Release Date: {movie.releaseDate}</p>
                                    <div className="button-showtime">
                                        <button className='bttn-showtime' onClick={() => handleShowtimeNavigation(movie.id)}>
                                            Showtime
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>No movies available for the selected date and area.</p>
                )}
            </div>
        </div>
    );
};

export default Screenings;
