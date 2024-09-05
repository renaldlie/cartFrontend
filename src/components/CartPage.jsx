import React, { useState } from 'react';
import { useCart } from './CartContext'; // Import the context
import { useNavigate } from 'react-router-dom';

const CartPage = () => {
    const navigate = useNavigate();
    const {temporaryCart, removeFromCart, placeOrder } = useCart(); // Use the cart context
    const [customerName, setCustomerName] = useState('');
    const [address, setAddress] = useState('');
    
    

    const handlePlaceOrder = () => {
        placeOrder(customerName, address, totalAmount).then(() => {
            navigate("/"); // Redirect to home or confirmation page
            
        });
    };

    const totalAmount = temporaryCart.reduce((total, item) => total + item.price * item.quantity, 0);

    return (
        <div>
            <div>
                <h2>Order Cart</h2>
                <p>
                    Customer:
                    <input
                        type="text"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        style={{ marginLeft: '10px' }}
                    />
                </p>
            </div>

            <p>
                Address:
                <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    style={{ marginLeft: '10px' }}
                />
            </p>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Type</th>
                        <th>Price</th>
                        <th>Qty</th>
                        <th>Total</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {temporaryCart.map((item) => (
                        <tr key={item.id}>
                            <td>{item.name}</td>
                            <td>{item.type}</td>
                            <td>Rp {item.price.toLocaleString('id-ID')}</td>
                            <td>{item.quantity}</td>
                            <td>Rp {(item.price * item.quantity).toLocaleString('id-ID')}</td>
                            <td>
                                <button onClick={() => removeFromCart(item.id)}>Remove</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
                <tfoot>
                    <tr>
                        <td colSpan="4">Total</td>
                        <td>Rp {totalAmount.toLocaleString('id-ID')}</td>
                        <td></td>
                    </tr>
                </tfoot>
            </table>
            <button onClick={handlePlaceOrder}>Place Order</button>
        </div>
    );
};

export default CartPage;
