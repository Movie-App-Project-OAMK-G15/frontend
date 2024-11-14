import Navbar from "./Navbar";
import { useState, useEffect } from "react";

const Screenings = () => {
    const [dates, setDates] = useState([]);
    const [areas, setAreas] = useState([]);
    const [selectedArea, setSelectedArea] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
    const [movies, setMovies] = useState([])
    const [loading, setLoading] = useState(false)

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
            const tempDates = dates.map(date => ({
                dateTime: date.textContent.split('T')[0]
            }));
            setDates(tempDates);
        } catch (error) {
            alert('Error fetching or parsing XML data:', error);
        }
    }

    async function fetchMovies() {
        if (!selectedArea || !selectedDate) return;

        setLoading(true); 
        try {
          
            const scheduleResponse = await fetch(`https://www.finnkino.fi/xml/Schedule/?area=${selectedArea}&date=${selectedDate}`);
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
                        image: movie.getElementsByTagName('EventMediumImagePortrait')[0].textContent,
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
    }, [])

    useEffect(() => {
        fetchMovies()
    }, [selectedArea, selectedDate])

    return (
        <>
            <Navbar />
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
            <div>
                <h2>Movies:</h2>
                {loading ? (
                    <p>Loading movies...</p>
                ) : movies.length > 0 ? (
                    <ul>
                        {movies.map(movie => (
                            <li key={movie.id}>
                                <img src={movie.image} alt={movie.title} style={{ width: '100px', height: '150px' }} />
                                <p>{movie.title}</p>
                                <p>Duration: {movie.duration} minutes</p>
                                <p>Rating: {movie.rating}</p>
                                <p>Release Date: {movie.releaseDate}</p>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No movies available for the selected date and area.</p>
                )}
            </div>
        </>
    );
};

export default Screenings;
