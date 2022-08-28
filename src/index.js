import axios from 'axios';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import ApiPixabay from './apiPixabay';

const refs = {
  form: document.querySelector('.search-form'),
  div: document.querySelector('.gallery'),
  btnLoadMore: document.querySelector('.load-more'),
};

var lightbox = new SimpleLightbox('.gallery a');

refs.form.addEventListener('submit', onFormSubmit);
refs.btnLoadMore.addEventListener('click', onbtnLoadMoreClick);
refs.btnLoadMore.style.display = 'none';

const newApiPixabay = new ApiPixabay();

function onFormSubmit(e) {
  e.preventDefault();

  // записываем то, что ввел пользователь
  newApiPixabay.query = e.currentTarget.elements.searchQuery.value;
  console.log(newApiPixabay);

  handlingQuery();
}

async function onbtnLoadMoreClick(e) {
  try {
    const getAPIAgain = await newApiPixabay.apiPixabayLoadMore();
    console.log('getAPIAgain -- ', getAPIAgain);

    createMarkup(getAPIAgain.data.hits);
    lightbox.refresh();
    scroll();
    if (
      newApiPixabay.page * newApiPixabay.perPage >=
      getAPIAgain.data.totalHits
    ) {
      Notify.info("We're sorry, but you've reached the end of search results.");
      refs.btnLoadMore.style.display = 'none';
    }
  } catch (error) {
    console.log(error);
  }
}

//асинхронная функция для обработки нашего запроса, она принимает ответ от бекенда и
async function handlingQuery() {
  try {
    refs.btnLoadMore.style.display = 'none';
    const getAPI = await newApiPixabay.apiPixabay();
    console.log(getAPI.data.hits);

    // стираем старую разметку, когда приходит запрос с сервера
    refs.div.innerHTML = '';

    createMarkup(getAPI.data.hits);
    lightbox.refresh();
    showTotalHits(getAPI.data.totalHits);
    refs.btnLoadMore.style.display = 'block';
  } catch (error) {
    console.log(error);
  }
}

function createMarkup(arr) {
  const markup = arr.map(
    ({
      webformatURL,
      largeImageURL,
      tags,
      likes,
      views,
      comments,
      downloads,
    }) => {
      return `<div class="photo-card">
       <a href=${largeImageURL}>
    <img width=300 src=${webformatURL} alt=${tags} loading="lazy" />
    </a>
    <div class="info">
      <p class="info-item">
        <b>Likes ${likes}</b>
      </p>
      <p class="info-item">
        <b>Views ${views}</b>
      </p>
      <p class="info-item">
        <b>Comments ${comments}</b>
      </p>
      <p class="info-item">
        <b>Downloads ${downloads}</b>
      </p>
    </div>
  </div>;`;
    }
  );

  refs.div.insertAdjacentHTML('beforeend', markup.join(''));
}

function showTotalHits(totalHits) {
  Notify.success(`Hooray! We found ${totalHits} images.`);
}

function scroll() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}
