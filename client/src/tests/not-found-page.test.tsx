import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { NotFoundPage } from '../pages/not-found-page/not-found-page';
import { AppRoute } from '../const';

describe('NotFoundPage', () => {
  const renderPage = () =>
    render(
      <MemoryRouter>
        <NotFoundPage />
      </MemoryRouter>
    );

  it('отображает заголовок 404 и текст "Страница не найдена"', () => {
    renderPage();
    expect(screen.getByText('404')).toBeInTheDocument();
    expect(screen.getByText('Страница не найдена')).toBeInTheDocument();
  });

  it('ссылка на главную страницу присутствует', () => {
    renderPage();
    const link = screen.getByRole('link', { name: /на главную/i });
    expect(link).toBeInTheDocument();
  });

  it('ссылка ведет на "/"', () => {
    renderPage();
    const link = screen.getByRole('link', { name: /на главную/i });
    expect(link).toHaveAttribute('href', '/');
  });
});