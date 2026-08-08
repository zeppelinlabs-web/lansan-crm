'use client';

import React from 'react';
import { useCRM } from '@/components/providers/CRMProvider';
import { Button } from '@/components/ui/Button';
import { IconCheck, IconRotateClockwise, IconTrash, IconPlus } from '@tabler/icons-react';

export default function TasksPage() {
  const { tasks, toggleTask, updateTaskPriority, updateTaskStatus, deleteTask, searchQuery, openModal } = useCRM();

  const filteredTasks = tasks.filter((t) =>
    t.text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <div className="table-wrap">
        <div className="table-head">
          <div className="table-head-title">All tasks ({filteredTasks.length})</div>
          <Button variant="primary" icon={<IconPlus size={16} />} onClick={() => openModal('addTask')}>
            Add task
          </Button>
        </div>
        <table>
          <thead>
            <tr>
              <th>Task</th>
              <th>Due Date</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredTasks.map((t) => {
              const priorityBg =
                t.priority === 'High'
                  ? '#fee2e2'
                  : t.priority === 'Medium'
                  ? '#fef3c7'
                  : '#dbeafe';
              const priorityColor =
                t.priority === 'High'
                  ? '#991b1b'
                  : t.priority === 'Medium'
                  ? '#92400e'
                  : '#1e40af';

              const statusBg = t.done ? '#f3f4f6' : '#e8f8f2';
              const statusColor = t.done ? '#6b7280' : '#0F6E56';

              return (
                <tr key={t.id}>
                  <td
                    style={{
                      textDecoration: t.done ? 'line-through' : 'none',
                      color: t.done ? '#aaa' : '#111',
                      fontWeight: t.done ? 400 : 600,
                    }}
                  >
                    {t.text}
                  </td>
                  <td style={{ color: '#666' }}>{t.due}</td>
                  <td>
                    <select
                      value={t.priority}
                      onChange={(e) => updateTaskPriority(t.id, e.target.value as any)}
                      style={{
                        padding: '4px 10px',
                        borderRadius: '20px',
                        fontSize: '11px',
                        fontWeight: 700,
                        border: '1px solid rgba(0,0,0,0.08)',
                        background: priorityBg,
                        color: priorityColor,
                        cursor: 'pointer',
                        outline: 'none',
                      }}
                    >
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                  </td>
                  <td>
                    <select
                      value={t.done ? 'Closed' : 'In progress'}
                      onChange={(e) => updateTaskStatus(t.id, e.target.value === 'Closed')}
                      style={{
                        padding: '4px 10px',
                        borderRadius: '20px',
                        fontSize: '11px',
                        fontWeight: 700,
                        border: '1px solid rgba(0,0,0,0.08)',
                        background: statusBg,
                        color: statusColor,
                        cursor: 'pointer',
                        outline: 'none',
                      }}
                    >
                      <option value="In progress">In progress</option>
                      <option value="Closed">Closed</option>
                    </select>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                      <Button
                        variant="sm"
                        icon={t.done ? <IconRotateClockwise size={14} /> : <IconCheck size={14} />}
                        onClick={() => toggleTask(t.id)}
                        title={t.done ? 'Reopen task' : 'Complete task'}
                      >
                        {t.done ? 'Reopen' : 'Done'}
                      </Button>
                      <Button
                        variant="danger"
                        icon={<IconTrash size={14} />}
                        onClick={() => deleteTask(t.id)}
                        title="Delete task"
                      />
                    </div>
                  </td>
                </tr>
              );
            })}
            {filteredTasks.length === 0 && (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', color: '#aaa', padding: '20px' }}>
                  No tasks found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
