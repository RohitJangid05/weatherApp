import React, { useEffect, useState } from 'react';
import { API_KEY } from "../../ApiKey.js";
import axios from 'axios';
import './Weather.css';
import { assets } from '../../assets/assets.js';
import { audio } from '../../assets/assets.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot, faCloud, faTemperatureThreeQuarters, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

const Weather = () => {
    const [City, setCity] = useState("delhi");
    const [Data, setData] = useState({});
    const [loading, setLoading] = useState(true);
    const [inputValue, setInputValue] = useState("");

    const ApiUrl = 'https://api.openweathermap.org/data/2.5/weather';

    async function getWeather() {
        setLoading(true);
        try {
            const response = await axios.get(ApiUrl, { params: { q: City, appid: API_KEY } });
            setData(response.data);
        } catch (error) {
            if (error.response && error.response.status === 404) {
                alert("City not found");
            } else {
                console.error("Error fetching weather data:", error);
            }
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getWeather();
    }, [City]);

    function handleSubmit(e) {
        e.preventDefault();
        if (inputValue.trim() === "") {
            alert("Please enter a city name");
        } else {
            setCity(inputValue);
            setInputValue("");
        }
    }

    let imgSrc = "";
    let bgColor = "";
    let weatherAudio = "";

    if (Data.weather && Data.weather.length > 0) {
        switch (Data.weather[0].main) {
            case "Haze":
                imgSrc = assets.haze;
                weatherAudio = audio.hazeAudio;
                bgColor = "#7a5557cc";
                break;
            case "Clear":
                imgSrc = assets.sunny;
                weatherAudio = audio.sunnyAudio;
                bgColor = "#ffa600c7";
                break;
            case "Clouds":
                imgSrc = assets.cloudy;
                weatherAudio = audio.cloudAudio;
                bgColor = "#000000e8";
                break;
            case "Rain":
                imgSrc = assets.rainy;
                weatherAudio = audio.rainAudio;
                bgColor = "#4f8ea7bd";
                break;
            case "Snow":
                imgSrc = assets.snowy;
                weatherAudio = audio.snowyAudio;
                bgColor = "antiquewhite";
                break;
            case "thunderstrome":
                imgSrc = assets.thunder;
                weatherAudio = audio.thunderAudio;
                bgColor = "grey";
            case "Mist":
                imgSrc = assets.mist;
                weatherAudio=audio.mistAudio
                bgColor="#000000cc";
            default:
                imgSrc=assets.defaultImg;
                weatherAudio=audio.defaultAudio;
                bgColor = "black";
        }
    }

    return (
        <div className="main">
            {loading ? (
                <div className="loader">
                    <div className="loading"></div>
                </div>
            ) : (
                <div className='container' style={{ backgroundColor: bgColor }}>
                    <audio src={weatherAudio} autoPlay loop></audio>
                    <h1>Weather App</h1>
                    <div className="section-top">
                        <form onSubmit={handleSubmit}>
                            <input
                                type="text"
                                placeholder='Search for City'
                                id='input'
                                value={inputValue}
                                onChange={(e) => {
                                    setInputValue(e.target.value);
                                }}
                            />
                            <button type="submit"><FontAwesomeIcon icon={faMagnifyingGlass} /></button>
                        </form>
                    </div>
                    <div className="section-mid">
                        <div className="left">
                            <img src={imgSrc} alt="" />
                        </div>
                        <div className="right">
                            <p><FontAwesomeIcon icon={faCloud} /> {Data.weather && Data.weather.length > 0 && Data.weather[0].main}</p>
                            <p><FontAwesomeIcon icon={faLocationDot} /> {Data.name}</p>
                            <p><FontAwesomeIcon icon={faTemperatureThreeQuarters} /> {Data.main && (Data.main.temp - 273.15).toFixed(2)} °C</p>
                        </div>
                    </div>
                    <div className="section-bottom">
                        <p>Humidity: {Data.main && Data.main.humidity}</p>
                        <p>Feels like: {Data.main && (Data.main.feels_like - 273.15).toFixed(2)} °C</p>
                        <p>Min Temp: {Data.main && (Data.main.temp_min - 273.15).toFixed(2)} °C</p>
                        <p>Max Temp: {Data.main && (Data.main.temp_max - 273.15).toFixed(2)} °C</p>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Weather;
