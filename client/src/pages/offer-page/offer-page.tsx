import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FullOffer } from '../../types/offer';
import { NotFoundPage } from '../not-found-page/not-found-page';
import { ReviewsForm } from '../../components/reviews-form/reviews-form';
import { ReviewsList } from '../../components/reviews-list/reviews-list';
import { Map } from '../../components/map/map';
import { MapPoint } from '../../types/map';
import { NearPlacesList } from '../../components/near-places-list/near-places-list';
import { Review } from '../../types/review';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { fetchOfferAction, fetchReviewsAction, toggleFavoriteAction } from '../../store/api-action';
import { LoadingPage } from '../../components/loading-page/loading-page';
import Header from '../../components/header/header';
import { AuthorizationStatus, AppRoute } from '../../const';

function OfferPage() {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  
  const currentOffer = useAppSelector((state) => state.currentOffer) as FullOffer | null;
  const isCurrentOfferLoading = useAppSelector((state) => state.isCurrentOfferLoading);
  const offers = useAppSelector((state) => state.offers);
  const reviews = useAppSelector((state) => state.reviews);
  const authorizationStatus = useAppSelector((state) => state.authorizationStatus);
  
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

  const handleBookmarkClick = () => {
    if (authorizationStatus !== AuthorizationStatus.Auth) {
      navigate(AppRoute.Login);
      return;
    }
    
    if (currentOffer) {
      dispatch(toggleFavoriteAction({
        offerId: currentOffer.id,
        status: currentOffer.isFavorite ? 0 : 1
      }));
    }
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

  return (
    <div className="page">
      <Header />
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
                  onClick={handleBookmarkClick}
                >
                  <svg className="offer__bookmark-icon" width="31" height="33">
                    <use href="#icon-bookmark"></use>
                  </svg>
                  <span className="visually-hidden">
                    {currentOffer.isFavorite ? 'In bookmarks' : 'To bookmarks'}
                  </span>
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
              {authorizationStatus === AuthorizationStatus.Auth && (
                <ReviewsForm />
              )}
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