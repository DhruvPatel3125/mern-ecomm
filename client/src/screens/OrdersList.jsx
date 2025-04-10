import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Table, Button } from 'react-bootstrap';
import { getAllOrders } from '../actions/orderAction';
import Loading from '../components/Loading';
import Error from '../components/Error';
import moment from 'moment';

export default function OrdersList() {
    const dispatch = useDispatch();
    const ordersState = useSelector(state => state.getAllOrdersReducer) || {};
    const { loading = false, error = null, orders = [] } = ordersState;

    useEffect(() => {
        dispatch(getAllOrders());
    }, [dispatch]);

    return (
        <div className="row justify-content-center">
            <div className="col-md-12">
                <h2 className="text-center mb-4">Orders List</h2>
                {loading && <Loading />}
                {error && <Error error={error} />}
                {orders && (
                    <div className="table-responsive">
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>Order ID</th>
                                    <th>Customer</th>
                                    <th>Amount</th>
                                    <th>Date</th>
                                    <th>Items</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map(order => (
                                    <tr key={order._id}>
                                        <td>{order._id}</td>
                                        <td>{order.name}</td>
                                        <td>${order.orderAmount}</td>
                                        <td>{moment(order.createdAt).format('MMM Do YYYY')}</td>
                                        <td>
                                            {order.orderItems.map(item => (
                                                <div key={item._id}>
                                                    {item.name} x {item.quantity}
                                                </div>
                                            ))}
                                        </td>
                                        <td>
                                            {order.isDelivered ? (
                                                <span className="badge bg-success">Delivered</span>
                                            ) : (
                                                <span className="badge bg-warning">Pending</span>
                                            )}
                                        </td>
                                        <td>
                                            <Button 
                                                variant="info" 
                                                size="sm"
                                                href={`/order/${order._id}`}
                                            >
                                                View Details
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                )}
            </div>
        </div>
    );
}
