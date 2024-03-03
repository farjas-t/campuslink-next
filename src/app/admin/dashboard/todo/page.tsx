import { KanbanBoard } from "@/components/kanban/kanban-board";
import NewTaskDialog from "@/components/kanban/new-task-dialog";
import { Heading } from "@/components/ui/heading";

export default function page() {
  return (
    <>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-start justify-between">
          <Heading
            title={`To Do Board`}
            description="Organize your personal todo list here"
          />
          <NewTaskDialog />
        </div>
        <KanbanBoard />
      </div>
    </>
  );
}
