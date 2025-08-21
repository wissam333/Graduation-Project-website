import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./styles/product.css";
import { BarLoader } from "react-spinners";
import api from "./api";

function Product() {
  const [done, setDone] = useState(false);
  const [productInfo, setProductInfo] = useState({
    title: "",
    price: 0,
    desc: "",
    img: "",
    restaurantId: "",
    categoryId: ""
  });
  const [restaurantName, setRestaurantName] = useState("N/A");
  const [categoryName, setCategoryName] = useState("N/A");
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  // Expecting route params: /:category/:product
  const { category: currentCategory, product: currentProduct } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    getProductData();
    checkIfLiked();
  }, [currentCategory, currentProduct]);

  const getProductData = async () => {
    try {
      // Fetch product by its ID
      const productRes = await api.get(`/products/${currentProduct}`);
      const product = productRes.data;
      setProductInfo(product);

      // Fetch category info by ID and extract the category name
      if (product.categoryId) {
        const categoryRes = await api.get(`/category/${product.categoryId}`);
        console.log(categoryRes.data);
        setCategoryName(categoryRes.data.name || "N/A");
      }

      // Fetch restaurant info by ID and extract the restaurant name
      if (product.restaurantId) {
        const restaurantRes = await api.get(`/restaurant/${product.restaurantId}`);
        setRestaurantName(restaurantRes.data.name );
      }
    } catch (error) {
      console.error("Error fetching product, category, or restaurant:", error);
      setCategoryName("N/A");
      setRestaurantName("N/A");
    } finally {
      setDone(true);
    }
  };

  const checkIfLiked = () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const inCart = cart.find(item => item.productId === currentProduct);
    if (inCart) {
      setIsLiked(true);
    }
  };

  const likeProduct = async () => {
    try {
      await api.post(`/favorites/like/${currentProduct}`);
    } catch (err) {
      console.error("Failed to like product:", err);
    }
  };

  const addProductToCart = async () => {
    setIsAddingToCart(true);
    try {
      let cart = JSON.parse(localStorage.getItem("cart")) || [];
      const existingIndex = cart.findIndex(item => item.productId === currentProduct);
      if (existingIndex > -1) {
        cart[existingIndex].quantity += 1;
      } else {
        cart.push({
          productId: currentProduct,
          title: productInfo.title,
          price: productInfo.price,
          img: productInfo.img,
          quantity: 1
        });
      }
      localStorage.setItem("cart", JSON.stringify(cart));

      await likeProduct();
      setIsLiked(true);
      alert("Product added to cart!");
    } catch (error) {
      console.error("Failed to add to cart or like product:", error);
      alert("Failed to add product to cart");
    } finally {
      setIsAddingToCart(false);
    }
  };

  const goToCart = () => {
    navigate("/myfood/payment");
  };

  return (
    <div>
      {!done ? (
        <div className="ReactLoading">
          <BarLoader color="rgb(81, 216, 115)" width={100} />
        </div>
      ) : (
        <div className="product">
          <div id="part-1" style={{ width: "40vw", marginLeft: "50px" }}>
            <h1>{productInfo.title}</h1>
            <p>{productInfo.desc}</p>
            <p>
              <strong>Restaurant:</strong> {restaurantName}
            </p>
            <p>
              <strong>Category:</strong> {categoryName}
            </p>
            <h1>${Number(productInfo.price).toFixed(2)}</h1>
            {isLiked ? (
              <button
                className="submit"
                onClick={goToCart}
                style={{ backgroundColor: "#3CA85D", color: "black" }}
              >
                Go to Cart
              </button>
            ) : (
              <button
                className="submit"
                onClick={addProductToCart}
                disabled={isAddingToCart}
              >
                {isAddingToCart ? "Adding..." : "Add to Cart"}
              </button>
            )}
          </div>
          <div
            id="part-2"
            style={{
              display: "flex",
              justifyContent: "flex-end",
              width: "100%"
            }}
          >
            <img
              src={productInfo.img}
              alt={productInfo.title}
              style={{ maxWidth: "600px", objectFit: "contain" }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default Product;