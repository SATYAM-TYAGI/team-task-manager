import { useEffect, useMemo, useState } from "react";
import { apiCall } from "../api";

export default function DashboardPage() {
  const [taskList, setTaskList] = useState([]);
  const [msg, setMsg] = useState("");
  const token = localStorage.getItem("token");
  const userData = JSON.parse(localStorage.getItem("user") || "null");

  const loadTasks = async () => {
    try {
      const data = await apiCall("/tasks", "GET", null, token);
      setTaskList(data);
    } catch (err) {
      setMsg(err.message);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const stats = useMemo(() => {
    const now = new Date();
    const total = taskList.length;
    const completed = taskList.filter((t) => t.status === "done").length;
    const pending = taskList.filter((t) => t.status !== "done").length;
    const overdue = taskList.filter(
      (t) => t.status !== "done" && t.dueDate && new Date(t.dueDate) < now
    ).length;

    return { total, completed, pending, overdue };
  }, [taskList]);

  const changeStatus = async (taskId, status) => {
    try {
      // member update status from here
      await apiCall(`/tasks/${taskId}/status`, "PUT", { status }, token);
      loadTasks();
    } catch (err) {
      setMsg(err.message);
    }
  };

  return (
    <div>
      <h3>Dashboard</h3>
      <div className="stats">
        <div className="box">Total: {stats.total}</div>
        <div className="box">Completed: {stats.completed}</div>
        <div className="box">Pending: {stats.pending}</div>
        <div className="box">Overdue: {stats.overdue}</div>
      </div>

      {msg ? <p className="err">{msg}</p> : null}

      <div className="card">
        <h4>Task List</h4>
        {taskList.map((task) => (
          <div key={task._id} className="task-item">
            <div>
              <b>{task.title}</b> - {task.description}
              <div>
                assigned: {task.assignedTo?.name} | project: {task.projectId?.name} | due:{" "}
                {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "none"}
              </div>
            </div>
            <div>
              <select
                value={task.status}
                onChange={(e) => changeStatus(task._id, e.target.value)}
                disabled={userData?.role === "admin" ? false : false}
              >
                <option value="todo">todo</option>
                <option value="in progress">in progress</option>
                <option value="done">done</option>
              </select>
            </div>
          </div>
        ))}
        {taskList.length === 0 ? <p>no task yet</p> : null}
      </div>
    </div>
  );
}
