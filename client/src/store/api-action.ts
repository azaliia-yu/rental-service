import { AxiosInstance } from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { AppDispatch, State } from '../types/state.js';
import { FullOffer, OffersList, ServerOffer } from '../types/offer.js';
import { Review } from '../types/review.js';
import {
  offersCityList,
  requireAuthorization,
  setError,
  setOffersDataLoadingStatus,
  setReviews,
} from './action';
import { saveToken, dropToken } from '../services/token';
import { APIRoute, AuthorizationStatus, TIMEOUT_SHOW_ERROR } from '../const';
import { AuthData, UserData } from '../types/user-data';
import { adaptOfferToClient } from '../utils.js';

export const clearErrorAction = createAsyncThunk(
  'clearError',
  (_, { dispatch }) => {
    setTimeout(() => {
      dispatch(setError(null));
    }, TIMEOUT_SHOW_ERROR);
  },
);

export const fetchOfferAction = createAsyncThunk<FullOffer, string, {
  dispatch: AppDispatch;
  state: State;
  extra: AxiosInstance;
}>(
  'data/fetchOffer',
  async (offerId, { dispatch, extra: api, rejectWithValue }) => {
    try {
      const { data } = await api.get<ServerOffer>(`${APIRoute.Offers}/${offerId}`);
      return adaptOfferToClient(data);
    } catch (error) {
      dispatch(setError('Failed to load offer details. Please try again.'));
      return rejectWithValue(error);
    }
  }
);

export const fetchOffersAction = createAsyncThunk<void, undefined, {
  dispatch: AppDispatch;
  state: State;
  extra: AxiosInstance;
}>(
  'data/fetchOffers',
  async (_arg, { dispatch, extra: api, rejectWithValue }) => {
    dispatch(setOffersDataLoadingStatus(true));
    try {
      const { data } = await api.get<OffersList[]>(APIRoute.Offers);
      dispatch(offersCityList(data));
    } catch (error) {
      dispatch(setError('Failed to load offers. Please try again.'));
      return rejectWithValue(error);
    } finally {
      dispatch(setOffersDataLoadingStatus(false));
    }
  },
);

export const fetchReviewsAction = createAsyncThunk<Review[], string, {
  dispatch: AppDispatch;
  state: State;
  extra: AxiosInstance;
}>(
  'data/fetchReviews',
  async (offerId, { dispatch, extra: api, rejectWithValue }) => {
    try {
      const { data } = await api.get<Review[]>(`${APIRoute.Comments}/${offerId}`);
      return data;
    } catch (error) {
      dispatch(setError('Failed to load reviews.'));
      return rejectWithValue(error);
    }
  }
);

export const checkAuthAction = createAsyncThunk<void, undefined, {
  dispatch: AppDispatch;
  state: State;
  extra: AxiosInstance;
}>(
  'user/checkAuth',
  async (_arg, { dispatch, extra: api }) => {
    try {
      await api.get(APIRoute.Login);
      dispatch(requireAuthorization(AuthorizationStatus.Auth));
    } catch {
      dispatch(requireAuthorization(AuthorizationStatus.NoAuth));
    }
  },
);

export const loginAction = createAsyncThunk<
  UserData,
  AuthData,
  { dispatch: AppDispatch; state: State; extra: AxiosInstance }
>(
  'user/login',
  async ({ email, password }, { dispatch, extra: api, rejectWithValue }) => {
    try {
      const { data } = await api.post<UserData>(APIRoute.Login, { email, password });
      saveToken(data.token);
      dispatch(requireAuthorization(AuthorizationStatus.Auth));
      return data;
    } catch (err) {
      dropToken();
      dispatch(requireAuthorization(AuthorizationStatus.NoAuth));
      return rejectWithValue('Login failed');
    }
  }
);

export const logoutAction = createAsyncThunk<void, undefined, {
  dispatch: AppDispatch;
  state: State;
  extra: AxiosInstance;
}>(
  'user/logout',
  async (_arg, { dispatch, extra: api }) => {
    await api.delete(APIRoute.Logout);
    dropToken();
    dispatch(requireAuthorization(AuthorizationStatus.NoAuth));
  },
);