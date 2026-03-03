import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Logo } from '../../components/logo/logo';
import { FullOffer } from '../../types/offer';
import { NotFoundPage } from '../not-found-page/not-found-page';
import { ReviewsForm } from '../../components/reviews-form/reviews-form';
import { ReviewsList } from '../../components/reviews-list/reviews-list';
import { Map } from '../../components/map/map';
import { MapPoint } from '../../types/map';
import { NearPlacesList } from '../../components/near-places-list/near-places-list';
import { Review } from '../../types/review';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { fetchOfferAction, fetchReviewsAction } from '../../store/api-action';
import { LoadingPage } from '../../components/loading-page/loading-page';

function OfferPage() {
  const { id } = useParams();
  const dispatch = useAppDispatch();

  const currentOffer = useAppSelector((state) => state.currentOffer) as FullOffer | null;
  const isCurrentOfferLoading = useAppSelector((state) => state.isCurrentOfferLoading);
  const offers = useAppSelector((state) => state.offers);
  const reviews = useAppSelector((state) => state.reviews);

  const [selectedPoint, setSelectedPoint] = useState<MapPoint | undefined>(undefined);

  useEffect(() => {
    if (id) {
      dispatch(fetchOfferAction(id));
      dispatch(fetchReviewsAction(id));
    }
  }, [id, dispatch]);

  const handleAddReview = (newReviewData: Omit<Review, 'id' | 'date'>) => {
    console.log('New review:', newReviewData);
  };

  if (isCurrentOfferLoading) {
    return <LoadingPage />;
  }

  if (!currentOffer) {
    return <NotFoundPage />;
  }

  const nearbyOffers = offers
    .filter((item) => item.city.name === currentOffer.city.name && item.id !== currentOffer.id)
    .slice(0, 3);

  const mapPoints: MapPoint[] = [
    {
      id: currentOffer.id,
      title: currentOffer.title,
      lat: currentOffer.location.latitude,
      lng: currentOffer.location.longitude,
    },
    ...nearbyOffers.map((offer) => ({
      id: offer.id,
      title: offer.title,
      lat: offer.location.latitude,
      lng: offer.location.longitude,
    })),
  ];

  const handleCardMouseEnter = (id: string) => {
    const point = mapPoints.find((point) => point.id === id);
    setSelectedPoint(point);
  };

  const handleCardMouseLeave = () => {
    setSelectedPoint(undefined);
  };

  const cityForMap = {
    title: currentOffer.city.name,
    lat: currentOffer.city.location.latitude,
    lng: currentOffer.city.location.longitude,
    zoom: currentOffer.city.location.zoom,
  };

  const galleryImages = currentOffer.images?.slice(0, 6) || [];
  const favoriteCount = offers.filter((offer) => offer.isFavorite).length;

  return (
    <div className="page">
      <header className="header">
        <div className="container">
          <div className="header__wrapper">
            <div className="header__left">
              <Logo />
            </div>
            <nav className="header__nav">
              <ul className="header__nav-list">
                <li className="header__nav-item user">
                  <a className="header__nav-link header__nav-link--profile" href="#">
                    <div className="header__avatar-wrapper user__avatar-wrapper"></div>
                    <span className="header__user-name user__name">Myemail@gmail.com</span>
                    <span className="header__favorite-count">{favoriteCount}</span>
                  </a>
                </li>
                <li className="header__nav-item">
                  <a className="header__nav-link" href="#">
                    <span className="header__signout">Sign out</span>
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </header>

      <main className="page__main page__main--offer">
        <section className="offer">
          <div className="offer__gallery-container container">
            <div className="offer__gallery">
              {galleryImages.map((image, index) => (
                <div key={image} className="offer__image-wrapper">
                  <img
                    className="offer__image"
                    src={image}
                    alt={`Photo ${index + 1}`}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="offer__container container">
            <div className="offer__wrapper">
              {currentOffer.isPremium && (
                <div className="offer__mark">
                  <span>Premium</span>
                </div>
              )}

              <div className="offer__name-wrapper">
                <h1 className="offer__name">{currentOffer.title}</h1>
                <button
                  className={`offer__bookmark-button button ${
                    currentOffer.isFavorite ? 'offer__bookmark-button--active' : ''
                  }`}
                  type="button"
                >
                  <svg className="offer__bookmark-icon" width="31" height="33">
                    <use href="#icon-bookmark"></use>
                  </svg>
                  <span className="visually-hidden">To bookmarks</span>
                </button>
              </div>

              <div className="offer__rating rating">
                <div className="offer__stars rating__stars">
                  <span style={{ width: `${(currentOffer.rating / 5) * 100}%` }}></span>
                  <span className="visually-hidden">Rating</span>
                </div>
                <span className="offer__rating-value rating__value">{currentOffer.rating}</span>
              </div>

              <ul className="offer__features">
                <li className="offer__feature offer__feature--entire">
                  {currentOffer.type.charAt(0).toUpperCase() + currentOffer.type.slice(1)}
                </li>
                <li className="offer__feature offer__feature--bedrooms">
                  {currentOffer.bedrooms} Bedroom{currentOffer.bedrooms > 1 ? 's' : ''}
                </li>
                <li className="offer__feature offer__feature--adults">
                  Max {currentOffer.maxAdults} adult{currentOffer.maxAdults > 1 ? 's' : ''}
                </li>
              </ul>

              <div className="offer__price">
                <b className="offer__price-value">&euro;{currentOffer.price}</b>
                <span className="offer__price-text">&nbsp;night</span>
              </div>

              <div className="offer__inside">
                <h2 className="offer__inside-title">What&apos;s inside</h2>
                <ul className="offer__inside-list">
                  {currentOffer.goods.map((good) => (
                    <li key={good} className="offer__inside-item">
                      {good}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="offer__host">
                <h2 className="offer__host-title">Meet the host</h2>
                <div className="offer__host-user user">
                  <div
                    className={`offer__avatar-wrapper ${
                      currentOffer.host.isPro ? 'offer__avatar-wrapper--pro' : ''
                    } user__avatar-wrapper`}
                  >
                    <img
                      className="offer__avatar user__avatar"
                      src={currentOffer.host.avatarUrl}
                      width="74"
                      height="74"
                      alt="Host avatar"
                    />
                  </div>
                  <span className="offer__user-name">{currentOffer.host.name}</span>
                  {currentOffer.host.isPro && <span className="offer__user-status">Pro</span>}
                </div>
                <div className="offer__description">
                  <p className="offer__text">{currentOffer.description}</p>
                </div>
              </div>

              <ReviewsList reviews={reviews} />
              <ReviewsForm onAddReview={handleAddReview} />
            </div>
          </div>

          <section className="offer__map map">
            <Map
              city={cityForMap}
              points={mapPoints}
              selectedPoint={
                selectedPoint || {
                  id: currentOffer.id,
                  title: currentOffer.title,
                  lat: currentOffer.location.latitude,
                  lng: currentOffer.location.longitude,
                }
              }
              className="offer__map"
            />
          </section>
        </section>

        <div className="container">
          <NearPlacesList
            offers={nearbyOffers}
            onCardMouseEnter={handleCardMouseEnter}
            onCardMouseLeave={handleCardMouseLeave}
          />
        </div>
      </main>
    </div>
  );
}

export { OfferPage };