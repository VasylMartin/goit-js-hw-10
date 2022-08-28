import './css/styles.css';
import countryCardTpl from './template/country.hbs';
import smallCountryCardTpl from './template/small-country.hbs';
import { fetchCountries } from './js/fetchCountries';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import debounce from "lodash.debounce"

Notify.init({
    timeout: 1000,
});

const DEBOUNCE_DELAY = 300;

const refs = {
    countryInfo: document.querySelector('.country-info'),
    search: document.getElementById('search-box')
}

refs.search.addEventListener('input', debounce(onInputChange, DEBOUNCE_DELAY));


function onInputChange(e) {
    if (e.target.value === '') {
        refs.countryInfo.innerHTML = '';
        return
    }

    fetchCountries(e.target.value.trim())
        
    .then(array => { 
        
        if (array.length > 10) {
            refs.countryInfo.innerHTML = '';
            Notify.info('Too many matches found. Please enter a more specific name.');
        }
        else if ((array.length <= 10) && (array.length >= 2)) {
            renderCountriesCards(array);
        } else if (array.length === 1) {
            renderCountryCard(array);
        }
        else {
            refs.countryInfo.innerHTML = '';
            Notify.failure('Oops, there is no country with that name');
        }
    })
    .catch(onFetchError)
}

function renderCountriesCards(countries) {
    let markup = [];

        countries.map(country => {
            markup.push(smallCountryCardTpl(country));
        });
    refs.countryInfo.innerHTML = markup.join('');
}


function renderCountryCard(country) {
    for (let i = 0; i < country.length; i += 1) {

        refs.countryInfo.innerHTML = `<div class="card">
                <div class="card-flag">
                <img src="${country[i].flags.svg}" alt="${country[i].name.official}">
                </div> 
                <h2 class="card-name">${country[i].name.official}</h2>
                <p class="card-text">Capital: ${country[i].capital}</p>
                <p class="card-text">Population: ${country[i].population}</p>
                <p class="card-text">Languages: ${Object.values(country[i].languages)}
            </div>`
    }
}

function onFetchError(error) {
    refs.countryInfo.innerHTML = '';
    console.log(error);
    Notify.failure('Oops, something went wrong');
}