import React, { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import BtnPrimary from "./BtnPrimary";
import BtnSecondary from "./BtnSecondary";
import axios from "axios";
import toast from "react-hot-toast";

const AddTaskModal = ({
  isAddTaskModalOpen,
  setAddTaskModal,
  projectId = null,
  taskId = null,
  edit = false,
  refreshData = () => {},
}) => {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [status, setStatus] = useState("To do");

  // Reset form when modal closes or opens without edit mode
  useEffect(() => {
    if (!isAddTaskModalOpen) {
      setTitle("");
      setDesc("");
      setPriority("Medium");
      setStatus("To do");
    }
  }, [isAddTaskModalOpen]);

  // Fetch task data in edit mode
  useEffect(() => {
    if (edit && isAddTaskModalOpen && taskId && projectId) {
      axios
        .get(`/api/projects/${projectId}/tasks/${taskId}`)
        .then((res) => {
          const task = res.data;
          if (task) {
            setTitle(task.title);
            setDesc(task.description);
            setPriority(task.priority || "Medium");
            setStatus(task.stage || "To do");
          }
        })
        .catch(() => {
          toast.error("Failed to fetch task details");
        });
    }
  }, [isAddTaskModalOpen, projectId, taskId, edit]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const taskData = {
      title,
      description: desc,
      priority,
      ...(edit && { stage: status }), // only send stage on edit
    };

    try {
      const response = edit
        ? await axios.put(
            `/api/projects/${projectId}/tasks/${taskId}`,
            taskData
          )
        : await axios.post(`/api/projects/${projectId}/tasks`, taskData);

      if (response.status >= 200 && response.status < 300) {
        toast.success(`Task ${edit ? "updated" : "created"} successfully`);
        setAddTaskModal(false);
        refreshData();
      }
    } catch (error) {
      if (error.response) {
        toast.error(
          error.response.data?.details?.[0]?.message || "Something went wrong"
        );
      } else {
        toast.error("Something went wrong");
      }
    }
  };

  return (
    <Transition appear show={isAddTaskModalOpen} as={Fragment}>
      <Dialog
        as="div"
        open={isAddTaskModalOpen}
        onClose={() => setAddTaskModal(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 overflow-y-auto">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/30" />
          </Transition.Child>
          <div className="fixed inset-0 flex items-center justify-center p-4 w-screen h-screen">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="rounded-md bg-white w-6/12 max-w-lg">
                <Dialog.Title
                  as="div"
                  className="bg-white shadow px-6 py-4 rounded-t-md sticky top-0 flex justify-between items-center"
                >
                  <h1 className="text-lg font-semibold">
                    {edit ? "Edit Task" : "Add Task"}
                  </h1>
                  <button
                    onClick={() => setAddTaskModal(false)}
                    className="text-gray-500 hover:bg-gray-100 rounded p-1"
                    aria-label="Close modal"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </Dialog.Title>
                <form
                  onSubmit={handleSubmit}
                  className="gap-4 px-8 py-4 flex flex-col"
                >
                  <div className="mb-3">
                    <label htmlFor="title" className="block text-gray-600 mb-1">
                      Title
                    </label>
                    <input
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      type="text"
                      className="border border-gray-300 rounded-md w-full text-sm py-2 px-2.5 focus:border-indigo-500 focus:outline-none"
                      placeholder="Task title"
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label
                      htmlFor="description"
                      className="block text-gray-600 mb-1"
                    >
                      Description
                    </label>
                    <textarea
                      id="description"
                      value={desc}
                      onChange={(e) => setDesc(e.target.value)}
                      className="border border-gray-300 rounded-md w-full text-sm py-2 px-2.5 focus:border-indigo-500 focus:outline-none"
                      rows="6"
                      placeholder="Task description"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-600 mb-1">Priority</label>
                    <div className="flex space-x-2">
                      {["Low", "Medium", "High"].map((level) => (
                        <button
                          key={level}
                          type="button"
                          className={`px-4 py-2 rounded-md ${
                            priority === level
                              ? level === "Low"
                                ? "bg-green-500 text-white"
                                : level === "Medium"
                                ? "bg-yellow-500 text-white"
                                : "bg-red-500 text-white"
                              : "bg-gray-200"
                          }`}
                          onClick={() => setPriority(level)}
                        >
                          {level}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Status selector shown only in edit mode */}
                  {edit && (
                    <div className="mb-4">
                      <label className="block text-gray-600 mb-1">Status</label>
                      <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="border border-gray-300 rounded-md w-full text-sm py-2 px-2.5 focus:border-indigo-500 focus:outline-none"
                      >
                        <option value="To do">To do</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Done">Done</option>
                      </select>
                    </div>
                  )}

                  <div className="flex justify-end space-x-2">
                    <BtnSecondary
                      type="button"
                      onClick={() => setAddTaskModal(false)}
                    >
                      Cancel
                    </BtnSecondary>
                    <BtnPrimary type="submit">Save</BtnPrimary>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default AddTaskModal;
