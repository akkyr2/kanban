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

const KanbanBoard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBoardData = async () => {
      try {
        const response = await axios.get('/mock-data.json');
        const { projects = [], users = [], tasks = [] } = response.data;

        const mappedTasks = tasks.map((task) => ({
          ...task,
          project: projects.find((project) => project.id === task.projectId)?.name || 'Unknown project',
          assignee: users.find((user) => user.id === task.assigneeId)?.name || 'Unassigned',
          status: task.status || 'Todo',
        }));

        setTasks(mappedTasks);
      } catch (fetchError) {
        setError('Unable to load Kanban data.');
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
