import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Home from './Home';
import Category from './Category';
import Product from './Product';
import Register from './Register';
import Payment from './Payment';
import Categories from './Categories';
import Notfound from './Notfound';
import NavigationBarLoggedIn from './NavigationBarLoggedIn';
import Login from './Login';
import HomeLoggedIn from './HomeLoggedIn';
import About from './About';
import Reviews from './Reviews';
import NavigationBar from './NavigateBar';
import api from './api';
import { getCurrentUser } from './auth';
import RestaurantCategories from './restaurantCategories';
import History from './History';
function App() {
  const [user, setUser] = useState(undefined); // start as undefined
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    try {
      const user = getCurrentUser();
      setUser(user);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
    const interval = setInterval(checkAuth, 300000); // every 5 minutes
    return () => clearInterval(interval);
  }, []);

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
      localStorage.removeItem('user');
      localStorage.removeItem('accessToken');
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (loading) return null; // prevent early redirect flicker

  return (
    <div>
      <link href='https://fonts.googleapis.com/css?family=Roboto' rel='stylesheet'></link>
      <BrowserRouter>
        <Routes>
          <Route path='/myfood/register' element={<Register />} />
          <Route path='/myfood/login' element={<Login onLoginSuccess={checkAuth} />} />
          
          <Route
          index
            path='/myfood'
            element={user ? <HomeLoggedIn user={user} onLogout={handleLogout} /> : <Home />}
          />

          <Route element={user ? <NavigationBarLoggedIn user={user} onLogout={handleLogout} /> : <NavigationBar />}>
            <Route path='/myfood/about-us' element={<About />} />
            <Route
              path='/myfood/reviews'
              element={user ? <Navigate to="/myfood" replace /> : <Reviews />}
            />
          </Route>
          <Route path="/myfood/history" element={user? <History></History>:<Navigate to='/myfood/login' replace />} />
          <Route element={<NavigationBarLoggedIn user={user} onLogout={handleLogout} />}>
            <Route path='/myfood/categories'>
              <Route
                index
                element={user ? <Categories user={user} /> : <Navigate to='/myfood/login' replace />}
              />
              <Route path=':category'>
                <Route
                  index
                  element={user ? <Category user={user} /> : <Navigate to='/myfood/login' replace />}
                />
                <Route
                  path=':product'
                  element={user ? <Product user={user} /> : <Navigate to='/myfood/login' replace />}
                />
              </Route>
            </Route>

            <Route
              path='/myfood/payment'
              element={user ? <Payment user={user} /> : <Navigate to='/myfood/login' replace />}
            />
          </Route>

          <Route path="/restaurant/:restaurantId" element={<RestaurantCategories />} />
          <Route path='*' element={<Notfound />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
