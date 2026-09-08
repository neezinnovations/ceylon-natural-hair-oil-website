import { useState } from "react";

import Header from "./components/Header";
import Hero from "./components/Hero";
import Products from "./components/Products";
import IngredientExperience from "./components/IngredientExperience";
import CareFeatures from "./components/CareFeatures";
import Benefits from "./components/Benefits";
import About from "./components/About";
import Routine from "./components/Routine";
import FAQ from "./components/FAQ";
import Footer from "./components/Footer";
import StickyBuyBar from "./components/StickyBuyBar";
import SplashScreen from "./components/SplashScreen";

import { product } from "./data/siteData";
import { useCart } from "./context/CartContext";

export default function App() {
  const { addItem } = useCart();

  const [showSplash, setShowSplash] = useState(true);

  function addProduct() {
    addItem(
      {
        productId: product.productId,
        name: product.name,
        size: product.size,
        price: product.price,
        imageUrl: product.imageUrl,
      },
      1
    );
  }

  return (
    <>
      {showSplash && (
        <SplashScreen
          onFinish={() => setShowSplash(false)}
        />
      )}

      <div className="lux-site">
        <Header />

        <main>
          {/* =================================================
              HERO
          ================================================= */}
          <Hero onAddToCart={addProduct} />

          {/* =================================================
              PRODUCT
          ================================================= */}
          <Products onAddToCart={addProduct} />

          {/* =================================================
              INGREDIENTS
          ================================================= */}
          <IngredientExperience />

          {/* =================================================
              WHY LACEYLON / CARE FEATURES
          ================================================= */}
          <CareFeatures />

          {/* =================================================
              PRODUCT BENEFITS — NEW
          ================================================= */}
          <Benefits />

          {/* =================================================
              OUR STORY
          ================================================= */}
          <About />

          {/* =================================================
              ROUTINE
          ================================================= */}
          <Routine />

          {/* =================================================
              FAQ
          ================================================= */}
          <FAQ />
        </main>

        <Footer />

        <StickyBuyBar
          onAddToCart={addProduct}
        />
      </div>
    </>
  );
}