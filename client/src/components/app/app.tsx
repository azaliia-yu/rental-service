import { MainPage } from "../../pages/main-page/main-page";
import { FavoritesPage } from "../../pages/favorites-page/favorites-page";
import { LoginPage } from "../../pages/login-page/login-page";
import { OfferPage } from "../../pages/offer-page/offer-page";
import { NotFoundPage } from "../../pages/not-found-page/not-found-page";
import { BrowserRouter } from 'react-router-dom';
import { Route } from 'react-router-dom';
import { Routes } from 'react-router-dom';
import { PrivateRoute } from "../private-route/private-route";
import { LoadingPage } from "../loading-page/loading-page";
import { useAppSelector } from "../../hooks";
import { AppRoute, AuthorizationStatus } from "../../const";
import { JSX } from "react";

function App(): JSX.Element {
    const authorizationStatus = useAppSelector((state) => state.authorizationStatus);
    const isOffersDataLoading = useAppSelector((state) => state.isOffersDataLoading);

    if (authorizationStatus === AuthorizationStatus.Unknown || isOffersDataLoading) {
        return <LoadingPage />;
    }

    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path={AppRoute.Main}
                    element={<MainPage />}
                />
                <Route
                    path={AppRoute.Login}
                    element={<LoginPage />}
                />
                <Route
                    path={`${AppRoute.Offer}/:id`}
                    element={<OfferPage />} // пропсы убраны
                />
                <Route
                    path={AppRoute.Favorites}
                    element={
                        <PrivateRoute authorizationStatus={authorizationStatus}>
                            <FavoritesPage />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="*"
                    element={<NotFoundPage />}
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;