import { OffersList } from '../types/offer';

export const offersList: OffersList[] = [
  {
    id: '1',
    title: 'Luxurious apartment in historic district',
    type: 'apartment',
    price: 140,
    city: {
      name: 'Amsterdam',
      location: {
        latitude: 52.37454,
        longitude: 4.897976,
        zoom: 13
      }
    },
    location: {
      latitude: 52.3909553943508,
      longitude: 4.85309666406198,
      zoom: 16
    },
    isFavorite: true,
    isPremium: true,
    rating: 4.9,
    previewImage: 'img/apartment-01.jpg'
  },
  {
    id: '2',
    title: 'Cozy studio with city view',
    type: 'room',
    price: 75,
    city: {
      name: 'Amsterdam',
      location: {
        latitude: 52.37454,
        longitude: 4.897976,
        zoom: 13
      }
    },
    location: {
      latitude: 52.3609553943508,
      longitude: 4.85309666406198,
      zoom: 16
    },
    isFavorite: true,
    isPremium: false,
    rating: 4.3,
    previewImage: 'img/room.jpg'
  },
  {
    id: '3',
    title: 'Modern loft in city center',
    type: 'apartment',
    price: 145,
    city: {
      name: 'Cologne',
      location: {
        latitude: 50.938361,
        longitude: 6.959974,
        zoom: 13
      }
    },
    location: {
      latitude: 50.938361,
      longitude: 6.959974,
      zoom: 16
    },
    isFavorite: false,
    isPremium: true,
    rating: 4.7,
    previewImage: 'img/apartment-03.jpg'
  },
  {
    id: '4',
    title: 'Charming house with garden',
    type: 'house',
    price: 195,
    city: {
      name: 'Brussels',
      location: {
        latitude: 50.846557,
        longitude: 4.351697,
        zoom: 13
      }
    },
    location: {
      latitude: 50.846557,
      longitude: 4.351697,
      zoom: 16
    },
    isFavorite: false,
    isPremium: true,
    rating: 4.1,
    previewImage: 'img/apartment-02.jpg'
  },
  {
    id: '5',
    title: 'Stylish apartment near museum',
    type: 'apartment',
    price: 185,
    city: {
      name: 'Amsterdam',
      location: {
        latitude: 52.37454,
        longitude: 4.897976,
        zoom: 13
      }
    },
    location: {
      latitude: 52.3809553943508,
      longitude: 4.939309666406198,
      zoom: 16
    },
    isFavorite: true,
    isPremium: false,
    rating: 4.6,
    previewImage: 'img/apartment-01.jpg'
  }
];