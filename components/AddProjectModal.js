import React, { Fragment, memo, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import BtnPrimary from "./BtnPrimary";
import BtnSecondary from "./BtnSecondary";
import axios from "axios";
import toast from "react-hot-toast";

const AddProjectModal = ({
  isModalOpen,
  closeModal,
  edit = false,
  id = null,
  onSuccess,
}) => {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isModalOpen) {
      if (edit && id) {
        const token = localStorage.getItem("token");
        axios
          .get(`/api/projects/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then((res) => {
            setTitle(res.data.title || "");
            setDesc(res.data.description || "");
          })
          .catch(() => {
            toast.error("Failed to fetch project data");
            closeModal();
          });
      } else {
        setTitle("");
        setDesc("");
      }
    } else {
      setTitle("");
      setDesc("");
      setLoading(false);
    }
  }, [edit, isModalOpen, id, closeModal]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("You must be logged in");
      return;
    }

    setLoading(true);

    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };

    try {
      if (edit && id) {
        await axios.put(
          `/api/projects/${id}`,
          { title, description: desc },
          config
        );
        toast.success("Board updated successfully");
      } else {
        await axios.post("/api/projects", { title, description: desc }, config);
        toast.success("Board created successfully");
      }
      closeModal();
      onSuccess?.();
    } catch (error) {
      if (error.response?.status === 422) {
        toast.error(
          error.response.data.details?.[0]?.message || "Validation error"
        );
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Transition appear show={isModalOpen} as={Fragment}>
      <Dialog
        as="div"
        open={isModalOpen}
        onClose={closeModal}
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
              enter="ease-out duration-300 "
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="rounded-md bg-white w-6/12 max-w-lg">
                <Dialog.Title
                  as="div"
                  className="bg-white shadow px-6 py-4 rounded-t-md sticky top-0 relative flex justify-between items-center"
                >
                  <h1 className="text-gray-900 text-lg font-semibold">
                    {edit ? "Edit Project" : "Create Project"}
                  </h1>
                  <button
                    onClick={closeModal}
                    className="absolute right-6 top-4 text-gray-500 hover:bg-gray-100 rounded focus:outline-none focus:ring focus:ring-offset-1 focus:ring-indigo-200"
                    aria-label="Close modal"
                    type="button"
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
                    <label htmlFor="title" className="block text-gray-600">
                      Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="title"
                      name="title"
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                      className="border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 w-full text-sm py-2 px-2.5 focus:border-indigo-500 focus:outline-offset-1 focus:outline-indigo-400"
                      placeholder="Board title"
                    />
                  </div>
                  <div className="mb-2">
                    <label
                      htmlFor="description"
                      className="block text-gray-600"
                    >
                      Description
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={desc}
                      onChange={(e) => setDesc(e.target.value)}
                      className="border border-gray-300 text-gray-900 placeholder-gray-400 rounded-md w-full text-sm py-2 px-2.5 focus:border-indigo-500 focus:outline-offset-1 focus:outline-indigo-400"
                      rows="6"
                      placeholder="Board description"
                    />
                  </div>
                  <div className="flex justify-end items-center space-x-2">
                    <BtnSecondary onClick={closeModal} type="button">
                      Cancel
                    </BtnSecondary>
                    <BtnPrimary type="submit" disabled={loading}>
                      {loading
                        ? edit
                          ? "Updating..."
                          : "Creating..."
                        : "Save"}
                    </BtnPrimary>
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

export default memo(AddProjectModal);
