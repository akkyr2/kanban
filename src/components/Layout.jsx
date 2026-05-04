import React, { useEffect, useState } from 'react';
import axios from 'axios';
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
  tasks: 'https://jsonplaceholder.typicode.com/todos?_limit=12',
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
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
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
