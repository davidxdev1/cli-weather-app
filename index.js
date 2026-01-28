#!/usr/bin/env node
const axios = require("axios");

const city = process.argv[2];
if (!city) {
  console.error("❌ Please provide a city name. Example: node index.js London");
  process.exit(1);
}

async function getCoordinates(city) {
  const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${city}`;
  const geoRes = await axios.get(geoUrl);
  const location = geoRes.data.results?.[0];
  if (!location) throw new Error("City not found");

  return { lat: location.latitude, lon: location.longitude };
}

async function getWeather() {
  try {
    const { lat, lon } = await getCoordinates(city);
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;
    const weatherRes = await axios.get(weatherUrl);
    const weather = weatherRes.data.current_weather;

    console.log(`🌤 Weather in ${city}: ${weather.temperature}°C, wind ${weather.windspeed} km/h`);
  } catch (err) {
    console.error("❌", err.message);
  }
}

getWeather();