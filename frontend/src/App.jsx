import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Fragment, useEffect } from 'react';
import 'primeicons/primeicons.css';
import 'primereact/resources/themes/lara-light-blue/theme.css';
import 'primereact/resources/primereact.min.css';

import { privateRoutes, publicRoutes } from '@/routes';
import DefaultLayout from '@/layout/DefaultLayout';
import { useUserState } from './store/userState';

function App() {
  const { userInfo } = useUserState();
  useEffect(() => {
    console.log(userInfo);
  }, [userInfo]);

  return (
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
                <Page />
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
          return (
            <Route key={index} path={route.path} element={<Navigate to={'/login'} replace />} />
          );
        }

        return (
          <Route
            key={index}
            path={route.path}
            element={
              <Layout>
                <Page />
              </Layout>
            }
          />
        );
      })}
    </Routes>
  );
}

export default App;
