import Header from '@/components/base/Header';
import Sidebar from '@/components/base/SideBar';
import { Button } from '@/components/uiCore/index';
import { Outlet } from 'react-router-dom';

function DefaultLayout(props) {
  const { className, ...prop } = props;
  return (
    <div className={`${className} flex flex-row`} {...prop}>
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Header />
        <div className="flex-1 overflow-auto">{props.children}</div>
      </div>
    </div>
  );
}

export default DefaultLayout;
