import React, { createContext, useState, useContext } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cartId, setCartId] = useState(localStorage.getItem('cartId')); // Initialize cartId from localStorage
    const [temporaryCart, setTemporaryCart] = useState([]);

    const createCart = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/carts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (response.ok) {
                const newCart = await response.json();
                setCartId(newCart.id);
                localStorage.setItem('cartId', newCart.id); // Store cartId in localStorage
            } else {
                console.error('Failed to create cart:', response);
            }
        } catch (error) {
            console.error('Error creating cart:', error);
        }
    };

    const deleteOrder = async (cartId) => {
        try {
            // Construct the URL with the cartId
            const url = `http://localhost:8080/api/carts/${cartId}`;
    
            // Make the API request to delete the order
            const response = await fetch(url, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
    
            if (response.ok) {
                // Optionally, you might want to update the cartId and localStorage if needed
                setCartId(null); // Clear cartId
                localStorage.removeItem('cartId'); // Remove cartId from localStorage
                console.log('Order deleted successfully');
                alert('Order Deleted')
                
            } else {
                console.error('Failed to delete order:', await response.text());
            }
        } catch (error) {
            console.error('Error deleting order:', error);
        }
    };

    const addToCart = async (product) => {
        if (!cartId) {
            await createCart(); // Ensure cart is created if cartId is null
        }

        const existingProductIndex = temporaryCart.findIndex(item => item.id === product.id);

        if (existingProductIndex === -1) {
            try {
                const response = await fetch(`http://localhost:8080/api/carts/${cartId}/items?productId=${product.id}&quantity=${product.quantity || 1}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                if (response.ok) {
                    setTemporaryCart([...temporaryCart, product]); // Add product to temporaryCart state
                } else {
                    console.error('Failed to add item to cart:', response);
                }
            } catch (error) {
                console.error('Error adding item to cart:', error);
            }
        } else {
            console.log('Item is already in the cart');
        }
    };

    const addItemToTemporaryCart = (product) => {
        setTemporaryCart(prevCart => {
            const existingProductIndex = prevCart.findIndex(item => item.id === product.id);
            if (existingProductIndex === -1) {
                return [...prevCart, { ...product, quantity: product.quantity || 1 }];
            } else {
                const updatedCart = [...prevCart];
                updatedCart[existingProductIndex] = {
                    ...updatedCart[existingProductIndex],
                    quantity: (updatedCart[existingProductIndex].quantity || 1) + (product.quantity || 1),
                };
                return updatedCart;
            }
        });
    };


    const removeFromCart = (productId) => {
        setTemporaryCart(temporaryCart.filter(item => item.id !== productId));
    };

    const clearCart = () => {
        setTemporaryCart([]);
        setCartId(null); // Reset cartId state
        localStorage.removeItem('cartId'); // Remove cartId from localStorage
    };

    const placeOrder = async (customerName, address, totalAmount) => {
        if (!cartId) {
            console.error('Cart ID is not available');
            return;
        }

        const orderDetails = {
            customerName,
            address,
            totalAmount,
            items: temporaryCart, // Use the temporary cart here
        };

        try {
            const response = await fetch(`http://localhost:8080/api/carts/${cartId}/place?customerName=${encodeURIComponent(customerName)}&address=${encodeURIComponent(address)}&totalAmount=${encodeURIComponent(totalAmount)}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderDetails),
            });

            if (response.ok) {
                const order = await response.json();
                alert(`Order placed with ID = ${order.id}`);
                clearCart(); // Clear the temporary cart and reset cartId
                
            } else {
                console.error('Failed to place order:', response);
            }
        } catch (error) {
            console.error('Error placing order:', error);
        }
    };

    return (
        <CartContext.Provider value={{ cartId, setCartId, addItemToTemporaryCart, temporaryCart, addToCart, removeFromCart, clearCart, placeOrder, createCart, deleteOrder }}>
            {children}
        </CartContext.Provider>
    );
};
