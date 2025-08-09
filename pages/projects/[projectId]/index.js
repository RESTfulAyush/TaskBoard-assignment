"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import AddTaskModal from "@/components/AddTaskModal";
import BtnPrimary from "@/components/BtnPrimary";
import DropdownMenu from "@/components/DropdownMenu";
import ProjectDropdown from "@/components/ProjectDropdown";
import TaskModal from "@/components/TaskModal";

export default function Task() {
  const [isAddTaskModalOpen, setAddTaskModal] = useState(false);
  const [columns, setColumns] = useState({});
  const [isRenderChange, setRenderChange] = useState(false);
  const [isTaskOpen, setTaskOpen] = useState(false);
  const [taskId, setTaskId] = useState(null);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);

  const params = useParams();
  const router = useRouter();
  const projectId = params?.projectId;

  useEffect(() => {
    if (!projectId) return;

    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    const fetchProject = async () => {
      try {
        const res = await axios.get(`/api/projects/${projectId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setTitle(res.data.title);
        setColumns({
          todo: {
            name: "To do",
            items: (res.data.tasks?.todo || []).sort(
              (a, b) => a.order - b.order
            ),
          },
          inProgress: {
            name: "In Progress",
            items: (res.data.tasks?.inProgress || []).sort(
              (a, b) => a.order - b.order
            ),
          },
          done: {
            name: "Done",
            items: (res.data.tasks?.done || []).sort(
              (a, b) => a.order - b.order
            ),
          },
        });
      } catch (err) {
        console.error("Error fetching project:", err);
      } finally {
        setLoading(false);
        setRenderChange(false);
      }
    };

    fetchProject();
  }, [projectId, isAddTaskModalOpen, isRenderChange, router]);

  const handleDelete = async (e, taskId) => {
    e.stopPropagation();

    console.log("task id:", taskId);
    console.log("project id:", projectId);
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      await axios.delete(`/api/projects/${projectId}/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Task deleted");
      setRenderChange(true);
    } catch {
      toast.error("Something went wrong");
    }
  };

  const handleTaskDetails = (id) => {
    setTaskId({ projectId, id });
    setTaskOpen(true);
  };

  const priorityStyles = {
    High: "border-red-500 bg-red-50 text-red-800",
    Medium: "border-yellow-500 bg-yellow-50 text-yellow-800",
    Low: "border-green-500 bg-green-50 text-green-800",
  };

  if (loading) return <p>Loading project...</p>;
  if (!title) return <p>Board not found</p>;

  return (
    <div className="px-8 py-6 w-full bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 border-b pb-4 border-gray-200">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center space-x-3">
          <span className="truncate max-w-[300px]">
            {title.length > 25 ? `${title.slice(0, 25)}...` : title}
          </span>
          <ProjectDropdown id={projectId} navigate={router.push} />
        </h1>
        <BtnPrimary onClick={() => setAddTaskModal(true)}>Add Task</BtnPrimary>
      </div>

      {/* Columns */}
      <div className="grid grid-cols-3 gap-6">
        {Object.entries(columns).map(([columnId, column]) => (
          <div
            key={columnId}
            className="bg-white rounded-xl shadow-md overflow-hidden"
          >
            <div
              className={`p-4 border-b-4 ${
                {
                  todo: "border-blue-400 bg-blue-50",
                  inProgress: "border-yellow-400 bg-yellow-50",
                  done: "border-green-400 bg-green-50",
                }[columnId]
              }`}
            >
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-700 uppercase tracking-wider">
                  {column.name}
                </h2>
                {column.items.length > 0 && (
                  <span className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
                    {column.items.length}
                  </span>
                )}
              </div>
            </div>

            {/* Tasks */}
            <div className="p-4 min-h-[500px]">
              {column.items.map((item, index) => (
                <div
                  key={item._id}
                  className={`border-l-4 p-4 mb-4 rounded-lg shadow-md transition-all hover:shadow-lg cursor-pointer ${
                    priorityStyles[item.priority] ||
                    "border-gray-300 bg-gray-100"
                  }`}
                  onClick={() => handleTaskDetails(item._id)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-base font-semibold text-gray-800 truncate pr-2">
                      {item.title.length > 22
                        ? `${item.title.slice(0, 22)}...`
                        : item.title}
                    </h3>
                    <DropdownMenu
                      taskId={item._id}
                      handleDelete={handleDelete}
                      projectId={projectId}
                      setRenderChange={setRenderChange}
                    />
                  </div>
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                    {item.description.length > 60
                      ? `${item.description.slice(0, 60)}...`
                      : item.description}
                  </p>
                  <div className="flex justify-between items-center">
                    <span
                      className={`px-2 py-1 rounded-md text-xs font-medium ${
                        priorityStyles[item.priority] ||
                        "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {item.priority} Priority
                    </span>
                    <span className="text-xs text-gray-500">
                      Task-{index + 1}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Modals */}
      <AddTaskModal
        isAddTaskModalOpen={isAddTaskModalOpen}
        setAddTaskModal={setAddTaskModal}
        projectId={projectId}
      />
      <TaskModal isOpen={isTaskOpen} setIsOpen={setTaskOpen} id={taskId} />
    </div>
  );
}
