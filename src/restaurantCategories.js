import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { BarLoader } from "react-spinners";
import api from './api';
import NavigationBarLoggedIn from './NavigationBarLoggedIn';

export default function RestaurantCategories() {
  const { restaurantId } = useParams();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [restaurant, setRestaurant] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!restaurantId) return;

    const fetchData = async () => {
      try {
        const [catRes, restRes, prodRes] = await Promise.all([
          api.get(`/category?restaurantId=${restaurantId}`),
          api.get(`/restaurant/${restaurantId}`),
          api.get(`/products?restaurantId=${restaurantId}`),
        ]);

        setCategories(catRes.data);
        setRestaurant(restRes.data);
        setProducts(prodRes.data.products || []);
      } catch (err) {
        console.error("Error fetching restaurant, categories, or products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [restaurantId]);

  if (loading) {
    return (
      <>
        <NavigationBarLoggedIn />
        <div className="ReactLoading" style={{ marginTop: 80 }}>
          <BarLoader color="rgb(81, 216, 115)" width={100} />
        </div>
      </>
    );
  }

  if (!restaurant) {
    return (
      <>
        <NavigationBarLoggedIn />
        <p style={{ padding: 20, marginTop: 80 }}>Restaurant not found.</p>
      </>
    );
  }

  return (
    <>
      <NavigationBarLoggedIn />
      <div style={{ padding: 20, marginTop: 80 }}>
        <button
          style={{
            marginLeft: 280,
            padding: 0,
            cursor: "pointer",
            color: "white",
            border: "none",
            background: "none",
            fontSize: "16px",
            fontWeight: "bold",
          }}
          onClick={() => navigate(-1)}
          aria-label="Go back"
        >
          ← Back
        </button>

        <h1 style={{ marginLeft: 280, marginTop: '20px' }}>{restaurant.name}</h1>

        {categories.length === 0 ? (
          <p style={{ color: "white" }}>No categories found for this restaurant.</p>
        ) : (
          <ul style={{ padding: '20px', marginTop: 3, marginLeft: 250 }}>
            {categories.map(c => {
              const productCount = products.filter(p => p.categoryId === c._id).length;

              return (
                <li
                  key={c._id}
                  style={{
                    border: "1px solid #ddd",
                    marginBottom: 10,
                    borderRadius: 8,
                    padding: 10,
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    cursor: "pointer",
                    backgroundColor: "#222",
                  }}
                  onClick={() => navigate(`../myfood/categories/${c._id}`)} // match category navigation pattern
                  title={`View products in ${c.name}`}
                >
                  <img
                    src={c.img}
                    alt={c.name}
                    style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 8 }}
                  />
                  <div style={{ flex: 1, color: "white" }}>
                    <h3 style={{ margin: "0 0 5px" }}>{c.name}</h3>
                    <p style={{ margin: 0, color: "#ccc" }}>
                      {productCount} {productCount === 1 ? 'product' : 'products'}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </>
  );
}
