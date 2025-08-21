import { useEffect, useRef } from "react";
import './styles/categories.css';
import './styles/home.css';
import { NavLink, Outlet, useParams } from "react-router-dom";
import { Navigate } from "react-router-dom";
import { useState } from "react";
import { BarLoader } from "react-spinners";
import Categories from "./Categories";
import api from './api'; // Import your API instance
import NavigationBar from "./NavigateBar";
import Footer from "./Footer";
import image from './images/image.png';
function Category() {
    const counter = useRef(false);
    const { category } = useParams();
    const [done, setDone] = useState(false);
    const [products, setProducts] = useState([]);
    const [error, setError] = useState(null);
    const handleonRegister = () => {
      //  Navigate('/myfood/register')
    }
    const fetchProducts = async () => {
        try {
           
            const response = await api.get(`/products/`);
            console.log("API response:", response.data);
            setProducts(response.data.products);
        } catch (err) {
            console.error("Failed to fetch products:", err);
            setError("Failed to load products. Please try again.");
        } finally {
            setDone(true);
        }
    };

    useEffect(() => {
        if (counter.current) return;
        counter.current = true;
        fetchProducts();
    }, [category]);

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    return (
        <div>
            <Categories />
            
            {!done ? (
                <div className="ReactLoading">
                    <BarLoader color="rgb(81, 216, 115)" width={100} />
                </div>
            ) : (
                <div>
                <NavigationBar></NavigationBar>
                  <div className="flex-container">
                            <div id="part-1">
                                <div id="part-1-1">
                                    <h3>the best cuisine awaits you</h3>
                                    <h1>Welcome!<br></br>To my food</h1>
                                </div>
                                <div id="part-1-2">
                                    <h1>20%</h1>
                                    <h3> discount upon<br></br> registeration</h3>
                                </div>
                                <button className="register">
                                    <NavLink to={"./register"}>Register</NavLink>
                                </button>
                            </div>
                            <div id="part-2">
                                <img src={image}></img>
                            </div>
                        </div>
               
                
                </div>
            )}
            
            <Footer></Footer>
        </div>
    );
}

export default Category;