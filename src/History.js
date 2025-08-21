import { useEffect, useState } from 'react';
import api from './api';
import NavigationBarLoggedIn from './NavigationBarLoggedIn';

function History() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user || !user.accessToken) return;

        const fetchOrders = async () => {
            try {
                const response = await api.get(`/orders`, {
                    headers: { Authorization: `Bearer ${user.accessToken}` }
                });

                const userOrders = response.data.filter(order => order.userId === user.id).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));;
                setOrders(userOrders);
            } catch (err) {
                console.error("Failed to fetch orders:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    if (loading) return <p>Loading order history...</p>;

    return (
        <div>
            <NavigationBarLoggedIn></NavigationBarLoggedIn>
            <div style={{marginLeft:"300px", marginTop:"10px"}}>
            <h2>Order History</h2>
            {orders.length === 0 ? (
                <p>You have no past orders.</p>
            ) : (
                <ul>
                    {orders.map((order, index) => (
                        <li key={order._id || index}>
                            <h4>Order #{index + 1}</h4>
                            <p>Total: ${order.amount}</p>
                            <p>Date: {new Date(order.createdAt).toLocaleString()}</p>
                            <ul>
                                {order.products.map((p, i) => (
                                    <li key={i}>
                                        Product ID: {p.productId}, Quantity: {p.quantity}
                                    </li>
                                ))}
                            </ul>
                            <hr />
                        </li>
                    ))}
                </ul>
                
            )}</div>
        </div>
    );
}

export default History;
