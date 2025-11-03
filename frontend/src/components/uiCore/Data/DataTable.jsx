import { DataTable as DataTables } from 'primereact/datatable';
import Column from './Column';
import Button from '../Button/Button';
import { useState } from 'react';
import Dialog from '../Overlay/Dialog';
import { InputPassword } from '@/pages/Login';
import { Toastz } from '@/utils/Toast';
import InputText from '../Form/InputText';

const VALID_PASSWORD = import.meta.env.VITE_DELETE_PASSWORD;

// eslint-disable-next-line react-refresh/only-export-components
export const formattedDate = (date, type) => {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  if (type === 'day/month') return `${day}/${month}`;
  return `${day}/${month}/${year}`;
};

const DataTable = (props) => {
  const { action, setDelete, setUpdate, totalRecords, toast, updateDataChildren, ...prop } = props;
  const [visibleDelete, setVisibleDelete] = useState(false);
  const [visibleUpdate, setVisibleUpdate] = useState(false);
  const [password, setPassword] = useState('');
  const [id, setId] = useState(null);

  const handleDelete = (e) => {
    e.preventDefault();
    if (password === VALID_PASSWORD) {
      setDelete(id);
      setVisibleDelete(false);
      setPassword('');
    } else {
      const data = { success: false, message: 'Invalid password' };
      Toastz(data, toast);
      setVisibleDelete(false);
      setPassword('');
    }
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    setUpdate(id);
  };

  return (
    <>
      <DataTables
        paginator
        rows={5}
        rowsPerPageOptions={[5, 10, 25, 50]}
        footer={<span className="text-[var(--primary-blue)] font-semibold">Total Records: {totalRecords || 0}</span>}
        {...prop}
      >
        {props.children}

        {action && (
          <Column
            header="Actions"
            body={(i) => (
              <div className="flex flex-row gap-4">
                <Button
                  icon="pi pi-pencil"
                  label="Update"
                  className="!bg-[var(--primary-yellow)] !border-none"
                  onClick={() => {
                    setVisibleUpdate(true);
                    setId(i?._id);
                  }}
                />
                <Button
                  icon="pi pi-trash"
                  label="Delete"
                  onClick={() => {
                    setVisibleDelete(true);
                    setId(i?._id);
                  }}
                  className="!bg-red-800 !border-none"
                />
              </div>
            )}
          />
        )}
      </DataTables>

      {/* dialog delete */}
      <Dialog
        header="Enter password to delete data"
        visible={visibleDelete}
        style={{ width: '30vw' }}
        onHide={() => {
          if (!visibleDelete) return;
          setVisibleDelete(false);
          setPassword('');
        }}
      >
        <form onSubmit={handleDelete}>
          <InputPassword className="py-12" password={password} setPassword={setPassword} />
          <Button type="submit" label="Delete" className="!bg-red-500 !border-none" />
        </form>
      </Dialog>

      {/* dialog update */}
      <Dialog
        header="Update data"
        visible={visibleUpdate}
        style={{ width: '40vw' }}
        onHide={() => {
          if (!visibleUpdate) return;
          setVisibleUpdate(false);
          setPassword('');
        }}
      >
        <form onSubmit={handleUpdate} className="flex flex-col gap-6 py-4">
          {updateDataChildren}
          <Button
            type="submit"
            label="Update"
            className="!bg-[var(--primary-blue)] !border-none"
            onClick={() => console.log(4444)}
          />
        </form>
      </Dialog>
    </>
  );
};

export default DataTable;
