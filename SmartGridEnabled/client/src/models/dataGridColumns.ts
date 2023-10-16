import { GridColDef } from "@mui/x-data-grid/models/colDef/gridColDef";

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
  },
];

export const offerColumns: GridColDef[] = [
  { field: "owner", headerName: "Seller", width: 370 },
  { field: "amount", headerName: "Amount (Wh)", width: 150 },
  { field: "price", headerName: "Price (€ cents)", width: 150 },
  {
    field: "expriration",
    headerName: "Expires at",
    width: 190,
    editable: false,
  },
  { field: "active", headerName: "Active", width: 150 },
  
];
