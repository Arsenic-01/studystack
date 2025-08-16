"use client";

import { useState, useTransition } from "react"; // ✅ 1. Import useTransition
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { updateUser } from "@/lib/actions/Admin.actions";

export interface UpdateUserData {
  id: string;
  prnNo: string;
  role: "admin" | "teacher" | "student";
  email: string;
  name: string;
  password?: string;
}

type UpdateUserDialogProps = {
  user: UpdateUserData;
  onClose: () => void;
  onUpdate: () => void;
};

export function UpdateUserDialog({
  user,
  onClose,
  onUpdate,
}: UpdateUserDialogProps) {
  const [formData, setFormData] = useState<Omit<UpdateUserData, "password">>({
    id: user.id,
    prnNo: user.prnNo,
    role: user.role,
    email: user.email,
    name: user.name,
  });

  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, startTransition] = useTransition();
  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(() => {
      // Create the payload. The password is sent as plain text (over HTTPS).
      const payload: UpdateUserData = { ...formData };
      if (newPassword) {
        payload.password = newPassword;
      }

      // Call the server action directly
      updateUser(payload).then((result) => {
        if (result.success) {
          onUpdate(); // This will show the toast and close the modal
        } else {
          // Handle error, maybe show a toast
          console.error(result.error);
        }
      });
    });
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader className="mb-5">
          <DialogTitle>Update User</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <FormInput
            label="Name"
            id="name"
            value={formData.name}
            onChange={(name) => setFormData((prev) => ({ ...prev, name }))}
          />
          <FormInput
            label="Email"
            id="email"
            value={formData.email}
            onChange={(email) => setFormData((prev) => ({ ...prev, email }))}
          />
          <FormInput
            label="PRN No"
            id="prnNo"
            value={formData.prnNo}
            onChange={(prnNo) => setFormData((prev) => ({ ...prev, prnNo }))}
          />

          {/* Password Field */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="newPassword" className=" ">
              New Password
            </Label>
            <div className="relative col-span-3">
              <Input
                id="newPassword"
                type={showPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Leave blank to keep current password"
                className="pr-10"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center pr-3"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? (
                  <EyeOffIcon className="h-5 w-5 text-gray-400" />
                ) : (
                  <EyeIcon className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
          </div>

          {/* Role Selector */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="role" className=" ">
              Role
            </Label>
            <Select
              value={formData.role}
              onValueChange={(role) =>
                setFormData((prev) => ({
                  ...prev,
                  role: role as "admin" | "teacher" | "student",
                }))
              }
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="teacher">Teacher</SelectItem>
                <SelectItem value="student">Student</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Updating..." : "Update"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

const FormInput = ({
  label,
  id,
  value,
  onChange,
}: {
  label: string;
  id: string;
  value: string;
  onChange: (val: string) => void;
}) => (
  <div className="grid grid-cols-4 items-center gap-4">
    <Label htmlFor={id} className=" ">
      {label}
    </Label>
    <Input
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="col-span-3"
    />
  </div>
);
