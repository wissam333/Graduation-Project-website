import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BarLoader } from "react-spinners";
import { Swiper, SwiperSlide } from "swiper/react";
import { A11y, EffectCube, Navigation, Pagination } from "swiper/modules";
import api from './api';
import './styles/categories.css';
import { getCurrentUser } from './auth';

function Categories() {
    const navigate = useNavigate();
    const { category: currentCategory } = useParams();
    const count = useRef(false);
    const [done, setDone] = useState(false);
    const [categories, setCategories] = useState([]);

    const user = getCurrentUser();

    useEffect(() => {
        if (!user) return; // Don't fetch anything if no user

        if (count.current) return;
        count.current = true;

        const getCategories = async () => {
            try {
                const response = await api.get('/category/');
                setCategories(response.data || []);
            } catch (error) {
                console.error("Failed to fetch categories:", error);
            } finally {
                setDone(true);
            }
        };

        getCategories();
    }, [currentCategory, user]);

    // If user is not logged in, do not render the component
    if (!user) return null;

    return (
        <div>
            {!done ? (
                <div className="ReactLoading">
                    <BarLoader color="rgb(81, 216, 115)" width={100} />
                </div>
            ) : (
                <div className="swiper" id="categories">
                    <Swiper
                        modules={[Navigation, Pagination, A11y, EffectCube]}
                        slidesPerView={"auto"}
                        navigation
                        pagination={{ clickable: true }}
                    >
                        {categories.map(c => (
  <SwiperSlide className="categories-slide" key={c._id}>
    <div
      style={{
        border: c._id === currentCategory ? '2px solid #FC4866' : 'none',
        borderRadius: '8px',
        padding: '5px',
        transition: 'border 0.3s ease',
      }}
    >
      <a
        onClick={() => {
          if (currentCategory) {
            navigate(`../${c._id}`);
          } else {
            navigate(`${c._id}`);
          }
        }}
        style={{ cursor: "pointer" }}
      >
        <img src={c.img} alt={c.name} />
        {c.name} <b></b>
      </a>
      <div>
        by:{" "}
        <span
          onClick={() => navigate(`/restaurant/${c.restaurant._id}`)}
          style={{ color: "#FC4866", fontWeight: "bold", cursor: "pointer", textDecoration: "underline" }}
        >
          {c.restaurant.name}
        </span>
      </div>
    </div>
  </SwiperSlide>
))}
                    </Swiper>
                </div>
            )}
        </div>
    );
}

export default Categories;
