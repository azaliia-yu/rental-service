import { CityOffer, OffersList } from './types/offer';
import { CITIES_LOCATION } from './const';
import { SortOffersType } from './const';
import { FullOffer, ServerOffer } from './types/offer';

export const adaptOfferToClient = (serverOffer: ServerOffer): FullOffer => ({
  id: serverOffer.id,
  title: serverOffer.title,
  description: serverOffer.description,
  type: serverOffer.type,
  price: serverOffer.price,
  city: serverOffer.city,
  location: {
    latitude: serverOffer.location.latitude,
    longitude: serverOffer.location.longitude,
    zoom: serverOffer.city.location.zoom, 
  },
  isFavorite: serverOffer.isFavorite,
  isPremium: serverOffer.isPremium,
  rating: serverOffer.rating,
  bedrooms: serverOffer.rooms,
  maxAdults: serverOffer.guests,
  goods: serverOffer.features,
  images: serverOffer.photos,
  host: {
    name: serverOffer.author.name,
    avatarUrl: serverOffer.author.avatar,
    isPro: serverOffer.author.isPro,
  },
});

export function getCity(name: string, cities: typeof CITIES_LOCATION): CityOffer {
  const city = cities.find((city) => city.name === name);
  if (!city) {
    return {
      name: cities[0].name,
      location: {
        latitude: cities[0].location.latitude,
        longitude: cities[0].location.longitude,
        zoom: cities[0].location.zoom
      }
    };
  }
  return { 
    name: city.name,
    location: {
      latitude: city.location.latitude,
      longitude: city.location.longitude,
      zoom: city.location.zoom
    }
  };
}

export function getOffersByCity(cityName: string | undefined, offers: OffersList[]): OffersList[] {
  if (!cityName) {
    return [];
  }
  return offers.filter((offer) => offer.city.name === cityName);
}

export function sortOffersByType(offers: OffersList[], type: keyof typeof SortOffersType): OffersList[] {
  const sortedOffers = [...offers];
  switch (type) {
    case 'PriceToHigh':
      return sortedOffers.sort((a, b) => a.price - b.price);
    case 'PriceToLow':
      return sortedOffers.sort((a, b) => b.price - a.price);
    case 'TopRated':
      return sortedOffers.sort((a, b) => b.rating - a.rating);
    default: 
      return sortedOffers;
  }
}

