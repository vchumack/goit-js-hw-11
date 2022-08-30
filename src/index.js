import axios from 'axios';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { ApiPixabay } from './apiPixabay';
import { createMarkup } from './markup';

export const refs = {
  form: document.querySelector('.search-form'),
  div: document.querySelector('.gallery'),
  btnLoadMore: document.querySelector('.load-more'),
};

refs.form.addEventListener('submit', onFormSubmit);
refs.btnLoadMore.addEventListener('click', onbtnLoadMoreClick);

hiddenLoadMoreBtn();

var lightbox = new SimpleLightbox('.gallery a');

const newApiPixabay = new ApiPixabay();

function onFormSubmit(e) {
  e.preventDefault();
  resetMarkup();

  newApiPixabay.query = e.currentTarget.elements.searchQuery.value;

  handlingQuery();
}

// асинхронная функция для обработки нашего запроса, она принимает ответ от бекенда и вызывает генерацию разметки
async function handlingQuery() {
  try {
    hiddenLoadMoreBtn();
    newApiPixabay.resetPage();
    const getAPI = await newApiPixabay.apiPixabay();
    console.log(getAPI.data.hits);

    if (getAPI.data.hits.length === 0) {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }

    createMarkup(getAPI.data.hits);

    // обновляет то, что появилось в моем ДОМе
    lightbox.refresh();

    //функция для показа кол-ва найденных изображений
    showTotalHits(getAPI.data.totalHits);
    showLoadMoreBtn();
  } catch (error) {
    console.log(error);
  }
}

// функция для обработки запроса при повторном нажатии на вторую кнопку
async function onbtnLoadMoreClick(e) {
  try {
    newApiPixabay.changePage();
    const getAPIAgain = await newApiPixabay.apiPixabay();

    createMarkup(getAPIAgain.data.hits);

    lightbox.refresh();

    scroll();

    if (
      // если кол-во запрашиваемых элементов будет больше, чем есть на бекенде
      newApiPixabay.page * newApiPixabay.perPage >=
      getAPIAgain.data.totalHits
    ) {
      Notify.info("We're sorry, but you've reached the end of search results.");
      hiddenLoadMoreBtn();
    }
  } catch (error) {
    console.log(error);
  }
}

// функция для показа общего количества изображений
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

function resetMarkup() {
  refs.div.innerHTML = '';
}

function hiddenLoadMoreBtn() {
  refs.btnLoadMore.style.display = 'none';
}

function showLoadMoreBtn() {
  refs.btnLoadMore.style.display = 'block';
}
