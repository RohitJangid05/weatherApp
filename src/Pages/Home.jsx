import axios from "axios";
import { useEffect, useState } from "react";
import { IoIosSearch } from "react-icons/io";
import { BsFillSunriseFill, BsFillSunsetFill } from "react-icons/bs";
import { FaTemperatureArrowUp, FaTemperatureArrowDown } from "react-icons/fa6";
import { FaCloudRain, FaRegSnowflake } from "react-icons/fa";
import { GiWhirlwind, GiWindsock } from "react-icons/gi";


const Home = () => {
    const [loading, setLoading] = useState(false);
    const [date] = useState(new Date());
    const [input, setInput] = useState("Mumbai");
    const [city, setCity] = useState("Mumbai");
    const [weatherData, setWeatherData] = useState(null);
    const [error, setError] = useState(null);
    const [toggle, setToggle] = useState(true)

    const formatTo12Hour = (timeString) => {
        const date = new Date(timeString);
        return date.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
        });
    };

    const formatDate = (dateStr) => {
        const [day, month, year] = dateStr.split("-");
        const date = new Date(`${year}-${month}-${day}`);
        const weekday = date.toLocaleString("en-US", { weekday: "short" }).toLowerCase();
        const monthName = date.toLocaleString("en-US", { month: "short" }).toLowerCase();
        return `${weekday}, ${monthName}`;
    };

    const getWeatherData = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}${import.meta.env.VITE_API_KEY}&q=${city}&days=10&aqi=no&alerts=no`
            );
            setWeatherData(response.data);
        } catch {
            setError("City not found");
            setWeatherData(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            if (input.trim()) setCity(input);
        }, 600);
        return () => clearTimeout(timer);
    }, [input]);

    useEffect(() => {
        getWeatherData();
        console.log(weatherData)
    }, [city]);

    return (
        <div className="py-5 px-4 sm:px-6 lg:p-10 text-white primary-bg min-h-screen">
            {/* NAV */}
            <nav className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
                <h1 className="text-lg sm:text-xl font-bold">
                    {loading ? "Loading..." : date.toDateString()}
                </h1>

                <div className="flex items-center gap-5">
                    <div className="flex border px-3 py-2 rounded-full w-full sm:w-72 items-center">
                        <input
                            className="w-full outline-none bg-transparent"
                            type="text"
                            placeholder="Search city"
                            onChange={(e) => setInput(e.target.value)}
                        />
                        <IoIosSearch className="text-2xl" />
                    </div>
                    <form>
                        <input onChange={() => setToggle(!toggle)} className="hidden" type="checkbox" name="toggle" id="toggle" />
                        <label
                            id="toggleBtn"
                            htmlFor="toggle"
                            className="relative flex items-center justify-evenly border-2 w-16 h-8 secondary-bg rounded-full cursor-pointer"
                        >
                            <p>°C</p>
                            <p>°F</p>
                        </label>
                    </form>
                </div>
            </nav>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                {/* LEFT TOP CARD */}
                <div className="col-span-1 lg:col-span-2 secondary-bg py-5 px-4 sm:px-6 lg:px-8 rounded-4xl">
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

                            {/* HOURLY */}
                            <div className="flex gap-3 overflow-x-auto py-5">
                                {weatherData.forecast.forecastday[0].hour.map((h, i) => (
                                    <div
                                        key={i}
                                        className="flex flex-col items-center gap-2 third-bg px-3 py-4 rounded-2xl min-w-21.25 lg:min-w-22.5"
                                    >
                                        <h1 className="text-xs">
                                            {formatTo12Hour(h.time)}
                                        </h1>
                                        <img src={h.condition.icon} alt="" />
                                        <h1 className="font-semibold">
                                            {toggle ? `${Math.round(h.temp_c)}°c` : `${Math.round(h.temp_f)}°f`}
                                        </h1>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>

                {/* RIGHT FORECAST (lg unchanged) */}
                <div className="row-span-1 lg:row-span-2 flex flex-col gap-5 secondary-bg py-4 px-4 sm:px-6 rounded-4xl">
                    <h1 className="text-2xl lg:text-4xl">Forecasts</h1>
                    <div className="flex flex-col max-h-[60vh] lg:h-[77vh] overflow-y-auto gap-5">
                        {weatherData &&
                            weatherData.forecast.forecastday.map((d, i) => (
                                <div
                                    key={i}
                                    className="flex justify-between items-center text-xl lg:text-2xl third-bg p-4 lg:p-5 rounded-2xl"
                                >
                                    <div className="flex gap-5 items-center">
                                        <img className="w-8" src={d.day.condition.icon} alt="" />
                                        <h1>{toggle ? `${Math.round(d.day.maxtemp_c)}°c` : `${Math.round(d.day.maxtemp_f)}°f`}</h1>
                                    </div>
                                    <div className="flex w-20 items-baseline gap-1">
                                        <p>{d.date.split("-")[2]}</p>
                                        <p className="capitalize text-[12px]">
                                            {formatDate(d.date.split("-").reverse().join("-"))}
                                        </p>
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>

                {/* BOTTOM INFO */}
                {weatherData && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 col-span-1 lg:col-span-2">
                        {/* SUN */}
                        <div className=" secondary-bg p-4 rounded-xl">
                            <h1 className="mb-4 text-2xl">Sunrise & Sunset</h1>
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-3">
                                    <BsFillSunriseFill /> {weatherData.forecast.forecastday[0].astro.sunrise}
                                </div>
                                <div className="flex items-center gap-3">
                                    <BsFillSunsetFill /> {weatherData.forecast.forecastday[0].astro.sunset}
                                </div>
                            </div>
                        </div>

                        {/* TEMP */}
                        <div className=" secondary-bg p-4 rounded-xl">
                            <h1 className="mb-4 text-2xl">Max & Min</h1>
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-3">
                                    <FaTemperatureArrowUp />
                                    <p className="text-md">Max: {toggle ? `${Math.round(weatherData.forecast.forecastday[0].day.maxtemp_c)}°c` : `${Math.round(weatherData.forecast.forecastday[0].day.maxtemp_f)}°f`}</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <FaTemperatureArrowDown />
                                    <p className="text-sm">Min: {toggle ? `${Math.round(weatherData.forecast.forecastday[0].day.mintemp_c)}°c` : `${Math.round(weatherData.forecast.forecastday[0].day.mintemp_f)}°f`}</p>
                                </div>
                            </div>
                        </div>

                        {/* RAIN */}
                        <div className=" secondary-bg p-4 rounded-xl">
                            <h1 className="mb-4 text-2xl">Rain & Snow</h1>
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-3">
                                    <FaCloudRain />
                                    <p className="text-sm">Rain: {weatherData.forecast.forecastday[0].day.daily_chance_of_rain}% chance</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <FaRegSnowflake />
                                    <p className="text-sm">snow: {weatherData.forecast.forecastday[0].day.daily_chance_of_snow}% chance</p>
                                </div>
                            </div>
                        </div>
                        {/* wind  */}
                        <div className="text-xl secondary-bg p-4 rounded-xl">
                            <h1 className="mb-4">Degree & Direction</h1>
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-3 ">
                                    <GiWhirlwind />
                                    <p className="text-sm">Wind Degree {weatherData.current.wind_degree}</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <GiWindsock />
                                    <p className="text-sm">Wind Direction {weatherData.current.wind_dir}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {error && <p className="text-red-500 mt-4">{error}</p>}
        </div>
    );
};

export default Home;
