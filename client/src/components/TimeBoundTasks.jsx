import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  Play, 
  Pause, 
  Calendar,
  User,
  Flag,
  Zap,
  Target,
  Timer
} from 'lucide-react';

const TimeBoundTasks = ({ contributor, onTaskUpdate }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, [contributor]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      // Mock data - replace with actual API call
      setTimeout(() => {
        const mockTasks = [
          {
            id: 1,
            title: 'Fix authentication bug in login system',
            description: 'The login system is not properly validating JWT tokens, causing authentication failures.',
            deadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days from now
            priority: 'high',
            status: 'assigned',
            points: 50,
            createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
            assignee: {
              username: 'johndoe',
              name: 'John Doe',
              avatar: 'https://via.placeholder.com/32'
            },
            issueUrl: 'https://github.com/org/repo/issues/123',
            timeRemaining: 2 * 24 * 60 * 60 * 1000 // 2 days in milliseconds
          },
          {
            id: 2,
            title: 'Update API documentation',
            description: 'Document the new REST API endpoints and update the OpenAPI specification.',
            deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days from now
            priority: 'medium',
            status: 'in_progress',
            points: 30,
            createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            assignee: {
              username: 'janedoe',
              name: 'Jane Doe',
              avatar: 'https://via.placeholder.com/32'
            },
            issueUrl: 'https://github.com/org/repo/issues/124',
            timeRemaining: 5 * 24 * 60 * 60 * 1000
          },
          {
            id: 3,
            title: 'Implement dark mode toggle',
            description: 'Add a dark mode toggle to the user interface with proper theme switching.',
            deadline: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day overdue
            priority: 'low',
            status: 'overdue',
            points: 40,
            createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            assignee: {
              username: 'alice',
              name: 'Alice Smith',
              avatar: 'https://via.placeholder.com/32'
            },
            issueUrl: 'https://github.com/org/repo/issues/125',
            timeRemaining: -24 * 60 * 60 * 1000 // Overdue
          },
          {
            id: 4,
            title: 'Optimize database queries',
            description: 'Review and optimize slow database queries to improve application performance.',
            deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
            priority: 'medium',
            status: 'completed',
            points: 60,
            createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
            completedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            assignee: {
              username: 'bob',
              name: 'Bob Johnson',
              avatar: 'https://via.placeholder.com/32'
            },
            issueUrl: 'https://github.com/org/repo/issues/126',
            timeRemaining: 0
          }
        ];
        setTasks(mockTasks);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setLoading(false);
    }
  };

  const getPriorityColor = (priority) => {
    const colors = {
      low: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-orange-100 text-orange-800',
      urgent: 'bg-red-100 text-red-800'
    };
    return colors[priority] || 'bg-gray-100 text-gray-800';
  };

  const getStatusColor = (status) => {
    const colors = {
      assigned: 'bg-blue-100 text-blue-800',
      in_progress: 'bg-yellow-100 text-yellow-800',
      completed: 'bg-green-100 text-green-800',
      overdue: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const formatTimeRemaining = (timeRemaining) => {
    if (timeRemaining < 0) {
      const overdue = Math.abs(timeRemaining);
      const days = Math.floor(overdue / (24 * 60 * 60 * 1000));
      const hours = Math.floor((overdue % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
      return `Overdue by ${days}d ${hours}h`;
    }
    
    const days = Math.floor(timeRemaining / (24 * 60 * 60 * 1000));
    const hours = Math.floor((timeRemaining % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
    
    if (days > 0) {
      return `${days}d ${hours}h remaining`;
    } else if (hours > 0) {
      return `${hours}h remaining`;
    } else {
      return 'Due soon';
    }
  };

  const getUrgencyLevel = (timeRemaining) => {
    if (timeRemaining < 0) return 'overdue';
    if (timeRemaining < 24 * 60 * 60 * 1000) return 'urgent'; // Less than 1 day
    if (timeRemaining < 3 * 24 * 60 * 60 * 1000) return 'warning'; // Less than 3 days
    return 'normal';
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    if (filter === 'active') return task.status === 'assigned' || task.status === 'in_progress';
    if (filter === 'overdue') return task.status === 'overdue';
    if (filter === 'completed') return task.status === 'completed';
    return true;
  });

  const handleStatusUpdate = (taskId, newStatus) => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === taskId 
          ? { 
              ...task, 
              status: newStatus,
              completedAt: newStatus === 'completed' ? new Date().toISOString() : null
            }
          : task
      )
    );
    
    if (onTaskUpdate) {
      onTaskUpdate(taskId, newStatus);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Time-Bound Tasks</h1>
          <p className="text-gray-600">
            Track and manage time-sensitive tasks to prevent cookie licking
          </p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Target className="w-4 h-4 mr-2" />
          Create Task
        </button>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mx-auto mb-3">
            <Clock className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900">
            {tasks.filter(t => t.status === 'assigned' || t.status === 'in_progress').length}
          </h3>
          <p className="text-gray-600">Active Tasks</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mx-auto mb-3">
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900">
            {tasks.filter(t => t.status === 'overdue').length}
          </h3>
          <p className="text-gray-600">Overdue</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mx-auto mb-3">
            <CheckCircle className="w-6 h-6 text-green-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900">
            {tasks.filter(t => t.status === 'completed').length}
          </h3>
          <p className="text-gray-600">Completed</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-full mx-auto mb-3">
            <Zap className="w-6 h-6 text-yellow-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900">
            {tasks.reduce((sum, task) => sum + task.points, 0)}
          </h3>
          <p className="text-gray-600">Total Points</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-1 mb-6 bg-gray-100 rounded-lg p-1">
        {[
          { id: 'all', label: 'All Tasks', count: tasks.length },
          { id: 'active', label: 'Active', count: tasks.filter(t => t.status === 'assigned' || t.status === 'in_progress').length },
          { id: 'overdue', label: 'Overdue', count: tasks.filter(t => t.status === 'overdue').length },
          { id: 'completed', label: 'Completed', count: tasks.filter(t => t.status === 'completed').length }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            className={`flex items-center px-4 py-2 rounded-md transition-colors ${
              filter === tab.id
                ? 'bg-white shadow-sm text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.label}
            <span className="ml-2 bg-gray-200 text-gray-600 px-2 py-1 rounded-full text-xs">
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Tasks List */}
      <div className="space-y-4">
        {filteredTasks.map(task => {
          const urgency = getUrgencyLevel(task.timeRemaining);
          const isOverdue = task.timeRemaining < 0;
          
          return (
            <div
              key={task.id}
              className={`bg-white rounded-lg shadow-md p-6 border-l-4 ${
                isOverdue ? 'border-red-500' :
                urgency === 'urgent' ? 'border-orange-500' :
                urgency === 'warning' ? 'border-yellow-500' :
                'border-blue-500'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 mr-3">{task.title}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ml-2 ${getStatusColor(task.status)}`}>
                      {task.status.replace('_', ' ')}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 mb-3">{task.description}</p>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-1" />
                      {task.assignee.username}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      Due: {new Date(task.deadline).toLocaleDateString()}
                    </div>
                    <div className="flex items-center">
                      <Flag className="w-4 h-4 mr-1" />
                      {task.points} points
                    </div>
                    {task.issueUrl && (
                      <a
                        href={task.issueUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-blue-600 hover:text-blue-800"
                      >
                        <Target className="w-4 h-4 mr-1" />
                        View Issue
                      </a>
                    )}
                  </div>
                </div>
                
                <div className="flex flex-col items-end space-y-2">
                  <div className={`text-sm font-semibold ${
                    isOverdue ? 'text-red-600' :
                    urgency === 'urgent' ? 'text-orange-600' :
                    urgency === 'warning' ? 'text-yellow-600' :
                    'text-green-600'
                  }`}>
                    {formatTimeRemaining(task.timeRemaining)}
                  </div>
                  
                  {task.status !== 'completed' && (
                    <div className="flex space-x-2">
                      {task.status === 'assigned' && (
                        <button
                          onClick={() => handleStatusUpdate(task.id, 'in_progress')}
                          className="flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
                        >
                          <Play className="w-3 h-3 mr-1" />
                          Start
                        </button>
                      )}
                      {task.status === 'in_progress' && (
                        <button
                          onClick={() => handleStatusUpdate(task.id, 'completed')}
                          className="flex items-center px-3 py-1 bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors"
                        >
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Complete
                        </button>
                      )}
                      {task.status === 'overdue' && (
                        <button
                          onClick={() => handleStatusUpdate(task.id, 'in_progress')}
                          className="flex items-center px-3 py-1 bg-yellow-100 text-yellow-700 rounded-md hover:bg-yellow-200 transition-colors"
                        >
                          <Play className="w-3 h-3 mr-1" />
                          Resume
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
              
              {/* Progress Bar for Active Tasks */}
              {task.status === 'in_progress' && (
                <div className="mt-4">
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span>Progress</span>
                    <span>In Progress</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredTasks.length === 0 && (
        <div className="text-center py-12">
          <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No tasks found</h3>
          <p className="text-gray-500">
            {filter === 'all' 
              ? 'No tasks have been assigned yet.'
              : `No ${filter} tasks found.`
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default TimeBoundTasks;

