import React, { useState, useEffect } from 'react';
import { useCart } from './CartContext'; // Import the context

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(5);
    const [totalPages, setTotalPages] = useState(1);
    const { addToCart } = useCart(); // Use the cart context

    useEffect(() => {
        fetchProducts(page, size);
    }, [page, size]);

    const fetchProducts = (page, size) => {
        fetch(`http://localhost:8080/api/products?page=${page}&size=${size}`)
            .then(response => response.json())
            .then(data => {
                setProducts(data.content); // `content` contains the list of products
                setTotalPages(data.totalPages); // `totalPages` for pagination
            })
            .catch(error => console.error('Error fetching products:', error));
    };

    const handleQuantityChange = (id, event) => {
        const newProducts = products.map(product =>
            product.id === id ? { ...product, quantity: parseInt(event.target.value) } : product
        );
        setProducts(newProducts);
    };

    

    const handlePageChange = (newPage) => {
        setPage(newPage);
    };

    const handleSizeChange = (event) => {
        setSize(parseInt(event.target.value));
        setPage(0); // Reset to first page
    };

    const deleteProduct = (id) => {
        fetch(`http://localhost:8080/api/products/${id}`, {
            method: 'DELETE',
        })
            .then(response => {
                if (response.ok) {
                    setProducts(products.filter(product => product.id !== id));
                } else {
                    console.error('Failed to delete product');
                }
            })
            .catch(error => console.error('Error deleting product:', error));
    };

    const updateProduct = (id, updatedProduct) => {
        fetch(`http://localhost:8080/api/products/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedProduct),
        })
            .then(response => response.json())
            .then(data => {
                const updatedProducts = products.map(product =>
                    product.id === id ? data : product
                );
                setProducts(updatedProducts);
            })
            .catch(error => console.error('Error updating product:', error));
    };

    const handleUpdate = (product) => {
        const updatedProduct = {
            ...product,
            name: prompt('Enter new name', product.name) || product.name,
            price: parseFloat(prompt('Enter new price', product.price) || product.price),
            quantity: parseInt(prompt('Enter new quantity', product.quantity) || product.quantity, 10),
        };
        updateProduct(product.id, updatedProduct);
    };

    return (
        <div>
            <h2>Product List</h2>
            <div>
                <label>Items per page: </label>
                <select value={size} onChange={handleSizeChange}>
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                </select>
            </div>
            {products.map((product) => (
                <div key={product.id} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
                    <div>
                        <label>Name: </label>
                        <input type="text" value={product.name} readOnly />
                    </div>
                    <div>
                        <label>Type: </label>
                        <select disabled>
                            <option>{product.type} </option>
                            {/* Add other types as necessary */}
                        </select>
                    </div>
                    <div>
                        <label>Price: </label>
                        <span>Rp {product.price.toLocaleString('id-ID')}</span>
                    </div>
                    <div>
                        <label>Quantity: </label>
                        <input 
                            type="number" 
                            value={product.quantity || 1} 
                            onChange={(e) => handleQuantityChange(product.id, e)} 
                        />
                    </div>
                    <div>
                        <button onClick={() => addToCart(product)}>Add To Cart</button>
                        <button onClick={() => handleUpdate(product)}>Update</button>
                        <button onClick={() => deleteProduct(product.id)}>Delete</button>
                    </div>
                </div>
            ))}

            <div style={{ marginTop: '20px' }}>
                <button 
                    onClick={() => handlePageChange(page - 1)} 
                    disabled={page === 0}
                >
                    Previous
                </button>
                <span> Page {page + 1} of {totalPages} </span>
                <button 
                    onClick={() => handlePageChange(page + 1)} 
                    disabled={page + 1 >= totalPages}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default ProductList;
