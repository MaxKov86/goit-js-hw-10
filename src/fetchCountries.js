const URL = 'https://restcountries.com/v3.1/name/';
const fields = 'fields=name,capital,population,flags,languages';

export function fetchCountries(name) {
  return fetch(`${URL}${name}?${fields}`)
    .then(response => response.json())
    .catch(error => Notify.failure('Oops, there is no country with that name'));
}
