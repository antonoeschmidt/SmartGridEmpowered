import React from "react";
import { DataGrid } from '@mui/x-data-grid';

type DataTableProps = {
  rows: any;
  columns: any;
};

const DataTable = (props: DataTableProps) => {
  return (
    <div style={{ height: 300, width: '100%'}}>
      <DataGrid
        rows={props.rows}
        columns={props.columns}
      />
    </div>
  );
};

export default DataTable;