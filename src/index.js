import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { fetchCountries } from './fetchCountries';
import refs from './refs';

const DEBOUNCE_DELAY = 300;

const debounce = require('lodash.debounce');

refs.countryInput.addEventListener(
  'input',
  debounce(onCountryInput, DEBOUNCE_DELAY)
);

function onCountryInput(e) {
  e.preventDefault();
  refs.countryList.innerHTML = '';
  refs.countryInfo.innerHTML = '';
  const searchQuery = e.target.value.trim();

  fetchCountries(searchQuery)
    .then(countries => {
      if (countries.length === 1) {
        refs.countryList.insertAdjacentHTML(
          'beforeend',
          renderCountryList(countries)
        );
        refs.countryInfo.insertAdjacentHTML(
          'beforeend',
          renderCountryInfo(countries)
        );
      } else if (countries.length >= 2 && countries.length <= 10) {
        refs.countryList.insertAdjacentHTML(
          'beforeend',
          renderCountryList(countries)
        );
      } else if (countries.length > 10) {
        return Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      } else if (countries.status === 404) {
        return Notify.failure('Oops, there is no country with that name');
      }
    })
    .catch(error => Notify.failure('Oops, there is no country with that name'));
}

function renderCountryList(country) {
  const markup = country
    .map(({ name, flags }) => {
      return `<li class="country-list_item">
        <img class="country-list_flag" src="${flags.svg}" alt="${name}" with = 30px height = 30px">
        <h2 class="country-list_name">${name.official}</h2>
      </li>`;
    })
    .join(``);
  return markup;
}

function renderCountryInfo(country) {
  const markup = country
    .map(({ capital, population, languages }) => {
      return `<ul class="country-info_list">
        <li class="country-info_item"><span>Capital:</span>  ${capital}</li>
        <li class="country-info_item"><span>Population:</span>  ${population}</li>
        <li class="country-info_item"><span>Languages:</span>  ${Object.values(
          languages
        ).join(', ')}</li>
    </ul>`;
    })
    .join(``);
  return markup;
}
