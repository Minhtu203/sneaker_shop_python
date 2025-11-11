import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Fragment, useRef } from 'react';
import 'primeicons/primeicons.css';
import 'primereact/resources/themes/lara-light-blue/theme.css';
import 'primereact/resources/primereact.min.css';

import { privateRoutes, publicRoutes } from '@/routes';
import DefaultLayout from '@/layout/DefaultLayout';
import { useUserState } from './store/userState';
import { Toast } from './components/uiCore/index';
// import Cookies from 'js-cookie';
// import { logoutApi } from './api/auth/logoutApi';
// import { CreateAxios } from './lib/axios';
// import { useNavigate } from 'react-router-dom';
// import { Toastz } from './utils/Toast';

function App() {
  const { userInfo, clearUserInfo, setUserInfo } = useUserState();
  const toast = useRef(null);
  // const refreshToken = Cookies.get('refreshToken');
  // let axiosJWT = CreateAxios(userInfo, setUserInfo);
  // const navigate = useNavigate();

  return (
    <>
      <Toast ref={toast} />
      <Routes>
        {publicRoutes.map((route, index) => {
          const Page = route.component;
          let Layout = DefaultLayout;

          if (route.layout === null) {
            Layout = Fragment;
          } else if (route.layout) {
            Layout = route.layout;
          }
          return (
            <Route
              key={index}
              path={route.path}
              element={
                <Layout>
                  <Page toast={toast} />
                </Layout>
              }
            />
          );
        })}

        {privateRoutes.map((route, index) => {
          const Page = route.component;
          let Layout = DefaultLayout;

          if (route.layout === null) {
            Layout = Fragment;
          } else if (route.layout) {
            Layout = route.layout;
          }

          if (!userInfo?.accessToken) {
            return <Route key={index} path={route.path} element={<Navigate to={'/login'} replace />} />;
          }

          return (
            <Route
              key={index}
              path={route.path}
              element={
                <Layout>
                  <Page toast={toast} />
                </Layout>
              }
            />
          );
        })}
      </Routes>
    </>
  );
}

export default App;
