import Navbar from "./Navbar";
import { useState, useEffect } from "react";

const Screenings = () => {
    const [dates, setDates] = useState([]);
    const [areas, setAreas] = useState([]);
    const [selectedArea, setSelectedArea] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
    const [movies, setMovies] = useState([])

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
                dateTime: date.textContent
            }));
            setDates(tempDates);
        } catch (error) {
            alert('Error fetching or parsing XML data:', error);
        }
    }

    async function fetchMovies() {
        if (!selectedArea || !selectedDate) return null;

        try {
            const response = await fetch(`https://www.finnkino.fi/xml/Schedule/?area=${selectedArea}&date=${selectedDate}`);
            const xml = await response.text()
            const parser = new DOMParser()
            const xmlDoc = parser.parseFromString(xml, 'application/xml') 
            const movieElements = xmlDoc.getElementsByTagName('Show')
            const tempMovies = Array.from(movieElements).map(movie => ({
                title: movie.getElementsByTagName('Title')[0].textContent,
                image: movie.getElementsByTagName('EventSmallImagePortrait')[0].textContent,
                id: movie.getElementsByTagName('ID')[0].textContent
            }))
            setMovies(tempMovies)
        } catch (error) {
            alert('Error fetching movies:', error)
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
                {movies.length > 0 ? (
                    <ul>
                        {movies.map(movie => (
                            <li key={movie.id}>
                                <img src={movie.image} alt={movie.title} style={{ width: '100px', height: '150px' }} />
                                <p>{movie.title}</p>
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
