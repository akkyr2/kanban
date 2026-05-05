<<<<<<< HEAD
import React, { useEffect, useState } from 'react';
import axios from 'axios';
=======
import React, { useState, useEffect } from 'react';
>>>>>>> 4f6e538 (first commit of local)
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

const statusColumns = [
  { key: 'Todo', label: 'TO DO', className: 'status-pending' },
  { key: 'In Progress', label: 'IN PROGRESS', className: 'status-progress' },
  { key: 'Done', label: 'DONE', className: 'status-done' },
];

const DEFAULT_ENDPOINTS = {
  projects: 'https://jsonplaceholder.typicode.com/albums?_limit=5',
  users: 'https://jsonplaceholder.typicode.com/users',
  tasks: 'https://jsonplaceholder.typicode.com/todos?_limit=8',
};

const buildResourceUrl = (resource) => {
  const explicitUrl = import.meta.env[`VITE_${resource.toUpperCase()}_API`];
  if (explicitUrl) return explicitUrl;

  const baseUrl = import.meta.env.VITE_API_BASE_URL?.replace(/\/+$/g, '');
  if (baseUrl) return `${baseUrl}/${resource}`;

  return DEFAULT_ENDPOINTS[resource];
};

const normalizeList = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (payload?.projects && Array.isArray(payload.projects)) return payload.projects;
  if (payload?.users && Array.isArray(payload.users)) return payload.users;
  if (payload?.tasks && Array.isArray(payload.tasks)) return payload.tasks;
  if (payload?.data && Array.isArray(payload.data)) return payload.data;
  if (payload?.items && Array.isArray(payload.items)) return payload.items;
  return [];
};

const buildDate = (id) => {
  const day = 5 + ((id || 0) % 20);
  return `${day} Apr`;
};

const mapTaskData = (tasks, projects, users) => {
  if (!tasks.length) return [];

  return tasks.map((task) => {
    const assigneeId = task.assigneeId ?? task.userId;
    const projectIndex = typeof assigneeId === 'number' ? (assigneeId - 1) % projects.length : 0;
    const project = projects[projectIndex] || {};
    const user = users.find((userItem) => userItem.id === assigneeId) || {};

    return {
      ...task,
      title: task.title || task.name || 'Untitled task',
      assigneeId,
      projectId: task.projectId ?? project.id ?? projectIndex + 1,
      project: project.title || project.name || 'Unknown project',
      assignee: user.name || 'Unassigned',
      status:
        task.status ||
        (typeof task.completed === 'boolean'
          ? task.completed
            ? 'Done'
            : task.id % 2 === 0
            ? 'In Progress'
            : 'Todo'
          : 'Todo'),
      date: task.date || task.dueDate || buildDate(task.id),
    };
  });
};

const KanbanBoard = () => {
<<<<<<< HEAD
  const [tasks, setTasks] = useState([]);
=======
  const [tasks, setTasks] = useState({ todo: [], inProgress: [], review: [], done: [] });
>>>>>>> 4f6e538 (first commit of local)
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
<<<<<<< HEAD
    const fetchBoardData = async () => {
      try {
        const [projectsRes, usersRes, tasksRes] = await Promise.all([
          axios.get(buildResourceUrl('projects')),
          axios.get(buildResourceUrl('users')),
          axios.get(buildResourceUrl('tasks')),
        ]);

        const projects = normalizeList(projectsRes.data);
        const users = normalizeList(usersRes.data);
        const tasks = normalizeList(tasksRes.data);

        setTasks(mapTaskData(tasks, projects, users));
      } catch (fetchError) {
        setError('Unable to load Kanban data from API.');
        console.error(fetchError);
      } finally {
        setLoading(false);
      }
    };

    fetchBoardData();
  }, []);

  const tasksByStatus = statusColumns.reduce((acc, column) => {
    acc[column.key] = [];
    return acc;
  }, {});

  tasks.forEach((task) => {
    const status = statusColumns.some((column) => column.key === task.status) ? task.status : 'Todo';
    tasksByStatus[status].push(task);
  });

  if (loading) {
    return <div className="kanban-board">Loading board...</div>;
  }

  if (error) {
    return <div className="kanban-board">{error}</div>;
  }

  return (
    <div className="kanban-board">
      {statusColumns.map((column) => (
        <div className="kanban-column" key={column.key}>
          <div className="kanban-header">
            {column.label}({tasksByStatus[column.key].length})
          </div>
          {tasksByStatus[column.key].map((task) => (
            <KanbanCard
              key={task.id}
              title={task.title}
              project={task.project}
              assignee={task.assignee}
              date={task.date}
              statusClass={column.className}
            />
          ))}
        </div>
      ))}
=======
    fetch("http://127.0.0.1:8000/api/tasks")
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
>>>>>>> 4f6e538 (first commit of local)
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
