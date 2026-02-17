import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { IoIosSearch } from "react-icons/io";
import { BsFillSunriseFill, BsFillSunsetFill } from "react-icons/bs";
import { FaTemperatureArrowUp, FaTemperatureArrowDown } from "react-icons/fa6";
import { FaCloudRain, FaRegSnowflake } from "react-icons/fa";
import { GiWhirlwind, GiWindsock } from "react-icons/gi";
import { CircleLoader } from 'react-spinners';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Home = () => {
    const [loading, setLoading] = useState(false);
    const [date] = useState(new Date());
    const [input, setInput] = useState("Mumbai");
    const [city, setCity] = useState("Mumbai");
    const [weatherData, setWeatherData] = useState(null);
    const [toggle, setToggle] = useState(true);
    const [dayForecast, setDayForecast] = useState(true);
    const [isInitialLoad, setIsInitialLoad] = useState(true);

    const inputRef = useRef(null);
    const hourlyRef = useRef(null);

    const formatTo12Hour = (timeString) => {
        const date = new Date(timeString);
        return date.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
        });
    };

    const formatDate = (dateStr) => {
        const [year, month, day] = dateStr.split("-");
        const date = new Date(`${year}-${month}-${day}`);
        const weekday = date.toLocaleString("en-US", { weekday: "short" }).toLowerCase();
        const monthName = date.toLocaleString("en-US", { month: "short" }).toLowerCase();
        return `${weekday}, ${monthName}`;
    };

    const getWeatherData = async (query) => {
        if (!query) return;

        try {
            setLoading(true);

            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}${import.meta.env.VITE_API_KEY}&q=${query}&days=10&aqi=no&alerts=no`
            );

            setWeatherData(response.data);
        } catch (error) {
            console.error(error);
            setWeatherData(null);
            toast.error("City not found");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!navigator.geolocation) {
            getWeatherData(city);
            setIsInitialLoad(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                getWeatherData(`${latitude},${longitude}`);
                setIsInitialLoad(false);
            },
            () => {
                getWeatherData(city);
                setIsInitialLoad(false);
            }
        );
    }, []);

    useEffect(() => {
        if (isInitialLoad) return;
        if (!city) return;
        getWeatherData(city);
    }, [city]);

    const handleSearch = () => {
        const value = inputRef.current.value.trim();

        if (!value) {
            return toast.error("Please search for city");
        }

        setCity(value);
        inputRef.current.value = "";
    };

    useEffect(() => {
        if (!weatherData) return;

        const currentHour = new Date().getHours();

        const index = weatherData.forecast.forecastday[0].hour.findIndex(
            (h) => new Date(h.time).getHours() === currentHour
        );

        if (index !== -1 && hourlyRef.current) {
            const element = document.getElementById(`hour-${index}`);
            element?.scrollIntoView({
                behavior: "smooth",
                inline: "center",
                block: "nearest"
            });
        }
    }, [weatherData]);

    return (
        <div className="py-5 px-4 sm:px-6 lg:p-10 text-white primary-bg min-h-screen">
            <nav className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
                <h1 className="text-lg sm:text-xl font-bold">
                    {date.toDateString()}
                </h1>

                <div className="flex items-center gap-5">
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleSearch();
                        }}
                        className="flex border px-3 py-2 rounded-full w-full sm:w-72 items-center"
                    >
                        <input
                            ref={inputRef}
                            className="w-full outline-none bg-transparent"
                            type="text"
                            placeholder="Search city"
                            onChange={(e) => setInput(e.target.value)}
                        />
                        <button type="submit">
                            <IoIosSearch className="text-2xl cursor-pointer" />
                        </button>
                    </form>

                    <form>
                        <input onChange={() => setToggle(!toggle)} className="hidden" type="checkbox" name="toggle" id="toggle" />
                        <label id="toggleBtn" htmlFor="toggle" className="relative flex items-center justify-evenly border-2 w-20 h-10 secondary-bg rounded-full cursor-pointer">
                            <p>°C</p> <p>°F</p>
                        </label>
                    </form>

                </div>
            </nav>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                <div className="col-span-1 lg:col-span-2 secondary-bg py-5 px-4 sm:px-6 lg:px-8 rounded-4xl">
                    {loading && <div className="w-full h-full flex justify-center items-center"><CircleLoader color="#ffffff" /></div>}
                    {weatherData && !loading && (
                        <>
                            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                                <div className="flex gap-5">
                                    <img src={weatherData.current.condition.icon} alt="Weather Icon" />
                                    <div>
                                        <h1 className="text-2xl lg:text-3xl font-semibold">
                                            {weatherData.location.name}
                                        </h1>
                                        <p className="text-gray-400">
                                            {weatherData.location.region}, {weatherData.location.country}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-6 lg:gap-10">
                                    <div>
                                        <h1 className="text-2xl lg:text-3xl font-semibold">
                                            {toggle ? `${Math.round(weatherData.current.temp_c)}°c` : `${Math.round(weatherData.current.temp_f)}°f`}
                                        </h1>
                                        <p className="text-gray-400">Temperature</p>
                                    </div>
                                    <div>
                                        <h1 className="text-2xl lg:text-3xl font-semibold">
                                            {weatherData.current.humidity}%
                                        </h1>
                                        <p className="text-gray-400">Humidity</p>
                                    </div>
                                    <div>
                                        <h1 className="text-2xl lg:text-3xl font-semibold">
                                            {weatherData.current.wind_kph}km/h
                                        </h1>
                                        <p className="text-gray-400">Wind Speed</p>
                                    </div>
                                </div>
                            </div>

                            <div ref={hourlyRef} className="flex gap-3 overflow-x-auto py-5 scroll-smooth">
                                {weatherData.forecast.forecastday[0].hour.map((h, i) => {
                                    const currentHour = new Date().getHours();
                                    const hourValue = new Date(h.time).getHours();
                                    const isCurrent = currentHour === hourValue;

                                    return (
                                        <div
                                            key={i}
                                            id={`hour-${i}`}
                                            className={`flex flex-col items-center gap-2 px-3 py-4 rounded-2xl min-w-24 transition-all duration-300 ${isCurrent ? "bg-zinc-900 scale-105 shadow-lg" : "third-bg"}`}
                                        >
                                            <h1 className="text-xs font-semibold">
                                                {formatTo12Hour(h.time)}
                                            </h1>
                                            <img src={h.condition.icon} alt="Weather image" />
                                            <h1 className="font-semibold">
                                                {toggle ? `${Math.round(h.temp_c)}°c` : `${Math.round(h.temp_f)}°f`}
                                            </h1>
                                        </div>
                                    );
                                })}
                            </div>
                        </>
                    )}
                </div>

                {/* RIGHT FORECAST */}
                <div className="row-span-1 lg:row-span-2 flex flex-col gap-5 secondary-bg py-4 px-4 sm:px-6 rounded-4xl">
                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl lg:text-4xl">Forecasts</h1>
                        <form> <input onChange={() => setDayForecast(!dayForecast)} className="hidden" type="checkbox" name="toggle" id="dayForecastInput" /> <label id="dayForecast" htmlFor="dayForecastInput" className="relative flex items-center justify-evenly border-2 w-30 h-10 secondary-bg rounded-full cursor-pointer"> <p>4 days</p> <p>9 days</p> </label> </form>
                    </div>

                    <div className="flex flex-col max-h-[60vh] lg:h-[77vh] overflow-y-auto gap-5">
                        {weatherData && (
                            weatherData.forecast.forecastday
                                .filter(d => d.date !== new Date().toLocaleDateString("en-CA"))
                                .map((d, i) => {
                                    let numberOfDay = dayForecast === true ? 4 : 9;
                                    if (i < numberOfDay) {
                                        const [year, month, day] = d.date.split("-");
                                        return (
                                            <div key={i}
                                                className="flex justify-between items-center text-xl lg:text-2xl third-bg p-4 lg:p-4 rounded-2xl">
                                                <div className="flex gap-5 items-center">
                                                    <img className="w-8" src={d.day.condition.icon} alt="weather img" />
                                                    <h1>
                                                        {toggle
                                                            ? `${Math.round(d.day.maxtemp_c)}°c`
                                                            : `${Math.round(d.day.maxtemp_f)}°f`}
                                                    </h1>
                                                </div>
                                                <div className="flex w-20 items-baseline gap-1">
                                                    <p>{day}</p>
                                                    <p className="capitalize text-[12px]">
                                                        {formatDate(`${year}-${month}-${day}`)}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    }
                                    return null;
                                })
                        )}
                    </div>
                </div>

                {/* BOTTOM INFO */}
                {weatherData && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 col-span-1 lg:col-span-2">

                        {/* SUN */}
                        <div className="secondary-bg p-4 rounded-xl">
                            <h1 className="mb-4 text-2xl">Sunrise & Sunset</h1>
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-3">
                                    <BsFillSunriseFill />
                                    {weatherData.forecast.forecastday[0].astro.sunrise}
                                </div>
                                <div className="flex items-center gap-3">
                                    <BsFillSunsetFill />
                                    {weatherData.forecast.forecastday[0].astro.sunset}
                                </div>
                            </div>
                        </div>

                        {/* TEMP */}
                        <div className="secondary-bg p-4 rounded-xl">
                            <h1 className="mb-4 text-2xl">Max & Min</h1>
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-3">
                                    <FaTemperatureArrowUp />
                                    <p>
                                        Max: {toggle
                                            ? `${Math.round(weatherData.forecast.forecastday[0].day.maxtemp_c)}°c`
                                            : `${Math.round(weatherData.forecast.forecastday[0].day.maxtemp_f)}°f`}
                                    </p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <FaTemperatureArrowDown />
                                    <p>
                                        Min: {toggle
                                            ? `${Math.round(weatherData.forecast.forecastday[0].day.mintemp_c)}°c`
                                            : `${Math.round(weatherData.forecast.forecastday[0].day.mintemp_f)}°f`}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* RAIN */}
                        <div className="secondary-bg p-4 rounded-xl">
                            <h1 className="mb-4 text-2xl">Rain & Snow</h1>
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-3">
                                    <FaCloudRain />
                                    <p>
                                        Rain: {weatherData.forecast.forecastday[0].day.daily_chance_of_rain}% chance
                                    </p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <FaRegSnowflake />
                                    <p>
                                        Snow: {weatherData.forecast.forecastday[0].day.daily_chance_of_snow}% chance
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* WIND */}
                        <div className="secondary-bg p-4 rounded-xl">
                            <h1 className="mb-4 text-xl">Degree & Direction</h1>
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-3">
                                    <GiWhirlwind />
                                    <p>
                                        Wind Degree {weatherData.current.wind_degree}°
                                    </p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <GiWindsock />
                                    <p>
                                        Wind Direction "{weatherData.current.wind_dir}"
                                    </p>
                                </div>
                            </div>
                        </div>

                    </div>
                )}

            </div>

            <ToastContainer
                position="top-left"
                autoClose={5000}
                hideProgressBar={false}
                closeOnClick
                pauseOnHover
                theme="light"
            />
        </div>
    );
};

export default Home;
