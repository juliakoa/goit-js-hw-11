import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const searchForm = document.getElementById('search-form');
const gallery = document.querySelector('.gallery');
const loadMoreButton = document.querySelector('.load-more');

let currentPage = 1;
let currentSearchQuery = '';

function createPhotoCard(photo) {
  const photoCard = document.createElement('div');
  photoCard.classList.add('photo-card');

  const link = document.createElement('a');
  link.href = photo.largeImageURL;
  link.setAttribute('data-lightbox', 'gallery');

  const img = document.createElement('img');
  img.src = photo.webformatURL;
  img.alt = photo.tags;
  img.loading = 'lazy';

  const info = document.createElement('div');
  info.classList.add('info');

  const likes = document.createElement('p');
  likes.classList.add('info-item');
  likes.innerHTML = `<b>Likes:</b> ${photo.likes}`;

  const views = document.createElement('p');
  views.classList.add('info-item');
  views.innerHTML = `<b>Views:</b> ${photo.views}`;

  const comments = document.createElement('p');
  comments.classList.add('info-item');
  comments.innerHTML = `<b>Comments:</b> ${photo.comments}`;

  const downloads = document.createElement('p');
  downloads.classList.add('info-item');
  downloads.innerHTML = `<b>Downloads:</b> ${photo.downloads}`;

  info.appendChild(likes);
  info.appendChild(views);
  info.appendChild(comments);
  info.appendChild(downloads);

  photoCard.appendChild(link);
  photoCard.appendChild(info);
  link.appendChild(img);

  return photoCard;
}

async function searchImages(searchQuery, page) {
  try {
    const apiKey = '37000031-e6b60df7e9a676387d8c0c5ad';

    const response = await axios.get('https://pixabay.com/api/', {
      params: {
        key: apiKey,
        q: searchQuery,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        per_page: 40,
        page: page,
      },
    });

    const data = response.data;
    const photos = data.hits;
    const totalHits = data.totalHits;

    if (photos.length === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    } else {
      const photoCards = photos.map(createPhotoCard);
      gallery.append(...photoCards);

      if (photos.length < totalHits) {
        loadMoreButton.style.display = 'block';
      } else {
        loadMoreButton.style.display = 'none';
        Notiflix.Notify.failure(
          "We're sorry, but you've reached the end of search results."
        );
      }
    }
    const lightBoxImplementation = new SimpleLightbox('.photo-card a', {
      captionsData: 'alt',
      captionsDelay: '250',
    });
    lightBoxImplementation.refresh();
  } catch (error) {
    Notiflix.Notify.failure('Oops! Something went wrong. Please try again.');
  }
}

searchForm.addEventListener('submit', function (event) {
  event.preventDefault();

  const searchQuery = event.target.searchQuery.value.trim();

  currentPage = 1;
  currentSearchQuery = searchQuery;
  gallery.innerHTML = '';

  searchImages(searchQuery, currentPage);
});

loadMoreButton.addEventListener('click', function () {
  currentPage++;
  searchImages(currentSearchQuery, currentPage);
});
