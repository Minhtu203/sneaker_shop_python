import { DataTable as DataTables } from 'primereact/datatable';
import Column from './Column';
import Button from '../Button/Button';
import { useState } from 'react';

const DataTable = (props) => {
  const { action, setDelete, totalRecords, ...prop } = props;
  // const [first, setFirst] = useState(0);

  return (
    <DataTables
      paginator
      rows={5}
      rowsPerPageOptions={[5, 10, 25, 50]}
      footer={
        <span className="text-[var(--primary-blue)] font-semibold">
          Total Records: {totalRecords || 0}
        </span>
      }
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
              />
              <Button
                icon="pi pi-trash"
                label="Delete"
                onClick={() => setDelete(i._id)}
                className="!bg-red-800 !border-none"
              />
            </div>
          )}
        />
      )}
    </DataTables>
  );
};

export default DataTable;
