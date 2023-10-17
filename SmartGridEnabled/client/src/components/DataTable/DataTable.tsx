import React from "react";
import { DataGrid } from '@mui/x-data-grid';
import { Button } from "@mui/material";

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
      <Button>Buy</Button>
    </div>
  );
};

export default DataTable;