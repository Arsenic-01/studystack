// import { useState, useEffect } from "react";
// import { useQueryClient } from "@tanstack/react-query";
// import { Pencil, Trash } from "lucide-react";
// import { useMutation } from "@tanstack/react-query";
// import { Modal } from "@/components/ui/modal"; // Assuming you have a modal component
// import { Input } from "@/components/ui/input"; // Assuming you have an input component

// export const AdminDashboard = ({ user }: { user: AdminDashboard }) => {
//   const queryClient = useQueryClient();
//   const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//   const [editedUser, setEditedUser] = useState<AdminDashboard | null>(null);

//   const mutation = useMutation({
//     mutationFn: async (userId: string) => {
//       const res = await fetch("/api/delete", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ userId }),
//       });
//       if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
//       return res.json();
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["users"] });
//     },
//   });

//   const handleEditClick = () => {
//     setEditedUser(user); // Load user data into the form when the Edit button is clicked
//     setIsEditModalOpen(true);
//   };

//   const handleSave = async () => {
//     if (editedUser) {
//       // Call your API or update state with the new user data
//       console.log("Saving edited user", editedUser);
//       setIsEditModalOpen(false);
//     }
//   };

//   const handleDelete = () => {
//     mutation.mutate(user.id);
//   };

//   return (
//     <div>
//       <button
//         onClick={handleEditClick}
//         className="text-blue-600"
//       >
//         <Pencil className="w-4 h-4 mr-2" /> Edit
//       </button>
//       <button
//         onClick={handleDelete}
//         className="text-red-600"
//       >
//         <Trash className="w-4 h-4 mr-2" /> Delete
//       </button>

//       {/* Edit User Modal */}
//       <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
//         <div className="p-4">
//           <h2>Edit User</h2>
//           <div>
//             <label>Name</label>
//             <Input
//               value={editedUser?.name || ""}
//               onChange={(e) => setEditedUser({ ...editedUser, name: e.target.value })}
//             />
//           </div>
//           <div>
//             <label>PRN No.</label>
//             <Input
//               value={editedUser?.prnNo || ""}
//               onChange={(e) => setEditedUser({ ...editedUser, prnNo: e.target.value })}
//             />
//           </div>
//           <div>
//             <label>Email</label>
//             <Input
//               value={editedUser?.email || ""}
//               onChange={(e) => setEditedUser({ ...editedUser, email: e.target.value })}
//             />
//           </div>
//           <div>
//             <label>Role</label>
//             <Input
//               value={editedUser?.role || ""}
//               onChange={(e) => setEditedUser({ ...editedUser, role: e.target.value })}
//             />
//           </div>
//           <button onClick={handleSave}>Save Changes</button>
//         </div>
//       </Modal>
//     </div>
//   );
// };
