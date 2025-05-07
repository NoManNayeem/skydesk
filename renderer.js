const select = document.getElementById('citySelect');
const button = document.getElementById('fetchWeatherBtn');
const weatherBody = document.getElementById('weatherBody');
const resultCard = document.getElementById('resultCard');
const loading = document.getElementById('loading');

async function fetchWeather(city) {
  const geoRes = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}`
  );
  const geoData = await geoRes.json();
  if (!geoData.results?.length) throw new Error('Location not found');
  const { name, country, latitude, longitude } = geoData.results[0];

  const weatherRes = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
  );
  const { temperature, windspeed, weathercode } = (await weatherRes.json()).current_weather;
  return { city: `${name}, ${country}`, temperature, windspeed, code: weathercode };
}

button.addEventListener('click', async () => {
  const city = select.value;
  if (!city) return alert('Please select a city.');

  loading.classList.remove('hidden');
  resultCard.classList.add('hidden');
  weatherBody.innerHTML = '';

  try {
    const data = await fetchWeather(city);
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${data.city}</td>
      <td>${data.temperature}°C</td>
      <td>${data.windspeed} km/h</td>
      <td>${data.code}</td>
    `;
    weatherBody.appendChild(row);
    resultCard.classList.remove('hidden');
  } catch (err) {
    alert(`Error: ${err.message}`);
  } finally {
    loading.classList.add('hidden');
  }
});

console.log('SkyDesk renderer loaded');
