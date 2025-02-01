// "use client";

// import {
//   ColumnDef,
//   flexRender,
//   getCoreRowModel,
//   useReactTable,
// } from "@tanstack/react-table";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { useState } from "react";

// interface DataTableProps<TData, TValue> {
//   columns: ColumnDef<TData, TValue>[];
//   data: TData[];
//   handleDelete: (userId: string) => void;
//   handleSave: (userId: string, updatedData: TData) => void; // Callback to save changes
// }

// export function DataTable<TData extends { id: string }, TValue>({
//   columns,
//   data,
//   handleDelete,
//   handleSave,
// }: DataTableProps<TData, TValue>) {
//   const [editingRowId, setEditingRowId] = useState<string | null>(null);
//   const [editedData, setEditedData] = useState<TData | null>(null);

//   const table = useReactTable({
//     data,
//     columns,
//     getCoreRowModel: getCoreRowModel(),
//   });

//   const handleEdit = (row: TData) => {
//     setEditingRowId(row.id);
//     setEditedData(row);
//   };

//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement>,
//     column: string
//   ) => {
//     if (editedData) {
//       setEditedData({
//         ...editedData,
//         [column]: e.target.value,
//       });
//     }
//   };

//   const handleSaveChanges = () => {
//     if (editedData) {
//       handleSave(editedData.id, editedData); // Save the updated data
//       setEditingRowId(null);
//       setEditedData(null);
//     }
//   };

//   return (
//     <div className="rounded-md border overflow-x-auto">
//       <Table>
//         <TableHeader>
//           {table.getHeaderGroups().map((headerGroup) => (
//             <TableRow key={headerGroup.id}>
//               {headerGroup.headers.map((header) => (
//                 <TableHead key={header.id}>
//                   {header.isPlaceholder
//                     ? null
//                     : flexRender(
//                         header.column.columnDef.header,
//                         header.getContext()
//                       )}
//                 </TableHead>
//               ))}
//             </TableRow>
//           ))}
//         </TableHeader>
//         <TableBody>
//           {table.getRowModel().rows.length ? (
//             table.getRowModel().rows.map((row) => (
//               <TableRow key={row.id}>
//                 {row.getVisibleCells().map((cell) => (
//                   <TableCell key={cell.id}>
//                     {editingRowId === row.id ? (
//                       <input
//                         type="text"
//                         value={
//                           editedData
//                             ? (editedData[cell.column.id] as string)
//                             : ""
//                         }
//                         onChange={(e) => handleChange(e, cell.column.id)}
//                         className="p-1 border border-gray-300 rounded"
//                       />
//                     ) : (
//                       flexRender(cell.column.columnDef.cell, cell.getContext())
//                     )}
//                   </TableCell>
//                 ))}
//                 <TableCell>
//                   {editingRowId === row.id ? (
//                     <button
//                       onClick={handleSaveChanges}
//                       className="text-green-600"
//                     >
//                       Save
//                     </button>
//                   ) : (
//                     <button
//                       onClick={() => handleEdit(row.original)}
//                       className="text-blue-600"
//                     >
//                       Edit
//                     </button>
//                   )}
//                 </TableCell>
//                 <TableCell>
//                   <button
//                     onClick={() => handleDelete(row.original.id)}
//                     className="text-red-600"
//                   >
//                     Delete
//                   </button>
//                 </TableCell>
//               </TableRow>
//             ))
//           ) : (
//             <TableRow>
//               <TableCell colSpan={columns.length} className="h-24 text-center">
//                 No results.
//               </TableCell>
//             </TableRow>
//           )}
//         </TableBody>
//       </Table>
//     </div>
//   );
// }
