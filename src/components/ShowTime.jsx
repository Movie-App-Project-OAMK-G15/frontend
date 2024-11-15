import Navbar from "./Navbar";
import { useState, useEffect } from "react";
import '../styles/ShowTime.css'

const ShowTimes = () => {
    const [dates, setDates] = useState([]);
    const [areas, setAreas] = useState([]);
    const [selectedArea, setSelectedArea] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
    const [times, setTimes] = useState([]);
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
    };

    async function showDateList(xml) {
        try {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(xml, 'application/xml');
            const dates = Array.from(xmlDoc.getElementsByTagName('dateTime'));
            const tempDates = dates.map(date => ({
                dateTime: date.textContent.split("T")[0]
            }));
            setDates(tempDates);
        } catch (error) {
            alert('Error fetching or parsing XML data:', error);
        }
    };

    async function showTimeList(xml) {
        try {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(xml, 'application/xml');
            const times = Array.from(xmlDoc.getElementsByTagName('dttmShowStart'));
            const tempTimes = times.map(time => ({
                dttmShowStart: time.textContent
            }));
            setTimes(tempTimes);
        } catch (error) {
            alert('Error fetching or parsing XML data:', error);
        }
    };

    async function fetchXMLData(){
        try {
            const areaResponse = await fetch('https://www.finnkino.fi/xml/TheatreAreas/');
            const areaXml = await areaResponse.text();
            showAreaList(areaXml);

            const dateResponse = await fetch('https://www.finnkino.fi/xml/ScheduleDates/');
            const dateXml = await dateResponse.text();
            showDateList(dateXml);

            const timeResponse = await fetch('https://www.finnkino.fi/xml/Schedule/');
            const timeXml = await timeResponse.text();
            showTimeList(timeXml);

        } catch (error) {
            console.log(error);
        }
    };

 

    useEffect(() => {
        fetchXMLData();
        fetchTimes();
    }, []); 

    return (
        <>
            <Navbar />
            <div className="container">
                <image></image>
                <h1>Movie title</h1>
                <h3>movie description............</h3>
            </div>
            <div className="dropdown">
                <div>
                    <label htmlFor="area-dropdown"></label>
                    <select 
                        id="area-dropdown" 
                        value={selectedArea} 
                        onChange={(e) => setSelectedArea(e.target.value)}
                    >
                        <option value="">--Select an Area--</option>
                        {areas.map(area => (
                            <option key={area.id} value={area.id}>{area.name}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label htmlFor="date-dropdown"></label>
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
                    <ul>
                        {times.map((time, index) => (
                            <li key={index}>{time.dttmShowStart}</li>
                        ))}
                    </ul>
                </div>
            <div>
                <li>

                </li>
            </div>
        </>
    );
};

export default ShowTimes;
