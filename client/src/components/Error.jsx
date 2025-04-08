import React from 'react';
import { Alert } from 'react-bootstrap';

export default function Error({ error }) {
    return (
        <Alert variant="danger" className="my-3">
            {error}
        </Alert>
    );
}
