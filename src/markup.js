import { refs } from './index';

export function createMarkup(arr) {
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
      <img width=300 height=200 src=${webformatURL} alt=${tags} loading="lazy" />
    </a>
    <div class="info">
      <p class="info-item">
      <span><b>Likes</b></span><span>${likes}</span> 
      </p>
      <p class="info-item">
        <span><b>Views</b></span><span>${views}</span>
      </p>
      <p class="info-item">
        <span><b>Comments</b></span><span>${comments}</span>
      </p>
      <p class="info-item">
        <span><b>Downloads</b></span><span>${downloads}</span>
      </p>
    </div>
  </div>`;
    }
  );

  refs.div.insertAdjacentHTML('beforeend', markup.join(''));
}
