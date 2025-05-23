import React from 'react';
import { Modal, Button, Row, Col, Badge } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { addtocart } from '../actions/cartAction';
import { FaStar, FaShoppingCart } from 'react-icons/fa';

export default function QuickView({ product, show, handleClose }) {
    const dispatch = useDispatch();

    const handleAddToCart = () => {
        dispatch(addtocart(product, 1));
    };

    if (!product) return null;

    return (
        <Modal show={show} onHide={handleClose} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>{product.name}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Row>
                    <Col md={6}>
                        <img 
                            src={product.image} 
                            alt={product.name} 
                            className="img-fluid rounded"
                        />
                    </Col>
                    <Col md={6}>
                        <h4 className="mb-3">${product.price}</h4>
                        <div className="mb-3">
                            <Badge bg="success" className="mr-2">
                                {product.rating} <FaStar className="mb-1" />
                            </Badge>
                            <span className="text-muted">({product.numReviews} reviews)</span>
                        </div>
                        <p className="mb-3">{product.description}</p>
                        <div className="mb-3">
                            <strong>Category:</strong> {' '}
                            <Badge bg="info">{product.category}</Badge>
                        </div>
                        <div className="mb-3">
                            <strong>Status:</strong> {' '}
                            {product.countInStock > 0 ? (
                                <Badge bg="success">In Stock</Badge>
                            ) : (
                                <Badge bg="danger">Out of Stock</Badge>
                            )}
                        </div>
                        {product.countInStock > 0 && (
                            <Button 
                                variant="primary" 
                                onClick={handleAddToCart}
                                className="w-100"
                            >
                                <FaShoppingCart className="mr-2" /> Add to Cart
                            </Button>
                        )}
                    </Col>
                </Row>
            </Modal.Body>
        </Modal>
    );
}
