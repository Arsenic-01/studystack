// "use client";

// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogFooter,
// } from "@/components/ui/dialog";
// import { Label } from "@/components/ui/label";
// import { toast } from "sonner";
// import { updateUser } from "@/lib/actions/Admin.actions";

// interface EditUserModalProps {
//   user: {
//     userId: string;
//     name: string;
//     email: string;
//     prnNo: string;
//     role: string;
//   };
//   isOpen: boolean;
//   onClose: () => void;
//   onUpdate: () => void; // To refresh data after update
// }

// export default function EditUserModal({
//   user,
//   isOpen,
//   onClose,
//   onUpdate,
// }: EditUserModalProps) {
//   const [formData, setFormData] = useState(user);
//   const [loading, setLoading] = useState(false);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);

//     const success = await updateUser({ userId: user.userId, data: formData });
//     setLoading(false);

//     if (success) {
//       toast.success("User updated successfully!");
//       onUpdate(); // Refresh table
//       onClose(); // Close modal
//     } else {
//       toast.error("Failed to update user.");
//     }
//   };

//   return (
//     <Dialog open={isOpen} onOpenChange={onClose}>
//       <DialogContent>
//         <DialogHeader>Edit User</DialogHeader>
//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div>
//             <Label>Name</Label>
//             <Input
//               name="name"
//               value={formData.name}
//               onChange={handleChange}
//               required
//             />
//           </div>
//           <div>
//             <Label>Email</Label>
//             <Input
//               name="email"
//               value={formData.email}
//               onChange={handleChange}
//               required
//             />
//           </div>
//           <div>
//             <Label>PRN No</Label>
//             <Input
//               name="prnNo"
//               value={formData.prnNo}
//               onChange={handleChange}
//               required
//             />
//           </div>
//           <div>
//             <Label>Role</Label>
//             <Input
//               name="role"
//               value={formData.role}
//               onChange={handleChange}
//               required
//             />
//           </div>

//           <DialogFooter>
//             <Button type="button" variant="outline" onClick={onClose}>
//               Cancel
//             </Button>
//             <Button type="submit" disabled={loading}>
//               {loading ? "Updating..." : "Update User"}
//             </Button>
//           </DialogFooter>
//         </form>
//       </DialogContent>
//     </Dialog>
//   );
// }
