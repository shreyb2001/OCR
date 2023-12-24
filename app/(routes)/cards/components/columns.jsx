"use client";

import { ColumnDef } from "@tanstack/react-table";
import CellAction from "./cell-action";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export const columns = [
  {
    accessorKey: "identificationNumber",
    header: "Identification Number",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "birthDate",
    header: "D.O.B",
  },
  {
    accessorKey: "issueDate",
    header: "Issue Date",
  },
  {
    accessorKey: "expiryDate",
    header: "Expiry date",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
