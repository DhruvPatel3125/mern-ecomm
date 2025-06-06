import React from 'react';
import { Spinner } from 'react-bootstrap';

export default function Loading() {
    return (
        <div className="text-center my-5">
            <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
            </Spinner>
        </div>
    );
} 