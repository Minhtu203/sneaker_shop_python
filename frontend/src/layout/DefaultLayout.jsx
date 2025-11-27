import Header from '@/components/base/Header';
import Sidebar from '@/components/base/SideBar';
import { useState } from 'react';

function DefaultLayout(props) {
  const { className, ...prop } = props;
  const [toggleSidebar, setToggleSidebar] = useState(true);

  return (
    <div className={`${className} flex flex-row`} {...prop}>
      <Sidebar toggleSidebar={toggleSidebar} setToggleSidebar={setToggleSidebar} />
      <div className="flex flex-col w-full h-screen">
        <Header toggleSidebar={toggleSidebar} setToggleSidebar={setToggleSidebar} />
        <div
          className={`overflow-auto flex-1
             ${toggleSidebar ? 'ml-[var(--width-sidebar)]' : 'ml-0'}
           transition-all duration-500 ease-in-out overflow-auto flex flex-col`}
        >
          {props.children}
        </div>
      </div>
    </div>
  );
}

export default DefaultLayout;
