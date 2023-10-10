import { GridValueFormatterParams } from "@mui/x-data-grid";
import { GridColDef } from "@mui/x-data-grid/models/colDef/gridColDef";
import { dateFormatter } from "../utils/parsers";

export const supplyContractColumns: GridColDef[] = [
  { field: "buyer", headerName: "Buyer", width: 370 },
  { field: "seller", headerName: "Seller", width: 370 },
  { field: "amount", headerName: "Amount (Wh)", width: 150 },
  { field: "price", headerName: "Price (€ cents)", width: 150 },
  {
    field: "createdAt",
    headerName: "Created at",
    width: 190,
    editable: false,
    // valueFormatter: (params: GridValueFormatterParams<string>) => {
    //   if (params.value) return dateFormatter(params.value);
    // },
  },
];
