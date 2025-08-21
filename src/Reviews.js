import { useEffect, useRef, useState } from "react";

import './styles/reviews.css';
import { BarLoader } from "react-spinners";
import Footer from "./Footer";
import api from './api';

function Reviews(props) {
    const { user } = {}
    const [done, setDone] = useState(false);
    const [reviews, setReviews] = useState([]);
    const [newReview, setNewReview] = useState('');
    const [formData, setFormData] = useState({
        email: '',
        name: '',
        phone: '',
        message: ''
    });
    const [showForm, setShowForm] = useState(false);
    const counter = useRef(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const submitReview = async (e) => {
        e.preventDefault();
        
        try {
            await api.post('/feedback', {
                ...formData,
                message: newReview,
                userId: user?.id || null
            });
            
            // Refresh reviews after submission
            getReviews();
            setNewReview('');
            setFormData({
                email: '',
                name: '',
                phone: '',
                message: ''
            });
            setShowForm(false);
            alert('Thank you for your feedback!');
        } catch (error) {
            console.error("Failed to submit review:", error);
            alert('Failed to submit review. Please try again.');
        }
    };

    const getReviews = async () => {
        try {
            const response = await api.get('/feedback');
            setReviews(response.data);
        } catch (error) {
            console.error("Failed to fetch reviews:", error);
        } finally {
            setDone(true);
        }
    };

    useEffect(() => {
        if (counter.current) return;
        counter.current = true;
        getReviews();
    }, []);

    return (
        !done ? (
            <div className="ReactLoading">
                <BarLoader color="rgb(81, 216, 115)" width={100} />
            </div>
        ) : (
            <div>
                <div id="reviews" style={props.user != null ? { marginTop: '12vh' } : { marginTop: "auto" }}>
                    <h2>Customer Feedback</h2>
                    
                    {user ? (
                        <div className="feedback-form">
                            {!showForm ? (
                                <>
                                    <textarea 
                                        placeholder="Write your feedback message"
                                        value={newReview}
                                        onChange={(e) => setNewReview(e.target.value)}
                                    />
                                    <br />
                                    <button 
                                        className="submit" 
                                        onClick={() => setShowForm(true)}
                                        disabled={!newReview.trim()}
                                    >
                                        Submit Feedback
                                    </button>
                                </>
                            ) : (
                                <form onSubmit={submitReview}>
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="Your Email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        required
                                    />
                                    <input
                                        type="text"
                                        name="name"
                                        placeholder="Your Name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        required
                                    />
                                    <input
                                        type="tel"
                                        name="phone"
                                        placeholder="Phone (optional)"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                    />
                                    <textarea
                                        name="message"
                                        placeholder="Your Feedback"
                                        value={newReview}
                                        onChange={(e) => setNewReview(e.target.value)}
                                        required
                                    />
                                    <div className="form-buttons">
                                        <button 
                                            type="button" 
                                            className="cancel"
                                            onClick={() => setShowForm(false)}
                                        >
                                            Cancel
                                        </button>
                                        <button 
                                            type="submit" 
                                            className="submit"
                                            disabled={!newReview.trim() || !formData.email || !formData.name}
                                        >
                                            Submit
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    ) : (
                        <p>Please log in to submit feedback</p>
                    )}

                    <div className="reviews-list">
                        {reviews.map((review, index) => (
                            <div className="review" key={index}>
                                <div>
                                    <h3>{review.name}</h3>
                                    <p>{review.message}</p>
                                    {review.email && <p className="contact-info">Contact: {review.email}</p>}
                                </div>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                    <path d="M11 9.275c0 5.141-3.892 10.519-10 11.725l-.984-2.126c2.215-.835 4.163-3.742 4.38-5.746-2.491-.392-4.396-2.547-4.396-5.149 0-3.182 2.584-4.979 5.199-4.979 3.015 0 5.801 2.305 5.801 6.275zm13 0c0 5.141-3.892 10.519-10 11.725l-.984-2.126c2.215-.835 4.163-3.742 4.38-5.746-2.491-.392-4.396-2.547-4.396-5.149 0-3.182 2.584-4.979 5.199-4.979 3.015 0 5.801 2.305 5.801 6.275z" />
                                </svg>
                            </div>
                        ))}
                    </div>
                </div>
                {!user && <Footer />}
            </div>
        )
    );
}

export default Reviews;