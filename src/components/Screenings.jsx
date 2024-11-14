import Navbar from "./Navbar";
import { useState, useEffect } from "react";

const Screenings = () => {
    const [dates, setDates] = useState([]);
    const [areas, setAreas] = useState([]);
    const [selectedArea, setSelectedArea] = useState('');
    const [selectedDate, setSelectedDate] = useState('');

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
    };

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
        };
        
        fetchData();
    }, []); 

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
                    <option value="">--Select an Area--</option>
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
        </>
    );
};

export default Screenings;
