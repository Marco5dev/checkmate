"use client";

import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFolderOpen,
  faChevronUp,
  faChevronDown,
  faThumbtack,
} from "@fortawesome/free-solid-svg-icons";
import LoadingTaskCard from "@/components/loadings/LoadingTaskCard";
import Editor from "@/components/Editor";

export default function HomeClient({ session, greeting }) {
  const [tasks, setTasks] = useState([]);
  const [folders, setFolders] = useState([]);
  const [pinnedNotes, setPinnedNotes] = useState([]);
  const [expandedSections, setExpandedSections] = useState({
    todo: true, // Open by default
    completed: false, // Closed by default
  });
  const [isLoading, setIsLoading] = useState(true);
  const [selectedNote, setSelectedNote] = useState(null);
  const [isPinnedNotesLoading, setIsPinnedNotesLoading] = useState(true);
  const [tags, setTags] = useState([]);
  const [noteFolders, setNoteFolders] = useState([]);
  const [dailyQuote, setDailyQuote] = useState(null);
  const [isQuoteLoading, setIsQuoteLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
    fetchFolders();
    fetchPinnedNotes();
    fetchNoteFolders();
    fetchTags();
    fetchDailyQuote();
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

  const fetchPinnedNotes = async () => {
    try {
      setIsPinnedNotesLoading(true);
      const response = await fetch("/api/notes");
      const data = await response.json();
      setPinnedNotes(data.filter((note) => note.isPinned));
    } catch (error) {
      toast.error("Failed to fetch pinned notes");
    } finally {
      setIsPinnedNotesLoading(false);
    }
  };

  const fetchNoteFolders = async () => {
    try {
      const response = await fetch("/api/notes-folders");
      const data = await response.json();
      setNoteFolders(data);
    } catch (error) {
      toast.error("Failed to fetch note folders");
    }
  };

  const fetchTags = async () => {
    try {
      const response = await fetch("/api/tags");
      const data = await response.json();
      setTags(data);
    } catch (error) {
      toast.error("Failed to fetch tags");
    }
  };

  const fetchDailyQuote = async () => {
    try {
      const response = await fetch("/api/quotes");
      const data = await response.json();
      setDailyQuote(data);
    } catch (error) {
      console.error("Failed to fetch daily quote:", error);
    } finally {
      setIsQuoteLoading(false);
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

  const updateNote = async (noteId, updates) => {
    try {
      const response = await fetch(`/api/notes/${noteId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error("Failed to update note");
      }

      const updatedNote = await response.json();

      // If pin status changed, refresh pinned notes
      if (updates.isPinned !== undefined) {
        await fetchPinnedNotes();
      } else {
        // Otherwise just update the current note in state
        setPinnedNotes(
          pinnedNotes.map((note) => (note._id === noteId ? updatedNote : note))
        );
      }

      return updatedNote;
    } catch (error) {
      toast.error("Failed to update note");
      throw error;
    }
  };

  const deleteNote = async (noteId) => {
    try {
      const response = await fetch(`/api/notes/${noteId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete note");
      }

      setPinnedNotes(pinnedNotes.filter((note) => note._id !== noteId));
      setSelectedNote(null);
      toast.success("Note deleted successfully");
    } catch (error) {
      toast.error("Failed to delete note");
    }
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
    <main className="login-bg bg-bg-img bg-cover bg-no-repeat bg-center flex flex-col content-center items-center pt-24 min-h-screen font-[family-name:var(--font-geist-sans)]">
      <div className="flex flex-col gap-5 lg:gap-10 py-5 w-full h-5/6 items-center">
        {/* Good morning section */}
        <section className="flex items-start gap-4 p-10 bg-base-300 rounded-xl w-[95%] lg:w-[95%] justify-center">
          <div className="flex justify-start h-full">
            <h1 className="text-2xl flex flex-col justify-center items-center font-merriweather">
              {greeting},{" "}
              <span className="text-5xl text-primary font-edu font-bold text-center">
                {session.user.name}!
              </span>
            </h1>
          </div>
        </section>

        {/* Updated Quote Section with styled quote marks */}
        <section className="flex items-start gap-4 p-10 bg-base-300 rounded-xl w-[95%] lg:w-[95%] justify-center">
          <div className="flex justify-start h-full flex-col items-center">
            <h2 className="text-2xl font-merriweather mb-4">
              Quote of the Day
            </h2>
            {isQuoteLoading ? (
              <div className="animate-pulse flex flex-col items-center gap-4">
                <div className="h-4 bg-base-200 rounded w-64"></div>
                <div className="h-4 bg-base-200 rounded w-32"></div>
              </div>
            ) : dailyQuote ? (
              <div className="flex flex-col items-center text-center relative">
                <div className="flex">
                  {/* Opening quote mark */}
                  <span className="text-primary text-4xl font-bold">❝</span>
                  <p className="text-lg font-edu italic mb-2">
                    {dailyQuote.quote}
                  </p>
                  {/* Closing quote mark */}
                  <span className="text-primary text-4xl font-bold">❞</span>
                </div>
                <p className="text-primary font-bold mt-4">
                  - {dailyQuote.author}
                </p>
              </div>
            ) : (
              <p className="text-gray-500">Failed to load daily quote</p>
            )}
          </div>
        </section>
      </div>

      <div className="flex lg:flex-row flex-col items-start gap-5 lg:gap-10 py-5 w-[95%] h-5/6">
        {/* Tasks Section */}
        <section className="flex items-start gap-4 p-10 bg-base-300 rounded-xl w-full lg:w-1/2 justify-center">
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
        </section>

        {/* Pined Notes Section */}
        <section className="flex items-start gap-4 p-10 bg-base-300 rounded-xl w-full lg:w-1/2 justify-center">
          <div className="flex justify-start h-full flex-col items-center w-full">
            <div className="flex flex-col justify-center items-center p-3">
              <h2 className="text-3xl text-primary font-edu font-bold">
                Pinned Notes
              </h2>
            </div>
            <div className="w-full space-y-4">
              {isPinnedNotesLoading ? (
                // Loading placeholders
                [...Array(3)].map((_, index) => (
                  <div
                    key={`loading-${index}`}
                    className="animate-pulse flex items-center gap-2 p-4 bg-base-100 rounded-lg"
                  >
                    <div className="w-4 h-4 bg-primary rounded-full"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-base-200 rounded w-3/4"></div>
                    </div>
                  </div>
                ))
              ) : pinnedNotes.length === 0 ? (
                <p className="text-center text-gray-500">No pinned notes</p>
              ) : (
                pinnedNotes.map((note) => (
                  <div
                    key={note._id}
                    className="flex items-center gap-2 p-4 bg-base-100 rounded-lg cursor-pointer hover:bg-base-200 transition-colors"
                    onClick={() => setSelectedNote(note)}
                  >
                    <FontAwesomeIcon
                      icon={faThumbtack}
                      className="text-primary"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium">
                        {note.title || "Untitled"}
                      </h3>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>
      </div>

      {/* Note Editor Modal */}
      {selectedNote && (
        <div className="modal modal-open">
          <div className="modal-box w-11/12 max-w-5xl h-[80vh]">
            <Editor
              note={selectedNote}
              onUpdate={(updates) => updateNote(selectedNote._id, updates)}
              onDelete={() => deleteNote(selectedNote._id)}
              folders={noteFolders}
              tags={tags}
              onClose={() => setSelectedNote(null)}
            />
          </div>
        </div>
      )}
    </main>
  );
}
