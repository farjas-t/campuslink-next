"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Teacher } from "../tables/teacher-tables/columns";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
  data: Teacher;
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
      const response = await fetch(
        `http://localhost:3500/teacher/${data._id}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        toast({
          description: "Teacher deleted successfully.",
        });
        console.log("Teacher deleted successfully");
        router.push("/admin/dashboard/teacher/");
      } else {
        toast({
          description: "Failed to delete teacher.",
        });
        console.error("Failed to delete teacher");
      }

      // Close the modal regardless of success or failure
      onClose();
    } catch (error) {
      toast({
        description: "Error deleting teacher.",
      });
      console.error("Error deleting teacher", error);
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
