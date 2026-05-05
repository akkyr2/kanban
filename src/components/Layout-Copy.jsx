import React from 'react';
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
  const tasks = {
    todo: [
      { title: "API Integration", project: "proj‑1", assignee: "Vivek", date: "15 Apr" },
      { title: "Data Pipeline", project: "proj‑2", assignee: "Ujjawal", date: "15 Apr" },
      { title: "Data Pipeline", project: "proj‑2", assignee: "Rahul", date: "15 Apr" },
      { title: "Data Pipeline", project: "proj‑2", assignee: "Ujjawal", date: "15 Apr" },
    ],
    inProgress: [
      { title: "Dashboard UI", project: "proj‑2", assignee: "Aman", date: "10 Apr" },
      { title: "Authentication api", project: "proj‑2", assignee: "Ujjawal", date: "30 Apr" },
    ],
    done: [
      { title: "Login Module", project: "proj‑1", assignee: "Rahul", date: "05 Apr" },
    ]
  };

  return (
    <div className="kanban-board">
      <div className="kanban-column">
        <div className="kanban-header">TO DO({tasks.todo.length})</div>
        {tasks.todo.map((task, i) => <KanbanCard key={i} {...task} statusClass="status-pending" />)}
      </div>

      <div className="kanban-column">
        <div className="kanban-header">IN PROGRESS({tasks.inProgress.length})</div>
        {tasks.inProgress.map((task, i) => <KanbanCard key={i} {...task} statusClass="status-progress" />)}
      </div>

      <div className="kanban-column">
        <div className="kanban-header">DONE({tasks.done.length})</div>
        {tasks.done.map((task, i) => <KanbanCard key={i} {...task} statusClass="status-done" />)}
      </div>
    </div>
  );
};

export default function KanbanPage() {
  return (
    <div className="container">
      {/* <Sidebar /> */}
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