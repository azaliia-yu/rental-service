import { describe, it, expect } from 'vitest';
import { getOffersByCity, sortOffersByType, getCity, adaptOfferToClient } from '../utils';
import { makeFakeOffer } from './mocks';
import { SortOffersType, CITIES_LOCATION } from '../const';

describe('getOffersByCity', () => {
  it('возвращает только объявления указанного города', () => {
    const paris = CITIES_LOCATION[0];
    const cologne = CITIES_LOCATION[1];
    const parisOffer = { ...makeFakeOffer(), city: paris };
    const cologneOffer = { ...makeFakeOffer(), city: cologne };

    const result = getOffersByCity('Paris', [parisOffer, cologneOffer]);

    expect(result).toHaveLength(1);
    expect(result[0].city.name).toBe('Paris');
  });

  it('возвращает пустой массив, если город не найден', () => {
    const offers = [makeFakeOffer(), makeFakeOffer()];
    expect(getOffersByCity('Tokyo', offers)).toHaveLength(0);
  });

  it('возвращает пустой массив при пустом списке предложений', () => {
    expect(getOffersByCity('Paris', [])).toEqual([]);
  });
});

describe('sortOffersByType', () => {
  it('сортирует от дешёвых к дорогим (PriceToHigh)', () => {
    const offers = [
      { ...makeFakeOffer(), price: 300 },
      { ...makeFakeOffer(), price: 100 },
      { ...makeFakeOffer(), price: 200 },
    ];

    const result = sortOffersByType([...offers], 'PriceToHigh');

    expect(result[0].price).toBe(100);
    expect(result[2].price).toBe(300);
  });

  it('сортирует от дорогих к дешёвым (PriceToLow)', () => {
    const offers = [
      { ...makeFakeOffer(), price: 100 },
      { ...makeFakeOffer(), price: 300 },
    ];

    const result = sortOffersByType([...offers], 'PriceToLow');

    expect(result[0].price).toBe(300);
  });

  it('сортирует по рейтингу (TopRated)', () => {
    const offers = [
      { ...makeFakeOffer(), rating: 3 },
      { ...makeFakeOffer(), rating: 5 },
      { ...makeFakeOffer(), rating: 4 },
    ];

    const result = sortOffersByType([...offers], 'TopRated');

    expect(result[0].rating).toBe(5);
  });

  it('не изменяет исходный массив', () => {
    const offers = [
      { ...makeFakeOffer(), price: 100 },
      { ...makeFakeOffer(), price: 200 },
    ];
    const copy = [...offers];

    sortOffersByType(offers, 'PriceToHigh');

    expect(offers).toEqual(copy);
  });

  it('корректно работает при пустом массиве', () => {
    const result = sortOffersByType([], 'PriceToHigh');
    expect(result).toEqual([]);
  });
});

describe('getCity', () => {
  it('возвращает город по имени', () => {
    const city = getCity('Paris', CITIES_LOCATION);
    expect(city.name).toBe('Paris');
    expect(city.location.latitude).toBe(48.8566);
  });

  it('возвращает первый город, если имя не найдено', () => {
    const city = getCity('Unknown', CITIES_LOCATION);
    expect(city.name).toBe(CITIES_LOCATION[0].name);
  });
});

describe('adaptOfferToClient', () => {
  it('преобразует серверное предложение в клиентский формат', () => {
    const serverOffer = {
      id: '1',
      title: 'Test',
      description: 'Desc',
      publishDate: '2023-01-01',
      city: {
        name: 'Paris',
        location: { latitude: 48.8566, longitude: 2.3522, zoom: 13 },
      },
      location: { latitude: 48.8566, longitude: 2.3522 },
      previewImage: 'img.jpg',
      photos: ['photo1.jpg'],
      isPremium: true,
      isFavorite: false,
      rating: 4.5,
      type: 'apartment',
      rooms: 2,
      guests: 3,
      price: 120,
      features: ['Wi-Fi'],
      commentsCount: 5,
      author: {
        id: 1,
        name: 'John',
        avatar: 'avatar.jpg',
        isPro: true,
      },
    };

    const clientOffer = adaptOfferToClient(serverOffer);

    expect(clientOffer.id).toBe('1');
    expect(clientOffer.title).toBe('Test');
    expect(clientOffer.bedrooms).toBe(2);
    expect(clientOffer.maxAdults).toBe(3);
    expect(clientOffer.goods).toEqual(['Wi-Fi']);
    expect(clientOffer.images).toEqual(['photo1.jpg']);
    expect(clientOffer.host.name).toBe('John');
  });
});