import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function UsersList() {
  // Step 1: Create state variables
  const [users, setUsers] = useState([]);        // Store users data
  const [loading, setLoading] = useState(true);  // Track loading status
  const [error, setError] = useState(null);      // Store error messages

  // Step 2: Use useEffect to fetch data when component loads
  useEffect(() => {
    fetchUsers();
  }, []); // Empty array [] = run only once on component mount

  // Step 3: Create function to fetch data from API
  const fetchUsers = async () => {
    try {
      setLoading(true); // Start loading
      
      // Make API call using axios
      const response = await axios.get('https://jsonplaceholder.typicode.com/users?_limit=2');
      
      // response.data contains the users array
      setUsers(response.data);
      
      setError(null); // Clear any previous errors
    } catch (err) {
      // If API call fails, show error
      setError('Failed to fetch users');
      console.error(err);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  // Step 4: Render based on state

  // Show loading message
  if (loading) {
    return <div className="card">Loading users...</div>;
  }

  // Show error message
  if (error) {
    return <div className="card" style={{ color: 'red' }}>{error}</div>;
  }

  // Show users list
  return (
    <div className="card">
      <h2>Users ({users.length})</h2>
      {users.map((user) => (
        <div key={user.id} style={{ borderBottom: '1px solid #ddd', padding: '10px 0' }}>
          <h4>{user.name}</h4>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Phone:</strong> {user.phone}</p>
          <p><strong>Company:</strong> {user.company?.name}</p>
        </div>
      ))}
    </div>
  );
}
