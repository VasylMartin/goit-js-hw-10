const BASE_URL = 'https://restcountries.com/v3.1';
const FILTER = '?fields=name,capital,population,flags,languages';


function fetchCountries(countryName) {
    return fetch(`${BASE_URL}/name/${countryName}${FILTER}`)
        .then(response => {
            return response.json();
        });
}

export { fetchCountries };