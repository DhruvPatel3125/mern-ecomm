import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Table, Button } from 'react-bootstrap';
import Loading from '../components/Loading';
import Error from '../components/Error';
import { getAllUsers, deleteUser } from '../reducers/userReducer';

export default function UsersList() {
  const dispatch = useDispatch();
  const { loading, error, users } = useSelector((state) => state.getAllUsers);
  const { loading: deleteLoading, error: deleteError, success: deleteSuccess } = useSelector((state) => state.deleteUser);

  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);

  useEffect(() => {
    if (deleteSuccess) {
      dispatch(getAllUsers());
    }
  }, [deleteSuccess, dispatch]);

  const handleDeleteUser = (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      dispatch(deleteUser(userId));
    }
  };

  if (loading || deleteLoading) return <Loading />;
  if (error) return <Error error={error} />;
  if (deleteError) return <Error error={deleteError} />;

  return (
    <div>
      <h2>Users List</h2>
      <Table striped bordered hover responsive className="mt-3">
        <thead>
          <tr>
            <th>User ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Is Admin</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users && users.map((user) => (
            <tr key={user._id}>
              <td>{user._id}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.isAdmin ? 'Yes' : 'No'}</td>
              <td>
                <Button 
                  variant="danger" 
                  size="sm"
                  onClick={() => handleDeleteUser(user._id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
