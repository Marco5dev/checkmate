"use client";

import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash,
  faPencil,
  faFolderOpen,
  faEllipsisVertical,
  faChevronRight,
  faChevronDown,
  faCheck,
  faXmark,
  faAngleDown,
  faAngleRight,
  faPlus, // Add to imports
} from "@fortawesome/free-solid-svg-icons";
import LoadingTaskCard from "@/components/loadings/LoadingTaskCard";
import LoadingFolderItem from "@/components/loadings/LoadingFolderItem";

export default function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [folders, setFolders] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    dueDate: new Date().toISOString().split("T")[0],
    folderId: "",
  });
  const [isNewFolderModalOpen, setIsNewFolderModalOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [editingTask, setEditingTask] = useState(null);
  const [isMovingTask, setIsMovingTask] = useState(null);
  const [editingFolder, setEditingFolder] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(null);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [expandedTasks, setExpandedTasks] = useState(new Set());
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false); // Add new state for modals
  const [isEditTaskModalOpen, setIsEditTaskModalOpen] = useState(false);
  const [isEditFolderModalOpen, setIsEditFolderModalOpen] = useState(false);
  const [moveTaskModal, setMoveTaskModal] = useState(null); // Add new state for move task modal
  const [isLoading, setIsLoading] = useState(true);
  const [isFoldersLoading, setIsFoldersLoading] = useState(true);
  const [taskToDelete, setTaskToDelete] = useState(null); // Add this new state
  const [showTodayOnly, setShowTodayOnly] = useState(false);
  const [isAddingTask, setIsAddingTask] = useState(false); // Add new state for loading

  const isTaskDueToday = (taskDate) => {
    const today = new Date();
    const dueDate = new Date(taskDate);
    return (
      dueDate.getDate() === today.getDate() &&
      dueDate.getMonth() === today.getMonth() &&
      dueDate.getFullYear() === today.getFullYear()
    );
  };

  useEffect(() => {
    fetchTasks();
    fetchFolders();

    // Listen for new folder modal event
    const handleNewFolder = () => setIsNewFolderModalOpen(true);
    const handleDrawerToggle = (e) => {
      if (e.detail?.open !== undefined) {
        setMobileDrawerOpen(e.detail.open);
      }
    };
    const handleFolderSelect = (e) => {
      if (e.detail?.folder === null) {
        setSelectedFolder(null);
      } else if (e.detail?.folder) {
        setSelectedFolder(e.detail.folder);
      }
    };

    window.addEventListener("openNewFolderModal", handleNewFolder);
    window.addEventListener("toggleMobileDrawer", handleDrawerToggle);
    window.addEventListener("selectFolder", handleFolderSelect);

    return () => {
      window.removeEventListener("openNewFolderModal", handleNewFolder);
      window.removeEventListener("toggleMobileDrawer", handleDrawerToggle);
      window.removeEventListener("selectFolder", handleFolderSelect);
    };
  }, []);

  useEffect(() => {
    // Update folders in drawer when they change
    if (mobileDrawerOpen) {
      window.dispatchEvent(
        new CustomEvent("updateFoldersList", {
          detail: { folders, selectedFolder },
        })
      );
    }
  }, [folders, selectedFolder, mobileDrawerOpen]);

  const fetchTasks = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/tasks");
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      toast.error("Failed to fetch tasks");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchFolders = async () => {
    setIsFoldersLoading(true);
    try {
      const response = await fetch("/api/folders");
      const data = await response.json();
      console.log("Fetched folders:", data); // Debug log
      setFolders(data);
    } catch (error) {
      toast.error("Failed to fetch folders");
    } finally {
      setIsFoldersLoading(false);
    }
  };

  const createFolder = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/folders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newFolderName }),
      });

      if (response.ok) {
        toast.success("Folder created successfully");
        setNewFolderName("");
        setIsNewFolderModalOpen(false);
        fetchFolders();
      } else {
        const data = await response.json();
        toast.error(data.error || "Failed to create folder");
      }
    } catch (error) {
      toast.error("Failed to create folder");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsAddingTask(true);
    try {
      const taskData = {
        ...newTask,
        folderId: selectedFolder?._id || newTask.folderId || null,
      };

      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(taskData),
      });

      if (response.ok) {
        toast.success("Task created successfully");
        fetchTasks();
        setNewTask({
          title: "",
          description: "",
          dueDate: new Date().toISOString().split("T")[0],
          folderId: "",
        });
        // setIsNewTaskModalOpen(false);
      } else {
        const data = await response.json();
        toast.error(data.error || "Failed to create task");
      }
    } catch (error) {
      toast.error("Failed to create task");
    } finally {
      setIsAddingTask(false);
    }
  };

  const toggleTask = async (taskId) => {
    try {
      const task = tasks.find((t) => t._id === taskId);
      if (!task) return;

      const response = await fetch("/api/tasks", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          taskId,
          done: !task.done,
        }),
      });

      if (response.ok) {
        const updatedTask = await response.json();
        setTasks(tasks.map((t) => (t._id === taskId ? updatedTask : t)));
      } else {
        const data = await response.json();
        toast.error(data.error || "Failed to update task");
      }
    } catch (error) {
      toast.error("Failed to toggle task status");
    }
  };

  const deleteTask = async (taskId) => {
    try {
      const response = await fetch("/api/tasks", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taskId }),
      });

      if (response.ok) {
        toast.success("Task deleted successfully");
        setTasks(tasks.filter((t) => t._id !== taskId));
        setTaskToDelete(null); // Clear the task to delete
      } else {
        const data = await response.json();
        toast.error(data.error || "Failed to delete task");
      }
    } catch (error) {
      toast.error("Failed to delete task");
    }
  };

  const editTask = async (taskId, updatedData) => {
    try {
      const response = await fetch("/api/tasks", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          taskId,
          ...updatedData,
        }),
      });

      if (response.ok) {
        const updatedTask = await response.json();
        setTasks(tasks.map((t) => (t._id === taskId ? updatedTask : t)));
        setEditingTask(null);
        toast.success("Task updated successfully");
      } else {
        const data = await response.json();
        toast.error(data.error || "Failed to update task");
      }
    } catch (error) {
      toast.error("Failed to update task");
    }
  };

  const handleMoveTask = (taskId) => {
    const task = tasks.find((t) => t._id === taskId);
    if (task) {
      setMoveTaskModal({
        taskId,
        currentFolderId: task.folderId,
        selectedFolderId: task.folderId || "",
      });
    }
  };

  const moveTask = async (taskId, newFolderId) => {
    try {
      const response = await fetch("/api/tasks", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          taskId,
          folderId: newFolderId,
        }),
      });

      if (response.ok) {
        const updatedTask = await response.json();
        setTasks(tasks.map((t) => (t._id === taskId ? updatedTask : t)));
        setMoveTaskModal(null);
        toast.success("Task moved successfully");
      } else {
        const data = await response.json();
        toast.error(data.error || "Failed to move task");
      }
    } catch (error) {
      toast.error("Failed to move task");
    }
  };

  const renameFolder = async (folderId, newName) => {
    try {
      const response = await fetch("/api/folders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ folderId, name: newName }),
      });

      if (response.ok) {
        toast.success("Folder renamed successfully");
        fetchFolders();
        setEditingFolder(null);
      } else {
        const data = await response.json();
        toast.error(data.error || "Failed to rename folder");
      }
    } catch (error) {
      toast.error("Failed to rename folder");
    }
  };

  const deleteFolder = async (folderId, deleteTasks = false) => {
    try {
      const response = await fetch("/api/folders", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ folderId, deleteTasks }),
      });

      if (response.ok) {
        toast.success("Folder deleted successfully");
        if (selectedFolder?._id === folderId) {
          setSelectedFolder(null);
        }
        fetchFolders();
        fetchTasks();
        setShowDeleteModal(null);
      } else {
        const data = await response.json();
        toast.error(data.error || "Failed to delete folder");
      }
    } catch (error) {
      toast.error("Failed to delete folder");
    }
  };

  const toggleTaskExpand = (taskId) => {
    setExpandedTasks((prev) => {
      const next = new Set(prev);
      if (next.has(taskId)) {
        next.delete(taskId);
      } else {
        next.add(taskId);
      }
      return next;
    });
  };

  const closeAllModals = () => {
    setIsNewTaskModalOpen(false);
    setIsEditTaskModalOpen(false);
    setIsEditFolderModalOpen(false);
    setEditingTask(null);
    setEditingFolder(null);
  };

  const renderTaskForm = (inModal = false) => (
    <form
      onSubmit={handleSubmit}
      className={inModal ? "" : "mb-6 bg-base-300 p-4 rounded-lg"}
    >
      <div className="flex flex-col gap-4">
        <input
          type="text"
          value={newTask.title}
          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
          placeholder="Task title"
          className="input input-bordered w-full"
          required
        />
        <input
          type="date"
          value={newTask.dueDate}
          onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
          className="input input-bordered w-full"
          required
        />
        {!selectedFolder && (
          <select
            value={newTask.folderId}
            onChange={(e) =>
              setNewTask({ ...newTask, folderId: e.target.value })
            }
            className="select select-bordered w-full"
          >
            <option value="">No Folder</option>
            {folders.map((folder) => (
              <option key={folder._id} value={folder._id}>
                {folder.name}
              </option>
            ))}
          </select>
        )}
        <textarea
          value={newTask.description}
          onChange={(e) =>
            setNewTask({ ...newTask, description: e.target.value })
          }
          placeholder="Task description (optional)"
          className="textarea textarea-bordered w-full"
          rows={3}
        />
        <div className="flex justify-end">
          <button type="submit" className="btn btn-primary w-full">
            Add Task
          </button>
        </div>
      </div>
    </form>
  );

  const renderFoldersList = () => {
    if (isFoldersLoading) {
      return (
        <div className="space-y-2">
          {[...Array(4)].map((_, i) => (
            <LoadingFolderItem key={i} />
          ))}
        </div>
      );
    }

    return (
      <ul className="space-y-2">
        <li key="all-tasks">
          <div
            className={`flex items-center gap-2 p-2 hover:bg-base-400 rounded ${
              !selectedFolder ? "bg-base-400" : ""
            }`}
            onClick={() => setSelectedFolder(null)}
          >
            <div
              className={`cursor-pointer flex-grow flex items-center gap-2 ${
                !selectedFolder ? "text-primary font-bold" : ""
              }`}
            >
              <FontAwesomeIcon icon={faFolderOpen} className="w-4 h-4" />
              All Tasks
            </div>
          </div>
        </li>
        {folders.length === 0 ? (
          <li className="text-gray-500 text-center p-2">No folders yet</li>
        ) : (
          folders.map((folder) => (
            <li key={folder._id}>
              <div
                className={`flex items-center gap-2 p-2 hover:bg-base-400 rounded ${
                  selectedFolder?._id === folder._id ? "bg-base-400" : ""
                }`}
              >
                <div
                  onClick={() => !editingFolder && setSelectedFolder(folder)}
                  className={`cursor-pointer flex-grow flex items-center gap-2 ${
                    selectedFolder?._id === folder._id
                      ? "text-primary font-bold"
                      : ""
                  }`}
                >
                  <FontAwesomeIcon icon={faFolderOpen} className="w-4 h-4" />
                  {editingFolder?.id === folder._id ? (
                    <input
                      type="text"
                      value={editingFolder.name}
                      onChange={(e) =>
                        setEditingFolder({
                          ...editingFolder,
                          name: e.target.value,
                        })
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          renameFolder(folder._id, editingFolder.name);
                        } else if (e.key === "Escape") {
                          setEditingFolder(null);
                        }
                      }}
                      className="input input-bordered input-sm flex-grow"
                      autoFocus
                    />
                  ) : (
                    folder.name
                  )}
                </div>
                {editingFolder?.id === folder._id ? (
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        renameFolder(folder._id, editingFolder.name)
                      }
                      className="btn btn-ghost btn-sm"
                    >
                      <FontAwesomeIcon
                        icon={faCheck}
                        className="text-success"
                      />
                    </button>
                    <button
                      onClick={() => setEditingFolder(null)}
                      className="btn btn-ghost btn-sm"
                    >
                      <FontAwesomeIcon icon={faXmark} className="text-error" />
                    </button>
                  </div>
                ) : (
                  <div className="dropdown dropdown-end">
                    <label tabIndex={0} className="btn btn-ghost btn-sm">
                      <FontAwesomeIcon icon={faEllipsisVertical} />
                    </label>
                    <ul
                      tabIndex={0}
                      className="dropdown-content z-[1] menu p-2 shadow bg-base-200 rounded-box w-52"
                    >
                      <li>
                        <button
                          onClick={() =>
                            setEditingFolder({
                              id: folder._id,
                              name: folder.name,
                            })
                          }
                        >
                          Rename
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={() => setShowDeleteModal(folder)}
                          className="text-error"
                        >
                          Delete
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </li>
          ))
        )}
      </ul>
    );
  };

  const renderTasksList = (tasks) => {
    // Apply today filter if enabled
    const filteredTasks = showTodayOnly
      ? tasks.filter((task) => isTaskDueToday(task.dueDate))
      : tasks;

    const uncompletedTasks = filteredTasks.filter((task) => !task.done);
    const completedTasks = filteredTasks.filter((task) => task.done);

    return (
      <>
        {/* Uncompleted Tasks */}
        <div className="mb-8">
          <h3 className="text-lg font-bold mb-4">Tasks To Do</h3>
          <div className="space-y-4">
            {uncompletedTasks.length === 0 ? (
              <div className="flex items-center justify-center h-32 bg-base-200 rounded-lg">
                <div className="text-center">
                  <p className="text-gray-500 text-lg mb-2">No tasks to do</p>
                  <p className="text-sm text-gray-400">
                    {selectedFolder
                      ? "This folder is empty"
                      : "Click 'Add Task' to create a new task"}
                  </p>
                </div>
              </div>
            ) : (
              uncompletedTasks.map((task) => (
                <div key={task._id} className="bg-base-200 rounded-lg">
                  {editingTask?.id === task._id ? (
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        editTask(task._id, editingTask);
                      }}
                      className="p-4 flex flex-col gap-4"
                    >
                      <div className="flex gap-4 flex-wrap">
                        <input
                          type="text"
                          value={editingTask.title}
                          onChange={(e) =>
                            setEditingTask({
                              ...editingTask,
                              title: e.target.value,
                            })
                          }
                          className="input input-bordered flex-1"
                          required
                        />
                        <input
                          type="date"
                          value={editingTask.dueDate.split("T")[0]}
                          onChange={(e) =>
                            setEditingTask({
                              ...editingTask,
                              dueDate: e.target.value,
                            })
                          }
                          className="input input-bordered w-full"
                          required
                        />
                      </div>
                      <textarea
                        value={editingTask.description}
                        onChange={(e) =>
                          setEditingTask({
                            ...editingTask,
                            description: e.target.value,
                          })
                        }
                        placeholder="Task description (optional)"
                        className="textarea textarea-bordered w-full"
                        rows={3}
                      />
                      <div className="flex justify-end gap-2">
                        <button type="submit" className="btn btn-primary">
                          Save
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingTask(null)}
                          className="btn btn-ghost"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    <>
                      <div className="flex items-center gap-4 p-4">
                        <button
                          onClick={() => toggleTaskExpand(task._id)}
                          className="btn btn-ghost btn-sm px-0 min-w-8"
                        >
                          <FontAwesomeIcon
                            icon={
                              expandedTasks.has(task._id)
                                ? faAngleDown
                                : faAngleRight
                            }
                            className="w-4 h-4"
                          />
                        </button>
                        <input
                          type="checkbox"
                          checked={task.done}
                          onChange={() => toggleTask(task._id)}
                          className="checkbox checkbox-primary"
                        />
                        <div className="flex-1">
                          <h3
                            className={`font-bold ${
                              task.done ? "line-through" : ""
                            }`}
                          >
                            {task.title}
                          </h3>
                          <div className="flex gap-2 flex-wrap text-sm text-gray-500">
                            <span>
                              Due: {new Date(task.dueDate).toLocaleDateString()}
                            </span>
                            {!selectedFolder && task.folderId && (
                              <span className="flex items-center gap-1">
                                <FontAwesomeIcon
                                  icon={faFolderOpen}
                                  className="w-3 h-3"
                                />
                                {
                                  folders.find((f) => f._id === task.folderId)
                                    ?.name
                                }
                              </span>
                            )}
                          </div>
                        </div>
                        {/* Task Actions */}
                        <div className="flex gap-2">
                          {/* Desktop Actions */}
                          <div className="hidden lg:flex gap-2">
                            <button
                              onClick={() =>
                                setEditingTask({
                                  id: task._id,
                                  title: task.title,
                                  dueDate: task.dueDate,
                                  description: task.description || "",
                                })
                              }
                              className="btn btn-ghost btn-sm"
                            >
                              <FontAwesomeIcon
                                icon={faPencil}
                                className="text-primary"
                              />
                            </button>
                            <button
                              onClick={() => handleMoveTask(task._id)}
                              className="btn btn-ghost btn-sm"
                            >
                              <FontAwesomeIcon
                                icon={faFolderOpen}
                                className="text-primary"
                              />
                            </button>
                            <button
                              onClick={() => setTaskToDelete(task)}
                              className="btn btn-ghost btn-sm"
                            >
                              <FontAwesomeIcon
                                icon={faTrash}
                                className="text-error"
                              />
                            </button>
                          </div>

                          {/* Mobile Actions */}
                          <div className="lg:hidden dropdown dropdown-end">
                            <label
                              tabIndex={0}
                              className="btn btn-ghost btn-sm"
                            >
                              <FontAwesomeIcon icon={faEllipsisVertical} />
                            </label>
                            <ul
                              tabIndex={0}
                              className="dropdown-content z-[1] menu p-2 shadow bg-base-200 rounded-box w-52"
                            >
                              <li>
                                <button
                                  onClick={() =>
                                    setEditingTask({
                                      id: task._id,
                                      title: task.title,
                                      dueDate: task.dueDate,
                                      description: task.description || "",
                                    })
                                  }
                                >
                                  <FontAwesomeIcon icon={faPencil} /> Edit
                                </button>
                              </li>
                              <li>
                                <button
                                  onClick={() => handleMoveTask(task._id)}
                                >
                                  <FontAwesomeIcon icon={faFolderOpen} /> Move
                                  to Folder
                                </button>
                              </li>
                              <li>
                                <button
                                  onClick={() => setTaskToDelete(task)}
                                  className="text-error"
                                >
                                  <FontAwesomeIcon icon={faTrash} /> Delete
                                </button>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                      {expandedTasks.has(task._id) && (
                        <div className="px-16 pb-4">
                          <p className="text-gray-500 whitespace-pre-wrap">
                            {task.description || "No description"}
                          </p>
                        </div>
                      )}
                    </>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Completed Tasks */}
        <div className="pt-8 border-t border-base-200">
          <h3 className="text-lg font-bold mb-4">Completed Tasks</h3>
          <div className="space-y-4 opacity-60">
            {completedTasks.length === 0 ? (
              <div className="flex items-center justify-center h-24 bg-base-200 rounded-lg">
                <p className="text-gray-500">No completed tasks</p>
              </div>
            ) : (
              completedTasks.map((task) => (
                <div key={task._id} className="bg-base-200 rounded-lg">
                  {editingTask?.id === task._id ? (
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        editTask(task._id, editingTask);
                      }}
                      className="p-4 flex flex-col gap-4"
                    >
                      <div className="flex gap-4 flex-wrap">
                        <input
                          type="text"
                          value={editingTask.title}
                          onChange={(e) =>
                            setEditingTask({
                              ...editingTask,
                              title: e.target.value,
                            })
                          }
                          className="input input-bordered flex-1"
                          required
                        />
                        <input
                          type="date"
                          value={editingTask.dueDate.split("T")[0]}
                          onChange={(e) =>
                            setEditingTask({
                              ...editingTask,
                              dueDate: e.target.value,
                            })
                          }
                          className="input input-bordered"
                          required
                        />
                      </div>
                      <textarea
                        value={editingTask.description}
                        onChange={(e) =>
                          setEditingTask({
                            ...editingTask,
                            description: e.target.value,
                          })
                        }
                        placeholder="Task description (optional)"
                        className="textarea textarea-bordered w-full"
                        rows={3}
                      />
                      <div className="flex justify-end gap-2">
                        <button type="submit" className="btn btn-primary">
                          Save
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingTask(null)}
                          className="btn btn-ghost"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    <>
                      <div className="flex items-center gap-4 p-4">
                        <button
                          onClick={() => toggleTaskExpand(task._id)}
                          className="btn btn-ghost btn-sm px-0 min-w-8"
                        >
                          <FontAwesomeIcon
                            icon={
                              expandedTasks.has(task._id)
                                ? faAngleDown
                                : faAngleRight
                            }
                            className="w-4 h-4"
                          />
                        </button>
                        <input
                          type="checkbox"
                          checked={task.done}
                          onChange={() => toggleTask(task._id)}
                          className="checkbox checkbox-primary"
                        />
                        <div className="flex-1">
                          <h3
                            className={`font-bold ${
                              task.done ? "line-through" : ""
                            }`}
                          >
                            {task.title}
                          </h3>
                          <div className="flex gap-2 flex-wrap text-sm text-gray-500">
                            <span>
                              Due: {new Date(task.dueDate).toLocaleDateString()}
                            </span>
                            {!selectedFolder && task.folderId && (
                              <span className="flex items-center gap-1">
                                <FontAwesomeIcon
                                  icon={faFolderOpen}
                                  className="w-3 h-3"
                                />
                                {
                                  folders.find((f) => f._id === task.folderId)
                                    ?.name
                                }
                              </span>
                            )}
                          </div>
                        </div>
                        {/* Task Actions */}
                        <div className="flex gap-2">
                          {/* Desktop Actions */}
                          <div className="hidden lg:flex gap-2">
                            <button
                              onClick={() =>
                                setEditingTask({
                                  id: task._id,
                                  title: task.title,
                                  dueDate: task.dueDate,
                                  description: task.description || "",
                                })
                              }
                              className="btn btn-ghost btn-sm"
                            >
                              <FontAwesomeIcon
                                icon={faPencil}
                                className="text-primary"
                              />
                            </button>
                            <button
                              onClick={() => handleMoveTask(task._id)}
                              className="btn btn-ghost btn-sm"
                            >
                              <FontAwesomeIcon
                                icon={faFolderOpen}
                                className="text-primary"
                              />
                            </button>
                            <button
                              onClick={() => setTaskToDelete(task)}
                              className="btn btn-ghost btn-sm"
                            >
                              <FontAwesomeIcon
                                icon={faTrash}
                                className="text-error"
                              />
                            </button>
                          </div>

                          {/* Mobile Actions */}
                          <div className="lg:hidden dropdown dropdown-end">
                            <label
                              tabIndex={0}
                              className="btn btn-ghost btn-sm"
                            >
                              <FontAwesomeIcon icon={faEllipsisVertical} />
                            </label>
                            <ul
                              tabIndex={0}
                              className="dropdown-content z-[1] menu p-2 shadow bg-base-200 rounded-box w-52"
                            >
                              <li>
                                <button
                                  onClick={() =>
                                    setEditingTask({
                                      id: task._id,
                                      title: task.title,
                                      dueDate: task.dueDate,
                                      description: task.description || "",
                                    })
                                  }
                                >
                                  <FontAwesomeIcon icon={faPencil} /> Edit
                                </button>
                              </li>
                              <li>
                                <button
                                  onClick={() => handleMoveTask(task._id)}
                                >
                                  <FontAwesomeIcon icon={faFolderOpen} /> Move
                                  to Folder
                                </button>
                              </li>
                              <li>
                                <button
                                  onClick={() => setTaskToDelete(task)}
                                  className="text-error"
                                >
                                  <FontAwesomeIcon icon={faTrash} /> Delete
                                </button>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                      {expandedTasks.has(task._id) && (
                        <div className="px-16 pb-4">
                          <p className="text-gray-500 whitespace-pre-wrap">
                            {task.description || "No description"}
                          </p>
                        </div>
                      )}
                    </>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </>
    );
  };

  return (
    <div className="flex justify-center h-screen login-bg bg-cover bg-no-repeat bg-center">
      <div className="w-[95%] h-5/6 mt-24 flex flex-col items-center contect-center">
        <div className="flex flex-col md:flex-row w-full h-full gap-6">
          {/* Folders Sidebar - Only visible on md and larger screens */}
          <div className="hidden lg:flex bg-base-300 p-4 rounded-lg md:w-1/4 flex-col">
            <h2 className="text-xl font-bold mb-4">Folders</h2>

            {/* Make this div scrollable */}
            <div className="flex-1 overflow-y-auto mb-4">
              {renderFoldersList()}
            </div>

            {/* New Folder button at bottom */}
            <button
              onClick={() => setIsNewFolderModalOpen(true)}
              className="btn btn-primary w-full"
            >
              <FontAwesomeIcon icon={faPlus} className="mr-2" />
              New Folder
            </button>
          </div>

          {/* Tasks List */}
          <div className="flex-1 flex flex-col h-full">
            {/* Tasks Header with Add Button */}
            <div className="bg-base-300 p-4 rounded-lg mb-4 flex justify-between items-center">
              <h2 className="text-xl font-bold">
                {selectedFolder ? selectedFolder.name : "All Tasks"}
              </h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowTodayOnly(!showTodayOnly)}
                  className={`btn btn-sm ${
                    showTodayOnly ? "btn-primary" : "btn-neutral"
                  }`}
                >
                  Today
                  {showTodayOnly && (
                    <div className="badge badge-secondary badge-sm ml-2">
                      {
                        tasks.filter((task) => isTaskDueToday(task.dueDate))
                          .length
                      }
                    </div>
                  )}
                </button>
                <button
                  onClick={() => setIsNewTaskModalOpen(true)}
                  className="btn btn-primary btn-sm"
                >
                  Add Task
                </button>
              </div>
            </div>

            {/* Scrollable Tasks List */}
            <div className="flex-1 bg-base-300 p-4 rounded-lg overflow-y-auto">
              {isLoading ? (
                <div className="space-y-4">
                  {[...Array(6)].map((_, i) => (
                    <LoadingTaskCard key={i} />
                  ))}
                </div>
              ) : (
                renderTasksList(
                  tasks.filter(
                    (task) =>
                      !selectedFolder || task.folderId === selectedFolder._id
                  )
                )
              )}
            </div>
          </div>
        </div>

        {/* New Folder Modal */}
        {isNewFolderModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-base-200 p-6 rounded-lg w-96">
              <h3 className="text-lg font-bold mb-4">Create New Folder</h3>
              <form onSubmit={createFolder}>
                <input
                  type="text"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  placeholder="Folder name"
                  className="input input-bordered w-full mb-4"
                  required
                />
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsNewFolderModalOpen(false)}
                    className="btn btn-ghost"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Create
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Folder Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-base-200 p-6 rounded-lg w-96">
              <h3 className="text-lg font-bold mb-4">Delete Folder</h3>
              <p className="mb-4">
                What would you like to do with the tasks in this folder?
              </p>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowDeleteModal(null)}
                  className="btn btn-ghost"
                >
                  Cancel
                </button>
                <button
                  onClick={() => deleteFolder(showDeleteModal._id, false)}
                  className="btn btn-primary"
                >
                  Keep Tasks
                </button>
                <button
                  onClick={() => deleteFolder(showDeleteModal._id, true)}
                  className="btn btn-error"
                >
                  Delete Tasks
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Mobile Modals */}
        {/* New Task Modal */}
        {isNewTaskModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-base-200 p-6 rounded-lg w-[95%] max-w-lg">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">Add New Task</h3>
                <button
                  onClick={() => setIsNewTaskModalOpen(false)}
                  className="btn btn-ghost btn-sm btn-circle"
                  disabled={isAddingTask}
                >
                  <FontAwesomeIcon icon={faXmark} className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  value={newTask.title}
                  onChange={(e) =>
                    setNewTask({ ...newTask, title: e.target.value })
                  }
                  placeholder="Task title"
                  className="input input-bordered w-full"
                  required
                  disabled={isAddingTask}
                />
                <input
                  type="date"
                  value={newTask.dueDate}
                  onChange={(e) =>
                    setNewTask({ ...newTask, dueDate: e.target.value })
                  }
                  className="input input-bordered w-full"
                  required
                  disabled={isAddingTask}
                />
                {!selectedFolder && (
                  <select
                    value={newTask.folderId}
                    onChange={(e) =>
                      setNewTask({ ...newTask, folderId: e.target.value })
                    }
                    className="select select-bordered w-full"
                    disabled={isAddingTask}
                  >
                    <option value="">No Folder</option>
                    {folders.map((folder) => (
                      <option key={folder._id} value={folder._id}>
                        {folder.name}
                      </option>
                    ))}
                  </select>
                )}
                <textarea
                  value={newTask.description}
                  onChange={(e) =>
                    setNewTask({ ...newTask, description: e.target.value })
                  }
                  placeholder="Task description (optional)"
                  className="textarea textarea-bordered w-full"
                  rows={3}
                  disabled={isAddingTask}
                />
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsNewTaskModalOpen(false)}
                    className="btn btn-ghost"
                    disabled={isAddingTask}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className={`btn btn-primary ${
                      isAddingTask ? "loading" : ""
                    }`}
                    disabled={isAddingTask}
                  >
                    {isAddingTask ? "Adding..." : "Add Task"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Task Modal */}
        {isEditTaskModalOpen && editingTask && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-base-200 p-6 rounded-lg w-[95%] max-w-lg">
              <h3 className="text-lg font-bold mb-4">Edit Task</h3>
              {/* ...existing edit task form... */}
            </div>
          </div>
        )}

        {/* Move Task Modal */}
        {moveTaskModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-base-200 p-6 rounded-lg w-[95%] max-w-lg">
              <h3 className="text-lg font-bold mb-4">Move Task to Folder</h3>
              <div className="form-control w-full">
                <select
                  className="select select-bordered w-full mb-4"
                  value={moveTaskModal.selectedFolderId}
                  onChange={(e) =>
                    setMoveTaskModal({
                      ...moveTaskModal,
                      selectedFolderId: e.target.value,
                    })
                  }
                >
                  <option value="">No Folder</option>
                  {folders.map((folder) => (
                    <option
                      key={folder._id}
                      value={folder._id}
                      disabled={folder._id === moveTaskModal.currentFolderId}
                    >
                      {folder.name}
                    </option>
                  ))}
                </select>
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setMoveTaskModal(null)}
                    className="btn btn-ghost"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() =>
                      moveTask(
                        moveTaskModal.taskId,
                        moveTaskModal.selectedFolderId
                      )
                    }
                    className="btn btn-primary"
                    disabled={
                      moveTaskModal.selectedFolderId ===
                      moveTaskModal.currentFolderId
                    }
                  >
                    Move
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Add Delete Task Confirmation Modal */}
        {taskToDelete && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-base-200 p-6 rounded-lg w-[95%] max-w-md">
              <h3 className="text-lg font-bold mb-4">Delete Task</h3>
              <p className="mb-6">
                Are you sure you want to delete "{taskToDelete.title}"? This
                action cannot be undone.
              </p>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setTaskToDelete(null)}
                  className="btn btn-ghost"
                >
                  Cancel
                </button>
                <button
                  onClick={() => deleteTask(taskToDelete._id)}
                  className="btn btn-error"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
