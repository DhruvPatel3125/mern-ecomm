import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getOrderById } from '../actions/orderAction';
import Loader from '../components/Loader';
import Error from '../components/Error';
import { Card, Row, Col, ListGroup, Badge } from 'react-bootstrap';
import moment from 'moment';

export default function OrderDetailsScreen() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const { loading, order, error } = useSelector(state => state.getOrderById || {});

    useEffect(() => {
        if (id) {
            console.log('Loading order details for ID:', id);
            dispatch(getOrderById(id));
        }
    }, [dispatch, id]);

    if (loading) return <Loader />;
    if (error) {
        return (
            <div className="container mt-5">
                <Error error={error} />
                <div className="text-center mt-3">
                    <button 
                        className="btn btn-primary"
                        onClick={() => window.history.back()}
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }
    if (!order) return <div className="container mt-5"><h3>Order not found</h3></div>;

    return (
        <div className="container mt-5">
            <Row>
                <Col md={8}>
                    <Card className="mb-4">
                        <Card.Header>
                            <h4>Order Details</h4>
                        </Card.Header>
                        <Card.Body>
                            <Row>
                                <Col md={6}>
                                    <p><strong>Order ID:</strong> {order._id}</p>
                                    <p><strong>Order Date:</strong> {moment(order.createdAt).format('MMM Do YYYY, h:mm A')}</p>
                                    <p><strong>Customer:</strong> {order.name}</p>
                                    <p><strong>Email:</strong> {order.email}</p>
                                </Col>
                                <Col md={6}>
                                    <p><strong>Transaction ID:</strong> {order.transactionId}</p>
                                    <p><strong>Order Amount:</strong> ${order.orderAmount?.toFixed(2)}</p>
                                    <p>
                                        <strong>Status:</strong>{' '}
                                        {order.isDelivered ? (
                                            <Badge bg="success">Delivered</Badge>
                                        ) : (
                                            <Badge bg="warning">Pending</Badge>
                                        )}
                                    </p>
                                    {order.deliveredAt && (
                                        <p><strong>Delivered At:</strong> {moment(order.deliveredAt).format('MMM Do YYYY, h:mm A')}</p>
                                    )}
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>

                    <Card className="mb-4">
                        <Card.Header>
                            <h4>Shipping Address</h4>
                        </Card.Header>
                        <Card.Body>
                            <p>{order.shippingAddress?.address}</p>
                            <p>{order.shippingAddress?.city}, {order.shippingAddress?.postalCode}</p>
                            <p>{order.shippingAddress?.country}</p>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={4}>
                    <Card>
                        <Card.Header>
                            <h4>Order Items</h4>
                        </Card.Header>
                        <ListGroup variant="flush">
                            {order.orderItems && order.orderItems.map((item, index) => (
                                <ListGroup.Item key={item._id || index}>
                                    <Row className="align-items-center">
                                        <Col xs={8}>
                                            <h6 className="mb-1">{item.name}</h6>
                                            <small className="text-muted">Qty: {item.quantity}</small>
                                        </Col>
                                        <Col xs={4} className="text-end">
                                            <strong>${(item.price * item.quantity).toFixed(2)}</strong>
                                        </Col>
                                    </Row>
                                </ListGroup.Item>
                            ))}
                            <ListGroup.Item>
                                <Row>
                                    <Col>
                                        <strong>Total Amount:</strong>
                                    </Col>
                                    <Col className="text-end">
                                        <strong>${order.orderAmount?.toFixed(2)}</strong>
                                    </Col>
                                </Row>
                            </ListGroup.Item>
                        </ListGroup>
                    </Card>
                </Col>
            </Row>

            <div className="text-center mt-4">
                <button 
                    className="btn btn-secondary me-2"
                    onClick={() => window.history.back()}
                >
                    Go Back
                </button>
                {!order.isDelivered && (
                    <button 
                        className="btn btn-success"
                        onClick={() => console.log('Mark as delivered functionality here')}
                    >
                        Mark as Delivered
                    </button>
                )}
            </div>
        </div>
    );
}