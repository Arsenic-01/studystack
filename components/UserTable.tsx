// "use client";
// import { useState } from "react";
// import { AdminDashboard, columns } from "@/components/table/columns";
// import { DataTable } from "@/components/table/data-table";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogFooter,
// } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
// } from "@/components/ui/select";

// type Props = { initialData: AdminDashboard[] };

// export default function UserTable({ initialData }: Props) {
//   const [data, setData] = useState<AdminDashboard[]>(initialData);
//   const [search, setSearch] = useState("");
//   const [roleFilter, setRoleFilter] = useState<string>("all");
//   const [editingUser, setEditingUser] = useState<AdminDashboard | null>(null);

//   const handleDelete = (userId: string) => {
//     setData((prev) => prev.filter((user) => user.id !== userId));
//   };

//   const handleEditSave = (updatedUser: AdminDashboard) => {
//     setData((prev) =>
//       prev.map((user) => (user.id === updatedUser.id ? updatedUser : user))
//     );
//     setEditingUser(null);
//   };

//   const filteredData = data.filter((user) => {
//     const searchText = search.toLowerCase();
//     return (
//       (user.name.toLowerCase().includes(searchText) ||
//         user.email.toLowerCase().includes(searchText) ||
//         user.prnNo.toString().includes(searchText)) &&
//       (roleFilter === "all" || user.role === roleFilter.toLowerCase())
//     );
//   });

//   return (
//     <div className="container mx-auto py-20 max-w-6xl">
//       <div className="flex gap-4 mb-6 items-center">
//         <Input
//           type="text"
//           placeholder="Search users..."
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//           className="w-1/2"
//         />
//         <Select
//           value={roleFilter}
//           onValueChange={(value) => setRoleFilter(value)}
//           className="w-1/2"
//         >
//           <SelectTrigger>
//             <Button variant="outline" className="w-full">
//               {roleFilter === "all" ? "All Roles" : roleFilter}
//             </Button>
//           </SelectTrigger>
//           <SelectContent>
//             <SelectItem value="all">All Roles</SelectItem>
//             <SelectItem value="admin">Admin</SelectItem>
//             <SelectItem value="student">Student</SelectItem>
//             <SelectItem value="teacher">Teacher</SelectItem>
//           </SelectContent>
//         </Select>
//       </div>

//       <DataTable
//         columns={columns}
//         data={filteredData}
//         handleDelete={handleDelete}
//         handleEdit={(user) => setEditingUser(user)}
//       />

//       <Dialog open={!!editingUser} onOpenChange={() => setEditingUser(null)}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>Edit User</DialogTitle>
//           </DialogHeader>
//           {editingUser ? (
//             <div className="space-y-4">
//               <Input
//                 value={editingUser.name}
//                 onChange={(e) =>
//                   setEditingUser({ ...editingUser, name: e.target.value })
//                 }
//                 placeholder="Name"
//               />
//               <Input
//                 value={editingUser.email}
//                 onChange={(e) =>
//                   setEditingUser({ ...editingUser, email: e.target.value })
//                 }
//                 placeholder="Email"
//               />
//               <Input
//                 value={editingUser.prnNo}
//                 onChange={(e) =>
//                   setEditingUser({ ...editingUser, prnNo: e.target.value })
//                 }
//                 placeholder="PRN Number"
//               />
//               <Select
//                 value={editingUser.role}
//                 onValueChange={(value) =>
//                   setEditingUser({ ...editingUser, role: value })
//                 }
//               >
//                 <SelectTrigger>
//                   <Button variant="outline" className="w-full">
//                     {editingUser.role}
//                   </Button>
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="admin">Admin</SelectItem>
//                   <SelectItem value="student">Student</SelectItem>
//                   <SelectItem value="teacher">Teacher</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
//           ) : (
//             <p>Loading user details...</p>
//           )}
//           <DialogFooter className="mt-4">
//             <Button variant="outline" onClick={() => setEditingUser(null)}>
//               Cancel
//             </Button>
//             <Button onClick={() => handleEditSave(editingUser!)}>
//               Save Changes
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// }
