import axios from 'axios';
const BASE_URL =
  'https://pixabay.com/api/?key=29564245-0babaf5e9f754f21fa651fdf5&q';

const BASE_PARAMS = 'image_type=photo&orientation=horizontal&safesearch=true';

export class ApiPixabay {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
    this.perPage = 40;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    return (this.searchQuery = newQuery);
  }

  apiPixabay() {
    console.log('это this', this);
    return axios.get(
      `${BASE_URL}=${this.searchQuery}&${BASE_PARAMS}&page=${this.page}&per_page=${this.perPage}`
    );
  }

  resetPage() {
    this.page = 1;
  }

  changePage() {
    this.page += 1;
  }
}
