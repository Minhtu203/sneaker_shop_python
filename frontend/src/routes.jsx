import Home from '@/pages/Home';
import DefaultLayout from '@/layout/DefaultLayout';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import ForgotPassword from '@/pages/ForgotPassword';
import ShoesDetail from './pages/ShoesDetail';
import OnlyAdmin from './pages/OnlyAdmin';
import JordanShoes from './pages/JordanShoes';
import Airmax from './pages/Airmax';
import Nike from './pages/Nike';
import Basketball from './pages/Basketball';
import Football from './pages/Football';
import Golf from './pages/Golf';
import Tennis from './pages/Tennis';
import ShoppingCart from './pages/ShoppingCart';
import UserPage from './pages/UserPage';
import Favourites from './pages/Favourites';
import Adidas from './pages/Adidas';
import Header from './components/base/Header';

export const publicRoutes = [
  { path: '/login', component: Login, layout: null },
  { path: '/register', component: Register, layout: null },
  { path: '/forgotpassword', component: ForgotPassword, layout: null },
];

export const privateRoutes = [
  { path: '/', component: Home, layout: null },
  { path: '/user-profile', component: UserPage, layout: DefaultLayout },
  { path: '/shoes/:id', component: ShoesDetail, layout: DefaultLayout },
  { path: '/favourites', component: Favourites, layout: DefaultLayout },
  { path: '/shoes/jordan', component: JordanShoes, layout: DefaultLayout },
  { path: '/shoes/airmax', component: Airmax, layout: DefaultLayout },
  { path: '/shoes/nike', component: Nike, layout: DefaultLayout },
  { path: '/shoes/adidas', component: Adidas, layout: DefaultLayout },
  { path: '/shoes/basketball', component: Basketball, layout: DefaultLayout },
  { path: '/shoes/football', component: Football, layout: DefaultLayout },
  { path: '/shoes/golf', component: Golf, layout: DefaultLayout },
  { path: '/shoes/tennis', component: Tennis, layout: DefaultLayout },
  { path: '/shopping_cart', component: ShoppingCart, layout: DefaultLayout },
  { path: '/shoes/onlyAdmin', component: OnlyAdmin, layout: DefaultLayout },
];
