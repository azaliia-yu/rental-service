import { JSX, useState } from 'react';
import { CitiesCardList } from '../../components/cities-card-list/cities-card-list';
import { Map } from '../../components/map/map';
import { MapPoint } from '../../types/map';
import { useAppSelector } from '../../hooks';
import { getOffersByCity, sortOffersByType } from '../../utils';
import { CitiesList } from '../../components/cities-list/cities-list';
import { SortOptions } from '../../components/sort-options/sort-options';
import { SortOffer } from '../../types/sort';
import Header from '../../components/header/header';

function MainPage(): JSX.Element {
  const selectedCity = useAppSelector((state) => state.city);
  const offersList = useAppSelector((state) => state.offers);
  const [activeSort, setActiveSort] = useState<SortOffer>('Popular');
  const [selectedPoint, setSelectedPoint] = useState<MapPoint | undefined>(undefined);

  const cityOffers = getOffersByCity(selectedCity?.name, offersList);
  const sortedOffers = sortOffersByType(cityOffers, activeSort);

  const mapPoints: MapPoint[] = sortedOffers.map((offer) => ({
    id: offer.id,
    title: offer.title,
    lat: offer.location.latitude,
    lng: offer.location.longitude,
  }));

  const handleCardMouseEnter = (id: string) => {
    const point = mapPoints.find((point) => point.id === id);
    setSelectedPoint(point);
  };

  const handleCardMouseLeave = () => {
    setSelectedPoint(undefined);
  };

  const mapCity = selectedCity
    ? {
        title: selectedCity.name,
        lat: selectedCity.location.latitude,
        lng: selectedCity.location.longitude,
        zoom: selectedCity.location.zoom,
      }
    : {
        title: 'Paris',
        lat: 48.5112,
        lng: 2.2055,
        zoom: 8,
      };

  if (sortedOffers.length === 0) {
    return (
      <div className="page page--gray page--main">
        <Header />
        <main className="page__main page__main--index page__main--index-empty">
          <h1 className="visually-hidden">Cities</h1>
          <div className="tabs">
            <section className="locations container">
              <CitiesList selectedCity={selectedCity} />
            </section>
          </div>
          <div className="cities">
            <div className="cities__places-container cities__places-container--empty container">
              <section className="cities__no-places">
                <div className="cities__status-wrapper tabs__content">
                  <b className="cities__status">No places to stay available</b>
                  <p className="cities__status-description">
                    We could not find any property available at the moment in {selectedCity?.name}
                  </p>
                </div>
              </section>
              <div className="cities__right-section"></div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="page page--gray page--main">
      <Header />
      <main className="page__main page__main--index">
        <h1 className="visually-hidden">Cities</h1>
        <div className="tabs">
          <section className="locations container">
            <CitiesList selectedCity={selectedCity} />
          </section>
        </div>
        <div className="cities">
          <div className="cities__places-container container">
            <section className="cities__places places">
              <h2 className="visually-hidden">Places</h2>
              <b className="places__found">
                {cityOffers.length} places to stay in {selectedCity?.name}
              </b>
              <SortOptions activeSort={activeSort} onChange={(newSort) => setActiveSort(newSort)} />
              <CitiesCardList
                offersList={sortedOffers}
                onCardMouseEnter={handleCardMouseEnter}
                onCardMouseLeave={handleCardMouseLeave}
              />
            </section>
            <div className="cities__right-section">
              <Map city={mapCity} points={mapPoints} selectedPoint={selectedPoint} className="cities__map map" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export { MainPage };