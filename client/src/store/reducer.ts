import { createReducer } from '@reduxjs/toolkit';
import {
  changeCity,
  offersCityList,
  requireAuthorization,
  setOffersDataLoadingStatus,
  setError,
  setReviews,
} from './action';
import { AuthorizationStatus, CITIES_LOCATION } from '../const';
import { AuthorizationStatusType } from '../types/authorization-status';
import { CityOffer, OffersList, FullOffer } from '../types/offer';
import { Review } from '../types/review';
import { getCity } from '../utils';
import { fetchOfferAction, fetchReviewsAction } from './api-action';

const defaultCity = getCity('Paris', CITIES_LOCATION);

export type InitialState = {
  city: CityOffer | undefined;
  offers: OffersList[];
  authorizationStatus: AuthorizationStatusType;
  error: string | null;
  isOffersDataLoading: boolean;
  currentOffer: FullOffer | null;
  isCurrentOfferLoading: boolean;
  reviews: Review[];
};

const initialState: InitialState = {
  city: defaultCity,
  offers: [],
  authorizationStatus: AuthorizationStatus.Unknown,
  error: null,
  isOffersDataLoading: false,
  currentOffer: null,
  isCurrentOfferLoading: false,
  reviews: [],
};

export const reducer = createReducer(initialState, (builder) => {
  builder
    .addCase(changeCity, (state, action) => {
      state.city = action.payload;
    })
    .addCase(offersCityList, (state, action) => {
      state.offers = action.payload;
    })
    .addCase(requireAuthorization, (state, action) => {
      state.authorizationStatus = action.payload;
    })
    .addCase(setError, (state, action) => {
      state.error = action.payload;
    })
    .addCase(setOffersDataLoadingStatus, (state, action) => {
      state.isOffersDataLoading = action.payload;
    })
    .addCase(setReviews, (state, action) => {
      state.reviews = action.payload;
    })
    // fetchOfferAction
    .addCase(fetchOfferAction.pending, (state) => {
      state.isCurrentOfferLoading = true;
    })
    .addCase(fetchOfferAction.fulfilled, (state, action) => {
      state.currentOffer = action.payload;
      state.isCurrentOfferLoading = false;
    })
    .addCase(fetchOfferAction.rejected, (state) => {
      state.isCurrentOfferLoading = false;
    })
    .addCase(fetchReviewsAction.fulfilled, (state, action) => {
      state.reviews = action.payload;
    })
    .addCase(fetchReviewsAction.rejected, (state) => {
    });
});