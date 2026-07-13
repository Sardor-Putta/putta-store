import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AIStylist from './components/AIStylist';
import Cart from './components/Cart';
import Home from './pages/Home';
import Shop from './pages/Shop';
import Collections from './pages/Collections';
import About from './pages/About';
import ProductDetail from './pages/ProductDetail';
import Checkout from './pages/Checkout';
import Shipping from './pages/Shipping';
import FAQ from './pages/FAQ';
import Contact from './pages/Contact';
import SizeGuide from './pages/SizeGuide';
import { CartProvider } from './context/CartContext';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const App: React.FC = () => {
  return (
    <CartProvider>
      <Router>
        <ScrollToTop />
        <div className="bg-neutral-950 min-h-screen text-white font-sans selection:bg-white selection:text-black">
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/collections" element={<Collections />} />
              <Route path="/about" element={<About />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/shipping-returns" element={<Shipping />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/size-guide" element={<SizeGuide />} />
            </Routes>
          </main>
          <AIStylist />
          <Cart />
          <Footer />
        </div>
      </Router>
    </CartProvider>
  );
};

export default App;