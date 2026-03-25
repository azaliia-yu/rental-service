import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { CitiesCard } from '../components/cities-card/cities-card';
import { makeFakeOffer, makeFakeStore } from './mocks';
import { reducer } from '../store/reducer';
import { AuthorizationStatus } from '../const';

const mockOffer = makeFakeOffer();

const defaultProps = {
  id: mockOffer.id,
  title: mockOffer.title,
  type: mockOffer.type,
  price: mockOffer.price,
  isPremium: mockOffer.isPremium,
  previewImage: mockOffer.previewImage,
  rating: mockOffer.rating,
  isFavorite: false,
  onCardMouseEnter: () => {},
  onCardMouseLeave: () => {},
};

describe('CitiesCard', () => {
  const renderCard = (props = {}, initialState = {}) => {
    const store = configureStore({
      reducer,
      preloadedState: makeFakeStore({
        authorizationStatus: AuthorizationStatus.Auth,
        ...initialState,
      }),
    });

    return render(
      <Provider store={store}>
        <MemoryRouter>
          <CitiesCard {...defaultProps} {...props} />
        </MemoryRouter>
      </Provider>
    );
  };

  it('отображает заголовок объявления', () => {
    renderCard();
    expect(screen.getByText(mockOffer.title)).toBeInTheDocument();
  });

  it('отображает цену объявления', () => {
    renderCard();
    expect(screen.getByText(`€${mockOffer.price}`)).toBeInTheDocument();
  });

  it('отображает метку Premium, когда isPremium = true', () => {
    renderCard({ isPremium: true });
    expect(screen.getByText('Premium')).toBeInTheDocument();
  });

  it('не отображает метку Premium, когда isPremium = false', () => {
    renderCard({ isPremium: false });
    expect(screen.queryByText('Premium')).not.toBeInTheDocument();
  });

  it('ссылка на страницу объявления содержит id в href', () => {
    renderCard();
    const link = screen.getByRole('link', { name: mockOffer.title });
    expect(link).toHaveAttribute('href', expect.stringContaining(mockOffer.id));
  });
});