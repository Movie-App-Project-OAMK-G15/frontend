import Navbar from "./Navbar";
import { useState, useEffect } from "react";

const Screenings = () => {
    const [dates, setDates] = useState([]);
    const [areas, setAreas] = useState([]);

    async function fetchXMLData(){
        try {
          const response = await fetch('https://www.finnkino.fi/xml/ScheduleDates/');
          const xmlText = await response.text();

          const parser = new DOMParser();
          const xmlDoc = parser.parseFromString(xmlText, 'text/xml');

          const movieElements = Array.from(xmlDoc.getElementsByTagName('dateTime'));
          const dateOnlyList = movieElements.map(item => item.textContent.split("T")[0].trim());

          const responseForAreas = await fetch('https://www.finnkino.fi/xml/TheatreAreas/');
          const xmlTextAres = await responseForAreas.text();
          const docXml = parser.parseFromString(xmlTextAres, 'text/xml')

          const areaElements = Array.from(docXml.getElementsByTagName('TheatreArea'));
          const areaList = areaElements.map(item => item.textContent.trim());

          setAreas(areaList)
          setDates(dateOnlyList);
        } catch (error) {
          alert('Error fetching or parsing XML data:', error);
        }
    };

    async function fetchMoviesForDate(){

    }

    useEffect(() => {
        fetchXMLData(); 
    }, []); 

    return (
        <>
            <Navbar/>
            <div>
                {dates.map((item, index) => (
                    <li key={index} onClick={fetchMoviesForDate}>{item}</li>
                ))}
            </div>
            <div>
                {areas.map((item, index) => (
                    <li key={index} onClick={fetchMoviesForDate}>{item}</li>
                ))}
            </div>
        </>
    );
};

export default Screenings;
