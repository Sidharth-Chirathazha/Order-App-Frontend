import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';

const OrderForm = () => {
    const [formData, setFormData] = useState({
        customer_name: '',
        quantity: '',
        product_id: '',
        customer_email: '',
    });
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    useEffect(() => {
        axios.get(`${backendUrl}/api/products/`)
            .then(response => setProducts(response.data))
            .catch(error => console.error('Error fetching products:', error));
    }, []);

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validateName = (name) => {
        return name.trim().length >= 2 && /^[a-zA-Z\s]+$/.test(name.trim());
    };

    const validateField = (name, value) => {
        let error = '';
        
        switch (name) {
            case 'customer_name':
                if (!value.trim()) {
                    error = 'Name is required';
                } else if (!validateName(value)) {
                    error = 'Name must be at least 2 characters and contain only letters';
                }
                break;
            case 'customer_email':
                if (!value.trim()) {
                    error = 'Email is required';
                } else if (!validateEmail(value)) {
                    error = 'Please enter a valid email address';
                }
                break;
            case 'product_id':
                if (!value) {
                    error = 'Please select a product';
                }
                break;
            case 'quantity':
                if (!value) {
                    error = 'Quantity is required';
                } else if (parseInt(value) < 1) {
                    error = 'Quantity must be at least 1';
                }
                break;
        }
        
        return error;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        setErrors(prev => ({ ...prev, [name]: '' }));
        
        if (name === 'product_id') {
            const product = products.find(p => p.id === parseInt(value));
            setSelectedProduct(product);
            setFormData({
                ...formData,
                [name]: value,
            });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleBlur = (e) => {
        const { name, value } = e.target;
        const error = validateField(name, value);
        setErrors(prev => ({ ...prev, [name]: error }));
    };

    const calculateTotalCost = () => {
        if (selectedProduct && formData.quantity) {
            return (selectedProduct.cost * parseFloat(formData.quantity)).toFixed(2);
        }
        return '0.00';
    };

    const isFormValid = () => {
        const requiredFields = ['customer_name', 'product_id', 'quantity', 'customer_email'];
        
        const allFieldsFilled = requiredFields.every(field => formData[field].toString().trim());
        
        const noErrors = Object.values(errors).every(error => !error);
        
        const allFieldsValid = requiredFields.every(field => !validateField(field, formData[field]));
        
        return allFieldsFilled && noErrors && allFieldsValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const newErrors = {};
        Object.keys(formData).forEach(field => {
            const error = validateField(field, formData[field]);
            if (error) newErrors[field] = error;
        });
        
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
        
        setIsLoading(true);
        
        const orderData = {
            customer_name: formData.customer_name,
            quantity: parseInt(formData.quantity),
            product_id: formData.product_id,
            customer_email: formData.customer_email,
            total_cost: calculateTotalCost(),
        };

        try {
            const response = await axios.post(`${backendUrl}/api/orders/`, orderData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.status === 201 || response.status === 200) {
                toast.success('Order placed successfully! Check your email for confirmation.');
                
                setFormData({
                    customer_name: '',
                    quantity: '',
                    product_id: '',
                    customer_email: '',
                });
                setSelectedProduct(null);
                setErrors({});
            } else {
                throw new Error('Failed to place order');
            }
        } catch (error) {
            console.error('Error placing order:', error);
            toast.error('Error placing order. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Place Order</h2>
            <form>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Customer Name *
                        </label>
                        <input
                            type="text"
                            name="customer_name"
                            value={formData.customer_name}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            required
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                errors.customer_name ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="Enter your name"
                        />
                        {errors.customer_name && (
                            <p className="text-red-500 text-sm mt-1">{errors.customer_name}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Product *
                        </label>
                        <select
                            name="product_id"
                            value={formData.product_id}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            required
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                errors.product_id ? 'border-red-500' : 'border-gray-300'
                            }`}
                        >
                            <option value="">Select a product</option>
                            {products.map(product => (
                                <option key={product.id} value={product.id}>
                                    {product.name} - ₹{product.cost}
                                </option>
                            ))}
                        </select>
                        {errors.product_id && (
                            <p className="text-red-500 text-sm mt-1">{errors.product_id}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Quantity *
                        </label>
                        <input
                            type="number"
                            name="quantity"
                            value={formData.quantity}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            required
                            min="1"
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                errors.quantity ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="Enter quantity"
                        />
                        {errors.quantity && (
                            <p className="text-red-500 text-sm mt-1">{errors.quantity}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Total Cost
                        </label>
                        <input
                            type="text"
                            value={`₹${calculateTotalCost()}`}
                            readOnly
                            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600 cursor-not-allowed"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email Address *
                        </label>
                        <input
                            type="email"
                            name="customer_email"
                            value={formData.customer_email}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            required
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                errors.customer_email ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="Enter your email"
                        />
                        {errors.customer_email && (
                            <p className="text-red-500 text-sm mt-1">{errors.customer_email}</p>
                        )}
                    </div>

                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={isLoading || !isFormValid()}
                        className={`w-full py-2 px-4 rounded-md font-medium transition-colors ${
                            isLoading || !isFormValid()
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
                        } text-white`}
                    >
                        {isLoading ? 'Placing Order...' : 'Place Order'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default OrderForm;