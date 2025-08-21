import { useEffect, useRef, useState } from "react";
import './styles/payment.css';
import Icon from '@mdi/react';
import { mdiClose, mdiPlus, mdiMinus } from '@mdi/js';
import { BarLoader } from "react-spinners";
import api from './api';
import Mapp from "./Mapp";
import { Navigate, useNavigate } from "react-router-dom";
function Payment() {
    const user = JSON.parse(localStorage.getItem("user"));
    const [done, setDone] = useState(false);
    const [shoppingCart, setShoppingCart] = useState([]);
    const [toPay, setToPay] = useState(0);
    const counter = useRef(false);
    const navigate= useNavigate()
    const disable = () => {
        const paymentlist = document.getElementById('shopping-cart');
        paymentlist?.classList.add('disable');
    };

    const enable = () => {
        const paymentlist = document.getElementById('shopping-cart');
        paymentlist?.classList.remove('disable');
    };

    const getShoppingCart = () => {
        const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
        setShoppingCart(storedCart);
        const total = storedCart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        setToPay(total);
        setDone(true);
    };

    const updateLocalStorageCart = (updatedCart) => {
        localStorage.setItem("cart", JSON.stringify(updatedCart));
        setShoppingCart(updatedCart);
        setToPay(updatedCart.reduce((sum, item) => sum + item.price * item.quantity, 0));
    };

    const increaseCount = (e) => {
        disable();
        const id = e.currentTarget.id;
        const updatedCart = shoppingCart.map(item =>
            item.productId === id ? { ...item, quantity: item.quantity + 1 } : item
        );
        updateLocalStorageCart(updatedCart);
        enable();
    };

    const decreaseCount = (e) => {
        disable();
        const id = e.currentTarget.id;
        const foundItem = shoppingCart.find(item => item.productId === id);

        if (foundItem?.quantity === 1) {
            deleteProduct(e);
            return;
        }

        const updatedCart = shoppingCart.map(item =>
            item.productId === id ? { ...item, quantity: item.quantity - 1 } : item
        );
        updateLocalStorageCart(updatedCart);
        enable();
    };

    const deleteProduct = async (e) => {
        disable();
        e.preventDefault();
        const id = e.currentTarget.id;
        const updatedCart = shoppingCart.filter(item => item.productId !== id);

        try {
            await api.post(`/favorite/like/${id}`, {}, {
                headers: { Authorization: `Bearer ${user.accessToken}` }
            });
        } catch (error) {
            console.error("Failed to unlike product:", error);
        }

        updateLocalStorageCart(updatedCart);
        enable();
    };

    const purchaseProducts = async (e) => {
        e.preventDefault();

        const cardDetails = {
            name: e.target.elements["name"].value,
            email: user?.email || '',
            cardNumber: e.target.elements['credit-card-number'].value,
            expirationDate: e.target.elements['expiration-date'].value,
        };

        const orderPayload = {
            userId: user?.id,
            name: cardDetails.name,
            email: cardDetails.email,
            products: shoppingCart.map(item => ({
                productId: item.productId,
                quantity: item.quantity,
            })),
            amount: toPay,
            address: "--dummy-address--", // You may replace this with actual input
            location: JSON.parse(localStorage.getItem("location")) || [0, 0],
            deliveryPrice: 5.0
        };

        try {
            await api.post(`/orders`, orderPayload, {
                headers: { Authorization: `Bearer ${user?.accessToken}` }
            });
            localStorage.removeItem("cart");
            setShoppingCart([]);
            setToPay(0);
            alert("Order placed successfully!");
           navigate("/myfood/history");

        } catch (error) {
            console.error("Failed to place order:", error);
            alert("Failed to place order. Please try again.");
        }
    };

    useEffect(() => {
        window.dispatchEvent(new Event("cartUpdated"));
        if (counter.current) return;
        counter.current = true;
        getShoppingCart();
    }, []);

    return (
        <div className="payment">
            <div id="part-1">
                <h2>Shopping Cart</h2>
                {!done ? (
                    <div><BarLoader color="rgb(81, 216, 115)" width={100} /></div>
                ) : (
                    <div>
                        <div id="shopping-cart">
                            {shoppingCart.map(s => (
                                <div key={s.productId}>
                                    <img src={s.img} alt={s.title} />
                                    <p id="name">{s.title}</p>
                                    <button id={s.productId} onClick={increaseCount}>
                                        <Icon path={mdiPlus} size={1} />
                                    </button>
                                    <p id="count">{s.quantity}</p>
                                    <button id={s.productId} onClick={decreaseCount}>
                                        <Icon path={mdiMinus} size={1} />
                                    </button>
                                    <h3 id="price">${(s.price * s.quantity).toFixed(2)}</h3>
                                    <button id={s.productId} onClick={deleteProduct}>
                                        <Icon path={mdiClose} size={1} />
                                    </button>
                                </div>
                            ))}
                        </div>
                        <h3>Total: ${toPay.toFixed(2)}</h3>
                    </div>
                )}
            </div>
            <div id="part-2">
                
                <h2>Card Details</h2>
               
                <form onSubmit={purchaseProducts}>
                    <label htmlFor="name">Name</label>
                    <input id="name" type="text" required />
                    <label htmlFor="credit-card-number">Credit Card Number</label>
                    <input id="credit-card-number" type="number" required />
                    <label htmlFor="expiration-date">Expiration Date</label>
                    <input id="expiration-date" required />
                     <Mapp></Mapp>
                    <div>
                        <button className="submit" type="submit" disabled={shoppingCart.length === 0}>
                            Check Out
                        </button>
                    </div>
                </form>
                
            </div>
        </div>
    );
}

export default Payment;
