import React, { useState, useEffect } from 'react';
import { useCart } from './CartContext';

const ShowOrder = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const {deleteOrder} = useCart();

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await fetch('http://localhost:8080/api/carts');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setOrders(data); // Adjust if data structure is different
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    const tableStyle = {
        borderCollapse: 'collapse',
        width: '100%',
    };

    const thTdStyle = {
        border: '1px solid #ddd',
        padding: '8px',
    };

    const thStyle = {
        ...thTdStyle,
        backgroundColor: '#f4f4f4',
    };

    const buttonStyle = {
        padding: '5px 10px',
        border: 'none',
        backgroundColor: '#FF0000',
        color: '#fff',
        cursor: 'pointer',
    };

    return (
        <div>
            <h2>Order List</h2>
            {orders.length === 0 ? (
                <p>No orders available</p>
            ) : (
                <table style={tableStyle}>
                    <thead>
                        <tr>
                        <th style={thStyle}>Order ID</th>
                            <th style={thStyle}>Customer Name</th>
                            <th style={thStyle}>Address</th>
                            <th style={thStyle}>Total Amount</th>                       
                            <th style={thStyle}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(order => (
                            <tr key={order.id}>
                                <td style={thTdStyle}>{order.id}</td>
                                <td style={thTdStyle}>{order.customerName}</td>
                                <td style={thTdStyle}>{order.address}</td>
                                <td style={thTdStyle}>Rp {order.totalAmount}</td>                                 
                                <td style={thTdStyle}>
                                    <button style={buttonStyle} onClick={() => deleteOrder(order.id)}>Delete</button>
                                    {/* Add more actions if necessary */}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

const handleViewOrder = (orderId) => {
    // Implement view order logic, e.g., redirect to order details page
    console.log(`Viewing order with ID: ${orderId}`);
};

export default ShowOrder;
