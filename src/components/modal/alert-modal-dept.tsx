"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Department } from "../tables/department-tables/columns";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
  data: Department;
}

export const AlertModal: React.FC<AlertModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  loading,
  data,
}) => {
  const [isMounted, setIsMounted] = useState(false);

  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleDelete = async () => {
    try {
      // Assuming your API endpoint is http://localhost:3500/department/:DeptId
      const response = await fetch(
        `http://localhost:3500/department/${data._id}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        toast({
          description: "Department deleted successfully.",
        });
        console.log("Department deleted successfully");
        router.push("/admin/dashboard/department/");
      } else {
        toast({
          description: "Failed to delete department.",
        });
        console.error("Failed to delete department");
      }

      // Close the modal regardless of success or failure
      onClose();
    } catch (error) {
      toast({
        description: "Error deleting department.",
      });
      console.error("Error deleting department", error);
    }
  };

  if (!isMounted) {
    return null;
  }

  return (
    <Modal
      title="Are you sure?"
      description="This action cannot be undone."
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className="pt-6 space-x-2 flex items-center justify-end w-full">
        <Button disabled={loading} variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button disabled={loading} variant="destructive" onClick={handleDelete}>
          Continue
        </Button>
      </div>
    </Modal>
  );
};
