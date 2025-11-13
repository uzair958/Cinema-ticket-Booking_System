import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '../types';
import { userService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import SuccessMessage from '../components/SuccessMessage';
import '../styles/UserManagement.css';

const UserManagement: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [deleting, setDeleting] = useState<number | null>(null);
  const [updatingRole, setUpdatingRole] = useState<number | null>(null);
  const [selectedRole, setSelectedRole] = useState<{ [key: number]: string }>({});
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (user?.role !== 'ADMIN') {
      navigate('/');
      return;
    }
    fetchUsers();
  }, [user, navigate]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      console.log('👥 Fetching all users');
      const data = await userService.getAllUsers();
      console.log('✅ Users fetched:', data);
      setUsers(data);
      setError('');
    } catch (err) {
      let errorMessage = 'Failed to fetch users';

      if (err instanceof Error) {
        errorMessage = err.message;

        if (errorMessage.includes('401') || errorMessage.includes('Unauthorized')) {
          errorMessage = 'Your session has expired. Please login again.';
        } else if (errorMessage.includes('Network') || errorMessage.includes('ECONNREFUSED')) {
          errorMessage = 'Cannot connect to server. Please check if the backend is running.';
        } else if (errorMessage.includes('timeout')) {
          errorMessage = 'Request timeout. Please try again.';
        }
      }

      setError(errorMessage);
      console.error('Fetch users error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId: number) => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    try {
      setDeleting(userId);
      console.log('🗑️ Deleting user:', userId);
      await userService.deleteUser(userId);
      setSuccess('User deleted successfully!');
      setError('');

      setTimeout(() => {
        fetchUsers();
        setSuccess('');
      }, 2000);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to delete user';
      console.error('❌ Delete user error:', errorMsg);
      setError(errorMsg);
    } finally {
      setDeleting(null);
    }
  };

  const handleUpdateRole = async (userId: number) => {
    const newRole = selectedRole[userId];
    if (!newRole) {
      setError('Please select a role');
      return;
    }

    try {
      setUpdatingRole(userId);
      console.log('👥 Updating user role:', userId, newRole);
      await userService.updateUserRole(userId, newRole);
      setSuccess('User role updated successfully!');
      setError('');

      setTimeout(() => {
        fetchUsers();
        setSuccess('');
        setSelectedRole({});
      }, 2000);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to update user role';
      console.error('❌ Update role error:', errorMsg);
      setError(errorMsg);
    } finally {
      setUpdatingRole(null);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading users..." />;
  }

  // Filter users based on search query
  const filteredUsers = users.filter((u) => {
    const query = searchQuery.toLowerCase();
    return (
      u.email.toLowerCase().includes(query) ||
      (u.name && u.name.toLowerCase().includes(query)) ||
      (u.role && u.role.toLowerCase().includes(query))
    );
  });

  return (
    <div className="user-management-container">
      <h1>👥 User Management</h1>

      {error && (
        <ErrorMessage
          message={error}
          onClose={() => setError('')}
          type={error.includes('session') ? 'auth' : 'error'}
          dismissible={true}
        />
      )}
      {success && <SuccessMessage message={success} />}

      <div className="search-section">
        <input
          type="text"
          placeholder="🔍 Search by email, name, or role..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
        {searchQuery && (
          <button
            className="btn-clear-search"
            onClick={() => setSearchQuery('')}
          >
            ✕ Clear
          </button>
        )}
      </div>

      {filteredUsers.length === 0 ? (
        <p className="no-data">
          {users.length === 0 ? 'No users found' : 'No users match your search'}
        </p>
      ) : (
        <div className="users-table">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Email</th>
                <th>Name</th>
                <th>Current Role</th>
                <th>Change Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((u) => (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td>{u.email}</td>
                  <td>{u.name || 'N/A'}</td>
                  <td>
                    <span className={`role-badge ${u.role?.toLowerCase()}`}>
                      {u.role || 'N/A'}
                    </span>
                  </td>
                  <td>
                    <div className="role-selector">
                      <select
                        value={selectedRole[u.id!] || u.role || ''}
                        onChange={(e) => setSelectedRole({ ...selectedRole, [u.id!]: e.target.value })}
                        disabled={updatingRole === u.id}
                      >
                        <option value="">Select role...</option>
                        <option value="USER">USER</option>
                        <option value="ADMIN">ADMIN</option>
                      </select>
                      <button
                        className="btn-update-role"
                        onClick={() => handleUpdateRole(u.id!)}
                        disabled={updatingRole === u.id || !selectedRole[u.id!]}
                      >
                        {updatingRole === u.id ? '⏳ Updating...' : '✓ Update'}
                      </button>
                    </div>
                  </td>
                  <td className="admin-actions">
                    <button
                      className="btn-delete"
                      onClick={() => handleDeleteUser(u.id!)}
                      disabled={deleting === u.id}
                    >
                      {deleting === u.id ? '🗑️ Deleting...' : '🗑️ Delete'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UserManagement;

