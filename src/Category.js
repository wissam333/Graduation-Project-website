import { useEffect, useRef, useState } from "react";
import { NavLink, Outlet, useParams } from "react-router-dom";
import { BarLoader } from "react-spinners";
import Categories from "./Categories";
import api from './api'; // Import your API instance
import './styles/categories.css';


function Category() {
    const counter = useRef(false);
    const current = useParams();
    const [done, setDone] = useState(false);
    const [products, setProducts] = useState([]);
 
    const getProducts = async () => {
         try {
        const response = await api.get(`/products?page=1&pageSize=2&latest=true&categoryId=${current.category}`);
        const fetchedProducts = response.data.products || [];
        setProducts(fetchedProducts);
        console.log("Fetched products:", fetchedProducts); // Log here instead
    } catch (error) {
        console.error("Failed to fetch products:", error);
    }
    };

    useEffect(() => {
        setDone(false); // show loader while loading new products
        getProducts().then(() => {
    setDone(true);
});
        getProducts().then(() => {
            setDone(true);
        });
    }, [current.category]);

    return (
        <div>
             
            <Categories />
            
            {!done ? (
                <div className="ReactLoading">
                    <BarLoader color="rgb(81, 216, 115)" width={100} />
                </div>
            ) : (
                <div className="category-section">
                    <h1>{current.category.name}</h1>
                    
                    <div className="category">
                        {products.map(product => (
                            <div key={product._id}>
                                <NavLink to={product._id}>
                                    <img src={product.img} alt={product.img} />
                                    <p>
                                        {product.title}<br />
                                        <span style={{ color: "rgb(252, 72, 102)" }}>
                                            {product.rating}
                                        </span>
                                        <span style={{ fontWeight: "semibold" }}> stars</span>
                                    </p>
                                    <h3>${product.price}</h3>
                                </NavLink>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            
            <Outlet />
        </div>
    );
}

export default Category;