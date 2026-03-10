import { createAction } from '@reduxjs/toolkit';
import { CityOffer, OffersList } from '../types/offer';
import { Review } from '../types/review';
import { AuthorizationStatusType } from '../types/authorization-status';
import { UserData } from '../types/user-data';

export const changeCity = createAction('offers/changeCity', (city: CityOffer) => ({
  payload: city
}));

export const offersCityList = createAction('offers/offersCityList', (offers: OffersList[]) => ({
  payload: offers
}));

export const requireAuthorization = createAction<AuthorizationStatusType>('user/requireAuthorization');

export const setError = createAction('setError', (error: string | null) => ({
  payload: error
}));

export const setOffersDataLoadingStatus = createAction<boolean>('data/setOffersDataLoadingStatus');

export const setReviews = createAction<Review[]>('data/setReviews');

export const setUser = createAction<UserData | null>('user/setUser');
export const setFavorites = createAction<OffersList[]>('favorites/setFavorites');