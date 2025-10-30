import { useEffect, useState } from 'react';
import UserSection from './Admin/UserSection';
import { ButtonSidebar } from '@/components/uiCore/Button/Button';
import { DropDown } from '@/components/uiCore/index';
import ShoesSection from './Admin/ShoesSection';

const Header = ({ selected, setSelected }) => {
  return (
    <div className="w-full grid grid-cols-4 gap-4 p-8 bg-[var(--light)]">
      <DropDown
        value={selected}
        onChange={(e) => setSelected(e.value)}
        options={[
          { name: 'Users', id: 'user' },
          { name: 'Shoes', id: 'shoes' },
        ]}
        optionLabel="name"
        optionValue="id"
        placeholder="Select data"
      />
      {/* <Buttonn label="Users" noIcon={true} onClick={() => setSelected('user')} />
      <Buttonn label="Shoes" noIcon={true} onClick={() => setSelected('shoes')} /> */}
    </div>
  );
};

function OnlyAdmin({ toast }) {
  useEffect(() => {
    document.title = 'SneakerT - Admin';
  }, []);
  const [selected, setSelected] = useState(null);
  return (
    <div className="w-full h-full">
      <Header selected={selected} setSelected={setSelected} />
      <div className="w-full p-4">
        {selected === 'user' && <UserSection toast={toast} />}
        {selected === 'shoes' && <ShoesSection toast={toast} />}
      </div>
    </div>
  );
}

export default OnlyAdmin;

// const Buttonn = (props) => {
//   const { className, label, ...prop } = props;
//   return (
//     <ButtonSidebar
//       className={`${className} !bg-[var(--primary-blue)] !text-[var(--light)] flex justify-center`}
//       {...prop}
//     >
//       {label}
//     </ButtonSidebar>
//   );
// };
