// "use client"; // Add this at the top if using Next.js 13+ app dir for client components

// import {
//   Transition,
//   TransitionChild,
//   Dialog,
//   DialogPanel,
// } from "@headlessui/react";
// import axios from "axios";
// import { useState, useEffect } from "react";
// import toast from "react-hot-toast";
// import { Fragment } from "react";

// const TaskModal = ({ isOpen, setIsOpen, id }) => {
//   const [taskData, setTaskData] = useState("");

//   const capitalizeFirstLetter = (string) => {
//     return string ? string.charAt(0).toUpperCase() + string.slice(1) : "";
//   };

//   useEffect(() => {
//     if (isOpen) {
//       axios
//         // Change URL to relative API route if you want Next.js API handling
//         .get(`/api/project/${id.projectId}/task/${id.id}`)
//         .then((data) => {
//           setTaskData({ ...data.data[0].task[0] });
//         })
//         .catch(() => {
//           toast.error("Something went wrong");
//         });
//     }
//   }, [isOpen, id]);

//   const getPriorityBadge = (priority) => {
//     const priorityStyles = {
//       Low: "bg-green-100 text-green-700",
//       Medium: "bg-yellow-100 text-yellow-700",
//       High: "bg-red-100 text-red-700",
//     };
//     return (
//       <span
//         className={`px-3 py-1 rounded-full text-sm font-medium ${
//           priorityStyles[priority] || "bg-gray-100 text-gray-700"
//         }`}
//       >
//         {priority}
//       </span>
//     );
//   };

//   return (
//     <Transition appear show={isOpen} as={Fragment}>
//       <Dialog
//         as="div"
//         open={isOpen}
//         onClose={() => setIsOpen(false)}
//         className="relative z-50"
//       >
//         <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
//         <div className="fixed inset-0 flex items-center justify-center p-4">
//           <TransitionChild
//             as={Fragment}
//             enter="ease-out duration-300"
//             enterFrom="opacity-0 scale-95"
//             enterTo="opacity-100 scale-100"
//             leave="ease-in duration-200"
//             leaveFrom="opacity-100 scale-100"
//             leaveTo="opacity-0 scale-95"
//           >
//             <DialogPanel className="bg-white rounded-lg shadow-lg w-full max-w-3xl p-6">
//               <div className="flex justify-between items-center border-b pb-3">
//                 <h1 className="text-xl font-semibold">Task Details</h1>
//                 <button
//                   onClick={() => setIsOpen(false)}
//                   className="text-gray-500 hover:bg-gray-200 rounded p-1 focus:ring-2 focus:ring-gray-300"
//                   aria-label="Close modal"
//                 >
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     viewBox="0 0 24 24"
//                     fill="currentColor"
//                     className="w-6 h-6"
//                   >
//                     <path
//                       fillRule="evenodd"
//                       d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z"
//                       clipRule="evenodd"
//                     />
//                   </svg>
//                 </button>
//               </div>

//               <div className="mt-4 space-y-3">
//                 <h2 className="text-2xl font-bold">
//                   Title: {capitalizeFirstLetter(taskData.title)}
//                 </h2>
//                 <p className="text-gray-600">
//                   Description: {capitalizeFirstLetter(taskData.description)}
//                 </p>

//                 {/* Priority Section */}
//                 <div className="mt-3">
//                   <h3 className="text-sm font-semibold text-gray-500">
//                     Priority
//                   </h3>
//                   {getPriorityBadge(taskData.priority)}
//                 </div>
//               </div>
//             </DialogPanel>
//           </TransitionChild>
//         </div>
//       </Dialog>
//     </Transition>
//   );
// };

// export default TaskModal;
