import { Button } from "@mui/material";
import { GridValueFormatterParams } from "@mui/x-data-grid";
import { GridColDef } from "@mui/x-data-grid/models/colDef/gridColDef";
import { dateFormatter } from "../utils/parsers";

export const supplyContractColumns: GridColDef[] = [
    { field: "buyer", headerName: "Buyer", width: 370 },
    { field: "seller", headerName: "Seller", width: 370 },
    {
        field: "amount",
        headerName: "Amount (Wh)",
        width: 150,
        valueFormatter: (params: GridValueFormatterParams<number>) => {
            return params.value === 0 ? "Hidden" : params.value;
        },
    },
    { field: "price", headerName: "Price (€ cents)", width: 150,
    valueFormatter: (params: GridValueFormatterParams<number>) => {
        return params.value === 0 ? "Hidden" : params.value;
    } },
    {
        field: "timestamp",
        headerName: "Timestamp",
        width: 190,
        editable: false,
        valueFormatter: (params: GridValueFormatterParams<string>) => {
            if (params.value) return dateFormatter(params.value);
        },
    },
];

export const offerColumns: GridColDef[] = [
    { field: "owner", headerName: "Seller", width: 380 },
    { field: "amount", headerName: "Amount (Wh)", width: 150 },
    { field: "price", headerName: "Price (€ cents)", width: 150 },
    {
        field: "expiration",
        headerName: "Expires at",
        width: 190,
        editable: false,
        valueFormatter: (params: GridValueFormatterParams<string>) => {
            if (params.value) return dateFormatter(params.value);
        },
    },
    { field: "active", headerName: "Active", width: 100 },
];

export const buyOfferColumns = (
    buyOnClick: (id: string) => void
): GridColDef[] => [
    ...offerColumns,
    {
        field: "Buy",
        headerName: "",
        width: 150,
        renderCell: (params) => {
            // you will find row info in params
            return (
                <Button
                    color="primary"
                    disabled={!params.row.active}
                    variant="contained"
                    onClick={(e) => buyOnClick(params.rowNode.id as string)}
                >
                    Buy
                </Button>
            );
        },
    },
];
