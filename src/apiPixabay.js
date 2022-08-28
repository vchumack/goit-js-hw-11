import axios from 'axios';
export default class ApiPixabay {
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

  async apiPixabay() {
    console.log('это this', this);
    this.page = 1;
    return await axios.get(
      `https://pixabay.com/api/?key=29564245-0babaf5e9f754f21fa651fdf5&q=${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${this.page}&per_page=${this.perPage}`
    );
  }

  async apiPixabayLoadMore() {
    console.log('это this', this);
    this.page += 1;
    return await axios.get(
      `https://pixabay.com/api/?key=29564245-0babaf5e9f754f21fa651fdf5&q=${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${this.page}&per_page=${this.perPage}`
    );
  }
}
