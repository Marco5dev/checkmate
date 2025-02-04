"use client";

import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFolderOpen,
  faChevronUp,
  faChevronDown,
} from "@fortawesome/free-solid-svg-icons";
import LoadingTaskCard from "@/components/LoadingTaskCard";

export default function HomeClient({ session, greeting }) {
  const [tasks, setTasks] = useState([]);
  const [folders, setFolders] = useState([]);
  const [expandedSections, setExpandedSections] = useState({
    todo: true, // Open by default
    completed: false, // Closed by default
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
    fetchFolders();
  }, []);

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
    try {
      const response = await fetch("/api/folders");
      const data = await response.json();
      setFolders(data);
    } catch (error) {
      toast.error("Failed to fetch folders");
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
        toast.success(
          updatedTask.done ? "Task completed!" : "Task uncompleted"
        );
      } else {
        const data = await response.json();
        toast.error(data.error || "Failed to update task");
      }
    } catch (error) {
      toast.error("Failed to toggle task status");
    }
  };

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const renderTasksList = (tasks) => {
    const uncompletedTasks = tasks.filter((task) => !task.done);
    const completedTasks = tasks.filter((task) => task.done);

    return (
      <>
        {/* Uncompleted Tasks */}
        <div className="mb-4">
          <button
            onClick={() => toggleSection("todo")}
            className="w-full flex items-center justify-between p-2 bg-base-200 rounded-lg mb-2"
          >
            <h3 className="text-lg font-bold">Tasks To Do</h3>
            <FontAwesomeIcon
              icon={expandedSections.todo ? faChevronUp : faChevronDown}
              className="w-4 h-4"
            />
          </button>
          {expandedSections.todo && (
            <div className="space-y-2">
              {uncompletedTasks.length === 0 ? (
                <p className="text-center text-gray-500">No tasks to do</p>
              ) : (
                uncompletedTasks.map((task) => (
                  <div
                    key={task._id}
                    className="flex items-center gap-2 p-2 bg-base-200 rounded-lg"
                  >
                    <input
                      type="checkbox"
                      checked={task.done}
                      onChange={() => toggleTask(task._id)}
                      className="checkbox checkbox-primary"
                    />
                    <div className="flex-1">
                      <span className="font-medium">{task.title}</span>
                      {task.folderId && (
                        <span className="flex items-center gap-1 text-sm text-gray-500">
                          <FontAwesomeIcon
                            icon={faFolderOpen}
                            className="w-3 h-3"
                          />
                          {folders.find((f) => f._id === task.folderId)?.name}
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Completed Tasks */}
        <div className="pt-4 border-t border-base-200">
          <button
            onClick={() => toggleSection("completed")}
            className="w-full flex items-center justify-between p-2 bg-base-200 rounded-lg mb-2"
          >
            <h3 className="text-lg font-bold">Completed Tasks</h3>
            <FontAwesomeIcon
              icon={expandedSections.completed ? faChevronUp : faChevronDown}
              className="w-4 h-4"
            />
          </button>
          {expandedSections.completed && completedTasks.length > 0 && (
            <div className="space-y-2 opacity-60">
              {completedTasks.map((task) => (
                <div
                  key={task._id}
                  className="flex items-center gap-2 p-2 bg-base-200 rounded-lg"
                >
                  <input
                    type="checkbox"
                    checked={task.done}
                    onChange={() => toggleTask(task._id)}
                    className="checkbox checkbox-primary"
                  />
                  <div className="flex-1">
                    <span className="font-medium line-through">
                      {task.title}
                    </span>
                    {task.folderId && (
                      <span className="flex items-center gap-1 text-sm text-gray-500">
                        <FontAwesomeIcon
                          icon={faFolderOpen}
                          className="w-3 h-3"
                        />
                        {folders.find((f) => f._id === task.folderId)?.name}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </>
    );
  };

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.get("verified") === "true") {
      toast.success("Email verified successfully! Welcome to CheackMate!");
      // Clean up the URL
      window.history.replaceState({}, "", "/");
    }
  }, []);

  return (
    <main className="login-bg bg-cover bg-no-repeat bg-center flex flex-col content-center text-center items-center pt-24 min-h-screen font-[family-name:var(--font-geist-sans)] bg-bg-img">
      <div className="flex items-start gap-4 p-10 bg-base-300 rounded-xl w-[95%] lg:w-[95%] justify-center">
        <div className="flex justify-start h-full">
          <h1 className="text-2xl flex flex-col justify-center items-center font-merriweather">
            {greeting},{" "}
            <span className="text-5xl text-primary font-edu font-bold">
              {session.user.name}!
            </span>
          </h1>
        </div>
      </div>

      <div className="flex lg:flex-row flex-col items-start gap-5 lg:gap-10 py-5 w-[95%] h-5/6">
        <div className="flex items-start gap-4 p-10 bg-base-300 rounded-xl w-full lg:w-1/2 justify-center">
          <div className="flex justify-start h-full flex-col items-center w-full">
            <div className="flex flex-col justify-center items-center p-3">
              <h2 className="text-3xl text-primary font-edu font-bold">
                Today's Tasks
              </h2>
            </div>
            <div className="w-full">
              {isLoading ? (
                <div className="space-y-4">
                  {[...Array(2)].map((_, i) => (
                    <LoadingTaskCard key={i} />
                  ))}
                </div>
              ) : (
                renderTasksList(
                  tasks.filter((task) => {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    const taskDate = new Date(task.dueDate);
                    taskDate.setHours(0, 0, 0, 0);
                    return taskDate.getTime() === today.getTime();
                  })
                )
              )}
            </div>
          </div>
        </div>
        <div className="flex items-start gap-4 p-10 bg-base-300 rounded-xl w-full lg:w-1/2 justify-center">
          <div className="flex justify-start h-full flex-col items-center w-full">
            <div className="flex flex-col justify-center items-center p-3">
              <h2 className="text-3xl text-primary font-edu font-bold">
                Pined Notes
              </h2>
            </div>
            <div className="w-full space-y-4">
              {tasks.length === 0 ? (
                <p className="text-center text-gray-500">No Pined Notes!</p>
              ) : (
                tasks.map((task) => (
                  <div
                    key={task._id}
                    className="flex items-center gap-2 p-2 bg-base-100 rounded-lg"
                  >
                    <input
                      type="checkbox"
                      checked={task.done}
                      className="checkbox checkbox-primary"
                      disabled
                    />
                    <span
                      className={task.done ? "line-through text-gray-500" : ""}
                    >
                      {task.title}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
