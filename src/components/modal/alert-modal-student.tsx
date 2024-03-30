"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Student } from "../tables/student-tables/columns";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
  data: Student;
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
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/student/${data._id}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        toast({
          description: "Student deleted successfully.",
        });
        console.log("Student deleted successfully");
        router.push("/admin/dashboard/student/");
      } else {
        toast({
          description: "Failed to delete student.",
        });
        console.error("Failed to delete student");
      }

      // Close the modal regardless of success or failure
      onClose();
    } catch (error) {
      toast({
        description: "Error deleting student.",
      });
      console.error("Error deleting student", error);
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
