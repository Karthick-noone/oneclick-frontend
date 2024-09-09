import React from 'react';
// import Header1 from './components/Header1';
import Header2 from './components/Header2';
// import Header3 from './components/Header3';
import ProductList from './components/productlist';
import Footer from './components/footer';
import Homepage from './components/Homepage';
import FeaturesCard from './components/FeaturesCard';
import ShopByCategory from './components/ShopByCategory';
import AdPage from './components/AdPage';
import './styles.css';
import FullAdPage from './components/FullAdPage';
import BrandsPage from './components/BrandsPage';

const Main = () => {
    return (
        <div>
            {/* <Header1 /> */}
            <Header2 />
            {/* <Header3 /> */}
            <Homepage />
            <FeaturesCard />
            <AdPage />
            <ShopByCategory />
            <FullAdPage />
            <ProductList />
            <BrandsPage />
            
            <Footer />
        </div>
    );
};

export default Main;
