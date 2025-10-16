import Home from '@/pages/Home';
import DefaultLayout from '@/layout/DefaultLayout';
import Login from '@/pages/Login';
import Register from '@/pages/Register';

export const publicRoutes = [
  { path: '/', component: Home, layout: DefaultLayout },
  { path: '/login', component: Login, layout: null },
  { path: '/register', component: Register, layout: null },
];

const privateRoutes = [];
