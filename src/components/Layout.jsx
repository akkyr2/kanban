import React, { useState, useEffect } from 'react';
import Header from './Header';
import './Layout.css';

const KanbanCard = ({ title, project, assignee, date, statusClass }) => (
  <div className={`kanban-card ${statusClass}`}>
    <h4>{title}</h4>
    <p className="muted">{project}</p>
    <div className="kanban-footer">
      <span className="assignee">{assignee}</span>
      <span className="date">{date}</span>
    </div>
  </div>
);

const KanbanBoard = () => {
  const [tasks, setTasks] = useState({ todo: [], inProgress: [], review: [], done: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/tasks")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then((data) => {
        const grouped = { todo: [], inProgress: [], review: [], done: [] };

        data.forEach((task) => {
          const card = {
            title:    task.task_name,
            project:  task.project_name,
            assignee: task.assignee,
            date:     task.due_date,
          };

          if (task.status === "To Do")          grouped.todo.push(card);
          else if (task.status === "In Progress") grouped.inProgress.push(card);
          else if (task.status === "Review")      grouped.review.push(card);
          else if (task.status === "Done")        grouped.done.push(card);
        });

        setTasks(grouped);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div style={{ padding: "2rem" }}>Loading tasks...</div>;
  if (error)   return <div style={{ padding: "2rem", color: "red" }}>Error: {error}</div>;

  return (
    <div className="kanban-board">
      <div className="kanban-column">
        <div className="kanban-header">TO DO ({tasks.todo.length})</div>
        {tasks.todo.map((task, i) => (
          <KanbanCard key={i} {...task} statusClass="status-pending" />
        ))}
      </div>

      <div className="kanban-column">
        <div className="kanban-header">IN PROGRESS ({tasks.inProgress.length})</div>
        {tasks.inProgress.map((task, i) => (
          <KanbanCard key={i} {...task} statusClass="status-progress" />
        ))}
      </div>

      <div className="kanban-column">
        <div className="kanban-header">REVIEW ({tasks.review.length})</div>
        {tasks.review.map((task, i) => (
          <KanbanCard key={i} {...task} statusClass="status-review" />
        ))}
      </div>

      <div className="kanban-column">
        <div className="kanban-header">DONE ({tasks.done.length})</div>
        {tasks.done.map((task, i) => (
          <KanbanCard key={i} {...task} statusClass="status-done" />
        ))}
      </div>
    </div>
  );
};

export default function KanbanPage() {
  return (
    <div className="container">
      <div className="main">
        <Header />
        <div className="content">
          <div className="card table no-hover" style={{ width: '100%' }}>
            <KanbanBoard />
          </div>
        </div>
      </div>
    </div>
  );
}