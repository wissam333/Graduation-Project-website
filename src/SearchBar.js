import { useEffect, useMemo, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import api from './api';

function SearchBar() {
    const hasFetched = useRef(false);
    const [items, setItems] = useState([]);
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(false);

    const getItems = async () => {
        setLoading(true);
        try {
            const response = await api.get('/products');
            setItems(response.data.products||[]);
        } catch (error) {
            console.error("Failed to fetch products:", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredItems = useMemo(() => {
        if (!query) return [];
        const visited = new Set();
        return items.filter(item => {
            const match = item.title.toLowerCase().startsWith(query.toLowerCase());
            if (match && !visited.has(item.title)) {
                visited.add(item.title);
                return true;
            }
            return false;
        });
    }, [query, items]);

    const handleInputChange = (e) => {
        const value = e.target.value;
        setQuery(value);
        const dropdown = e.currentTarget.nextElementSibling;
        if (dropdown) {
            dropdown.style.visibility = value ? 'visible' : 'hidden';
        }
    };

    const handleClickOutside = (e) => {
        const dropdowns = document.getElementsByClassName('filtered-items');
        for (let i = 0; i < dropdowns.length; i++) {
            if (!dropdowns[i].contains(e.target)) {
                dropdowns[i].style.visibility = 'hidden';
            }
        }
    };

    useEffect(() => {
        window.addEventListener("click", handleClickOutside);
        return () => {
            window.removeEventListener("click", handleClickOutside);
        };
    }, []);

    useEffect(() => {
        if (hasFetched.current || items.length > 0) return;
        getItems();
        hasFetched.current = true;
    }, [items.length]);

    return (
        <div className="search-bar">
            <input 
                type="search"
                placeholder="Search products"
                className="search-bar-input"
                value={query}
                onChange={handleInputChange}
            />
            <div className="filtered-items">
                {loading ? (
                    <div>Loading...</div>
                ) : (
                    filteredItems.map(item => (
                        <NavLink 
                            key={`${item.category}-${item.id}`} 
                            to={`/myfood/categories/${item.categoryId}/${item._id}`}
                            onClick={() => {
                                setQuery('');
                                const dropdowns = document.getElementsByClassName('filtered-items');
                                for (let i = 0; i < dropdowns.length; i++) {
                                    dropdowns[i].style.visibility = 'hidden';
                                }
                            }}
                        >
                            {item.title}
                        </NavLink>
                    ))
                )}
            </div>
        </div>
    );
}

export default SearchBar;
