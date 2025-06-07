import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const ConfirmOrder = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const hasRunRef = useRef(false); // Use useRef to persist across renders

    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    useEffect(() => {
        if (hasRunRef.current) return; // Skip if already run
        hasRunRef.current = true; // Mark as run

        axios.get(`${backendUrl}/api/orders/${orderId}/`)
            .then(response => {
                setOrder(response.data);
                setIsLoading(false);

                if (response.data.status === 'Confirmed') {
                    toast.info('Order already confirmed!', {
                        onClose: () => navigate('/'),
                        autoClose: 3000
                    });
                } else if (response.data.status === 'Order Placed') {
                    axios.post(`${backendUrl}/api/confirm-order/${orderId}/`)
                        .then(() => {
                            toast.success('Order confirmed! You will receive a confirmation email.', {
                                onClose: () => navigate('/'),
                                autoClose: 3000
                            });
                        })
                        .catch(error => {
                            console.error('Error confirming order:', error);
                            toast.error('Failed to confirm order. Please try again.', {
                                onClose: () => navigate('/'),
                                autoClose: 3000
                            });
                        });
                }
            })
            .catch(error => {
                console.error('Error fetching order:', error);
                toast.error('Failed to fetch order details.', {
                    onClose: () => navigate('/'),
                    autoClose: 3000
                });
                setIsLoading(false);
            });
    }, [orderId, navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-6 rounded-lg shadow-md max-w-md w-full">
                {isLoading ? (
                    <div className="flex flex-col items-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                        <h2 className="text-xl font-semibold text-gray-800 mt-4">Confirming your order...</h2>
                    </div>
                ) : order && order.status === 'Order Placed' ? (
                    <div>
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Order Details</h2>
                        <div className="space-y-2">
                            <p><strong>Order ID:</strong> {order.order_id}</p>
                            <p><strong>Customer:</strong> {order.customer_name}</p>
                            <p><strong>Product:</strong> {order.product.name}</p>
                            <p><strong>Quantity:</strong> {order.quantity}</p>
                            <p><strong>Total Cost:</strong> ₹{order.total_cost}</p>
                            <p><strong>Email:</strong> {order.customer_email}</p>
                        </div>
                    </div>
                ) : (
                    <h2 className="text-xl font-semibold text-gray-800">Order already confirmed</h2>
                )}
            </div>
        </div>
    );
};

export default ConfirmOrder;