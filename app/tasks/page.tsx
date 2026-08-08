'use client';

import React from 'react';
import { useCRM } from '@/components/providers/CRMProvider';
import { Pill } from '@/components/ui/Pill';
import { Button } from '@/components/ui/Button';
import { IconCheck, IconRotateClockwise } from '@tabler/icons-react';

export default function TasksPage() {
  const { tasks, toggleTask, searchQuery } = useCRM();

  const filteredTasks = tasks.filter((t) =>
    t.text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <div className="table-wrap">
        <div className="table-head">
          <div className="table-head-title">All tasks ({filteredTasks.length})</div>
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
            {filteredTasks.map((t) => (
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
                  <Pill status={t.priority} />
                </td>
                <td>
                  <Pill status={t.done ? 'Closed' : 'In progress'} />
                </td>
                <td>
                  <Button
                    variant="sm"
                    icon={t.done ? <IconRotateClockwise size={14} /> : <IconCheck size={14} />}
                    onClick={() => toggleTask(t.id)}
                    title={t.done ? 'Reopen task' : 'Complete task'}
                  >
                    {t.done ? 'Reopen' : 'Done'}
                  </Button>
                </td>
              </tr>
            ))}
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
