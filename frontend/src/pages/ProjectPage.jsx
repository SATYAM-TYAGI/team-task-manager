import { useEffect, useState } from "react";
import { apiCall } from "../api";

export default function ProjectPage() {
  const token = localStorage.getItem("token");
  const userData = JSON.parse(localStorage.getItem("user") || "null");
  const [projList, setProjList] = useState([]);
  const [userList, setUserList] = useState([]);
  const [msg, setMsg] = useState("");

  const [projName, setProjName] = useState("");
  const [projMembers, setProjMembers] = useState([]);

  const [taskTitle, setTaskTitle] = useState("");
  const [taskDesc, setTaskDesc] = useState("");
  const [taskAssigned, setTaskAssigned] = useState("");
  const [taskProject, setTaskProject] = useState("");
  const [taskStatus, setTaskStatus] = useState("todo");
  const [taskDue, setTaskDue] = useState("");

  const loadData = async () => {
    try {
      const projects = await apiCall("/projects", "GET", null, token);
      setProjList(projects);

      if (userData?.role === "admin") {
        const users = await apiCall("/auth/users", "GET", null, token);
        setUserList(users);
      }
    } catch (err) {
      setMsg(err.message);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const makeProject = async (e) => {
    e.preventDefault();
    try {
      await apiCall("/projects", "POST", { name: projName, members: projMembers }, token);
      setProjName("");
      setProjMembers([]);
      loadData();
      setMsg("project created");
    } catch (err) {
      setMsg(err.message);
    }
  };

  const makeTask = async (e) => {
    e.preventDefault();
    try {
      await apiCall(
        "/tasks",
        "POST",
        {
          title: taskTitle,
          description: taskDesc,
          assignedTo: taskAssigned,
          projectId: taskProject,
          status: taskStatus,
          dueDate: taskDue || null,
        },
        token
      );
      setTaskTitle("");
      setTaskDesc("");
      setTaskAssigned("");
      setTaskProject("");
      setTaskStatus("todo");
      setTaskDue("");
      setMsg("task created");
    } catch (err) {
      setMsg(err.message);
    }
  };

  const onMemberPick = (id) => {
    // very simple toggle for selected users
    if (projMembers.includes(id)) {
      setProjMembers(projMembers.filter((m) => m !== id));
    } else {
      setProjMembers([...projMembers, id]);
    }
  };

  return (
    <div>
      <h3>Projects</h3>
      {msg ? <p>{msg}</p> : null}

      {userData?.role === "admin" ? (
        <>
          <div className="card">
            <h4>Create Project</h4>
            <form onSubmit={makeProject}>
              <input
                value={projName}
                onChange={(e) => setProjName(e.target.value)}
                placeholder="project name"
              />
              <p>pick members:</p>
              <div className="list-grid">
                {userList.map((u) => (
                  <label key={u._id}>
                    <input
                      type="checkbox"
                      checked={projMembers.includes(u._id)}
                      onChange={() => onMemberPick(u._id)}
                    />
                    {u.name} ({u.role})
                  </label>
                ))}
              </div>
              <button type="submit">Create Project</button>
            </form>
          </div>

          <div className="card">
            <h4>Create Task</h4>
            <form onSubmit={makeTask}>
              <input
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                placeholder="task title"
              />
              <input
                value={taskDesc}
                onChange={(e) => setTaskDesc(e.target.value)}
                placeholder="description"
              />
              <select value={taskAssigned} onChange={(e) => setTaskAssigned(e.target.value)}>
                <option value="">assign user</option>
                {userList.map((u) => (
                  <option key={u._id} value={u._id}>
                    {u.name}
                  </option>
                ))}
              </select>
              <select value={taskProject} onChange={(e) => setTaskProject(e.target.value)}>
                <option value="">project</option>
                {projList.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.name}
                  </option>
                ))}
              </select>
              <select value={taskStatus} onChange={(e) => setTaskStatus(e.target.value)}>
                <option value="todo">todo</option>
                <option value="in progress">in progress</option>
                <option value="done">done</option>
              </select>
              <input type="date" value={taskDue} onChange={(e) => setTaskDue(e.target.value)} />
              <button type="submit">Create Task</button>
            </form>
          </div>
        </>
      ) : (
        <p>member can see projects only</p>
      )}

      <div className="card">
        <h4>Project List</h4>
        {projList.map((proj) => (
          <div key={proj._id} className="task-item">
            <div>
              <b>{proj.name}</b>
              <div>
                members:{" "}
                {(proj.members || [])
                  .map((m) => m.name)
                  .filter(Boolean)
                  .join(", ")}
              </div>
            </div>
          </div>
        ))}
        {projList.length === 0 ? <p>no projects yet</p> : null}
      </div>
    </div>
  );
}
