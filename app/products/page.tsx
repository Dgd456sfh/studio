
"use client";
import Sidebar from "@/components/Sidebar";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Plus,
  RefreshCw,
  Search,
  Sparkles,
  Package,
  ArrowUpRight,
  LayoutGrid,
  ImageIcon,
} from "lucide-react";

type Product = {
  _id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  async function fetchProducts() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/products");
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to load products");
      }

      setProducts(data.products || []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="castle-page">
      <Sidebar />
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />
      <div className="ambient ambient-three" />
      <div className="grain" />

      <div className="products-content">
        <header className="topbar">
          <div className="brand">
            <div className="brand-icon">
              <Sparkles size={19} />
            </div>
            <span>atelier<span className="brand-dot">.</span>studio</span>
          </div>

          <div className="topbar-right">
            <span className="collection-label">
              <span className="live-dot" />
              YOUR CREATIVE SPACE
            </span>
            <button
              className="refresh-button"
              onClick={fetchProducts}
              title="Refresh products"
            >
              <RefreshCw size={16} />
            </button>
          </div>
        </header>

        <section className="hero">
          <div className="hero-copy">
            <div className="eyebrow">
              <span className="eyebrow-line" />
              THE PRODUCT GALLERY
            </div>

            <h1>
              A little space
              <br />
              for <span>beautiful things.</span>
            </h1>

            <p className="hero-description">
              Your ideas, thoughtfully gathered. Explore your
              collection and let every product tell its story.
            </p>

            <div className="hero-actions">
              <Link href="/dashboard" className="add-button">
                <Plus size={17} />
                Add a product
                <ArrowUpRight size={15} />
              </Link>
              <span className="collection-count">
                <span>{products.length.toString().padStart(2, "0")}</span>
                &nbsp; ITEMS IN YOUR COLLECTION
              </span>
            </div>
          </div>

          <div className="hero-art">
            <div className="sun-glow" />
            <div className="sun-disc" />
            <div className="art-orbit orbit-one" />
            <div className="art-orbit orbit-two" />
            <div className="art-arch arch-back" />
            <div className="art-arch arch-front" />
            <div className="art-pedestal" />
            <div className="art-vase">
              <div className="vase-neck" />
              <div className="vase-body" />
            </div>
            <div className="art-leaf leaf-one" />
            <div className="art-leaf leaf-two" />
            <div className="art-leaf leaf-three" />
            <div className="art-sparkle sparkle-one">✳</div>
            <div className="art-sparkle sparkle-two">✦</div>
            <div className="art-sparkle sparkle-three">✧</div>
            <span className="art-caption">Curated with care</span>
          </div>
        </section>

        <section className="collection-section">
          <div className="section-heading">
            <div>
              <div className="section-kicker">THE COLLECTION</div>
              <h2>Collected treasures<span>.</span></h2>
            </div>
            <div className="section-tools">
              <div className="search-box">
                <Search size={16} />
                <input
                  type="text"
                  placeholder="Find something..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                {search && (
                  <button onClick={() => setSearch("")}>×</button>
                )}
              </div>
              <div className="grid-indicator">
                <LayoutGrid size={17} />
              </div>
            </div>
          </div>

          {loading ? (
            <div className="empty-state">
              <div className="loading-orbit">
                <Sparkles size={24} />
              </div>
              <p>Gathering your collection...</p>
            </div>
          ) : error ? (
            <div className="empty-state">
              <Package size={34} />
              <h3>Something went wrong</h3>
              <p>{error}</p>
              <button className="retry-button" onClick={fetchProducts}>
                <RefreshCw size={15} /> Try again
              </button>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">
                {search ? <Search size={28} /> : <ImageIcon size={28} />}
              </div>
              <h3>{search ? "No matching treasures" : "A blank canvas"}</h3>
              <p>
                {search
                  ? "Try another search to find your product."
                  : "Your collection is waiting for its first beautiful addition."}
              </p>
              {!search && (
                <Link href="/dashboard" className="add-button">
                  <Plus size={16} /> Add your first product
                </Link>
              )}
            </div>
          ) : (
            <div className="product-grid">
              {filteredProducts.map((product, index) => (
                <article
                  key={product._id}
                  className="product-card"
                  style={{ animationDelay: `${index * 90}ms` }}
                >
                  <div className="w-full h-64 bg-white flex items-center justify-center">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="product-image"
                    />
                    <div className="image-shade" />
                    <span className="product-number">
                      No. {String(index + 1).padStart(2, "0")}
                    </span>
                    <div className="image-corner-icon">
                      <ArrowUpRight size={17} />
                    </div>
                  </div>

                  <div className="product-details">
                    <div className="product-title-row">
                      <h3>{product.name}</h3>
                      <span className="product-price">
                        ₹{Number(product.price).toLocaleString("en-IN")}
                      </span>
                    </div>
                    <p className="product-description">
                      {product.description || "A lovely addition to your collection."}
                    </p>
                    <div className="product-card-footer">
                      <span className="product-tag">
                        <span className="tag-dot" />
                        YOUR CREATION
                      </span>
                      <span className="view-label">
                        IN COLLECTION <ArrowUpRight size={12} />
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <footer className="page-footer">
          <span>MADE FOR YOUR IMAGINATION <span className="footer-star">✳</span></span>
          <span>AI PRODUCT STUDIO · 2026</span>
        </footer>
      </div>

      <style jsx global>{`
        * {
          box-sizing: border-box;
        }

        .castle-page {
          --cream: #f8f1e8;
          --paper: #fffaf3;
          --ink: #49362e;
          --muted: #a18c7d;
          --terracotta: #b96f53;
          --rose: #d8a58e;
          --line: rgba(117, 79, 57, 0.13);
          position: relative;
          isolation: isolate;
          min-height: 100vh;
          overflow: hidden;
          background: #f7efe5;
          color: var(--ink);
          font-family: Arial, Helvetica, sans-serif;
        }

        .products-content {
          position: relative;
          z-index: 2;
          width: calc(100% - 280px);
          margin-left: 280px;
          padding: 0 5.5% 25px;
          min-height: 100vh;
        }

        .ambient {
          position: absolute;
          z-index: -1;
          border-radius: 50%;
          filter: blur(3px);
          pointer-events: none;
          animation: floatAmbient 13s ease-in-out infinite alternate;
        }

        .ambient-one {
          width: 420px;
          height: 420px;
          top: 3%;
          left: 17%;
          background: radial-gradient(circle, rgba(222, 166, 130, .27), transparent 70%);
        }

        .ambient-two {
          width: 550px;
          height: 550px;
          right: -150px;
          top: 28%;
          background: radial-gradient(circle, rgba(194, 128, 105, .17), transparent 70%);
          animation-delay: -5s;
        }

        .ambient-three {
          width: 450px;
          height: 450px;
          left: 24%;
          bottom: -200px;
          background: radial-gradient(circle, rgba(232, 197, 157, .32), transparent 70%);
          animation-delay: -8s;
        }

        .grain {
          position: absolute;
          z-index: -1;
          inset: 0;
          pointer-events: none;
          opacity: .14;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.15'/%3E%3C/svg%3E");
        }

        .topbar {
          height: 88px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid var(--line);
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 11px;
          color: #60483b;
          font-family: Georgia, serif;
          font-size: 20px;
          letter-spacing: -.7px;
          font-weight: 600;
        }

        .brand-icon {
          width: 35px;
          height: 35px;
          display: grid;
          place-items: center;
          border-radius: 12px;
          color: #fff8ee;
          background: #a9674f;
          box-shadow: 0 5px 16px rgba(140, 82, 57, .2);
        }

        .brand-dot, .section-heading h2 span {
          color: #bd795b;
        }

        .topbar-right {
          display: flex;
          align-items: center;
          gap: 17px;
        }

        .collection-label, .collection-count, .section-kicker,
        .eyebrow, .product-tag, .view-label, .page-footer {
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 1.6px;
        }

        .collection-label {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #9b8170;
        }

        .live-dot, .tag-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #9d9e70;
          box-shadow: 0 0 0 4px rgba(157, 158, 112, .12);
        }

        .refresh-button, .grid-indicator {
          width: 37px;
          height: 37px;
          display: grid;
          place-items: center;
          border: 1px solid var(--line);
          border-radius: 12px;
          color: #8c6a58;
          background: rgba(255, 250, 243, .65);
          cursor: pointer;
          transition: transform .25s, background .25s;
        }

        .refresh-button:hover {
          transform: rotate(35deg);
          background: #fffaf3;
        }

        .hero {
          min-height: 350px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          padding: 45px 0 38px;
          border-bottom: 1px solid var(--line);
        }

        .hero-copy {
          position: relative;
          z-index: 2;
          max-width: 550px;
        }

        .eyebrow {
          display: flex;
          align-items: center;
          gap: 10px;
          color: #a16c53;
          margin-bottom: 19px;
        }

        .eyebrow-line {
          display: inline-block;
          width: 27px;
          height: 1px;
          background: #b47a5d;
        }

        .hero h1 {
          margin: 0;
          color: #4c382e;
          font-family: Georgia, 'Times New Roman', serif;
          font-size: clamp(39px, 4.3vw, 62px);
          line-height: 1.06;
          font-weight: 400;
          letter-spacing: -2.5px;
        }

        .hero h1 span {
          color: #b97557;
          font-style: italic;
        }

        .hero-description {
          max-width: 385px;
          margin: 18px 0 25px;
          color: #927c6e;
          font-family: Georgia, serif;
          font-size: 14px;
          line-height: 1.8;
        }

        .hero-actions {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 18px;
        }

        .add-button {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 13px 17px;
          border: 1px solid #a6664e;
          border-radius: 9px;
          color: #fff9f2;
          background: #a6664e;
          box-shadow: 0 7px 17px rgba(146, 83, 57, .15);
          font-size: 12px;
          font-weight: 600;
          text-decoration: none;
          transition: transform .25s, box-shadow .25s, background .25s;
        }

        .add-button:hover {
          transform: translateY(-3px);
          background: #92583f;
          box-shadow: 0 12px 23px rgba(146, 83, 57, .2);
        }

        .collection-count {
          color: #a18b7b;
          font-size: 8px;
          letter-spacing: 1px;
        }

        .collection-count span {
          color: #815a46;
          font-family: Georgia, serif;
          font-size: 17px;
          font-weight: 400;
          letter-spacing: 0;
        }

        .hero-art {
          position: relative;
          flex: 0 1 310px;
          height: 275px;
          min-width: 200px;
          overflow: hidden;
          border: 1px solid rgba(160, 110, 80, .13);
          border-radius: 48% 48% 14px 14px;
          background: linear-gradient(155deg, #f0d7bf, #f6e5d2 54%, #d8a68d);
          box-shadow: inset 0 0 50px rgba(255, 251, 238, .35);
        }

        .sun-glow {
          position: absolute;
          top: 15px;
          right: 20px;
          width: 180px;
          height: 180px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(255, 246, 212, .75), transparent 70%);
          animation: glowPulse 5s ease-in-out infinite alternate;
        }

        .sun-disc {
          position: absolute;
          top: 31px;
          right: 56px;
          width: 91px;
          height: 91px;
          border-radius: 50%;
          background: linear-gradient(145deg, #f9d9a8, #d9a06f);
          box-shadow: 0 0 45px rgba(255, 227, 174, .5);
        }

        .art-orbit {
          position: absolute;
          border: 1px solid rgba(255, 247, 225, .55);
          border-radius: 50%;
          transform: rotate(-28deg);
        }

        .orbit-one {
          width: 235px;
          height: 110px;
          top: 38px;
          left: 40px;
          animation: orbitTurn 24s linear infinite;
        }

        .orbit-two {
          width: 275px;
          height: 150px;
          top: 18px;
          left: 13px;
          transform: rotate(33deg);
          border-color: rgba(176, 111, 76, .2);
          animation: orbitTurn 30s linear infinite reverse;
        }

        .art-arch {
          position: absolute;
          bottom: 28px;
          border-radius: 90px 90px 0 0;
        }

        .arch-back {
          right: 17px;
          width: 115px;
          height: 155px;
          background: rgba(191, 125, 94, .42);
          border: 1px solid rgba(255, 241, 217, .35);
        }

        .arch-front {
          right: 38px;
          width: 95px;
          height: 128px;
          background: linear-gradient(140deg, #c28a6b, #a86b54);
          box-shadow: inset 7px 0 14px rgba(255, 224, 186, .18);
        }

        .art-pedestal {
          position: absolute;
          bottom: 27px;
          left: 27px;
          width: 140px;
          height: 17px;
          border-radius: 3px;
          background: #bd896c;
          box-shadow: 0 10px 16px rgba(116, 71, 47, .16);
        }

        .art-vase {
          position: absolute;
          bottom: 44px;
          left: 69px;
          width: 59px;
          height: 85px;
          animation: vaseFloat 4s ease-in-out infinite;
        }

        .vase-neck {
          position: absolute;
          top: 0;
          left: 21px;
          width: 18px;
          height: 23px;
          border-radius: 5px 5px 2px 2px;
          background: #7e6754;
        }

        .vase-body {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 59px;
          height: 68px;
          border-radius: 40% 40% 43% 43%;
          background: linear-gradient(105deg, #d5b69a, #9d7a61);
          box-shadow: inset 8px 0 12px rgba(255, 243, 220, .3),
            5px 8px 12px rgba(112, 75, 52, .13);
        }

        .art-leaf {
          position: absolute;
          width: 25px;
          height: 55px;
          border-radius: 100% 0 100% 0;
          background: linear-gradient(135deg, #879078, #58674f);
          transform-origin: bottom center;
          bottom: 121px;
          left: 94px;
          animation: leafSway 4s ease-in-out infinite alternate;
        }

        .leaf-one { transform: rotate(-38deg); }
        .leaf-two {
          height: 62px;
          left: 91px;
          transform: rotate(22deg);
          animation-delay: -1.5s;
        }
        .leaf-three {
          height: 47px;
          left: 90px;
          transform: rotate(58deg);
          animation-delay: -2s;
        }

        .art-sparkle {
          position: absolute;
          color: rgba(255, 249, 225, .9);
          animation: twinkle 3s ease-in-out infinite;
        }

        .sparkle-one { top: 53px; left: 41px; font-size: 20px; }
        .sparkle-two { top: 112px; right: 33px; font-size: 18px; animation-delay: -1s; }
        .sparkle-three { top: 28px; left: 138px; font-size: 16px; animation-delay: -2s; }

        .art-caption {
          position: absolute;
          bottom: 11px;
          right: 13px;
          color: rgba(255, 249, 232, .8);
          font-family: Georgia, serif;
          font-size: 10px;
          font-style: italic;
          letter-spacing: .3px;
        }

        .collection-section {
          padding: 37px 0 55px;
        }

        .section-heading {
          display: flex;
          align-items: end;
          justify-content: space-between;
          gap: 15px;
          margin-bottom: 25px;
        }

        .section-kicker {
          margin-bottom: 8px;
          color: #ad7b60;
          font-size: 8px;
        }

        .section-heading h2 {
          margin: 0;
          color: #503c31;
          font-family: Georgia, serif;
          font-size: clamp(25px, 2.5vw, 34px);
          font-weight: 400;
          letter-spacing: -.8px;
        }

        .section-tools {
          display: flex;
          align-items: center;
          gap: 9px;
        }

        .search-box {
          width: 190px;
          height: 38px;
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 0 11px;
          border: 1px solid rgba(139, 99, 73, .15);
          border-radius: 10px;
          color: #a78d7b;
          background: rgba(255, 251, 244, .75);
          transition: border-color .2s, box-shadow .2s;
        }

        .search-box:focus-within {
          border-color: rgba(177, 112, 81, .55);
          box-shadow: 0 0 0 3px rgba(177, 112, 81, .07);
        }

        .search-box input {
          width: 100%;
          min-width: 0;
          border: 0;
          outline: 0;
          color: #614839;
          background: transparent;
          font-size: 11px;
        }

        .search-box input::placeholder {
          color: #b5a193;
        }

        .search-box button {
          border: 0;
          color: #9d806e;
          background: transparent;
          font-size: 18px;
          cursor: pointer;
        }

        .grid-indicator {
          cursor: default;
          background: rgba(255, 250, 243, .6);
        }

        .product-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 20px;
        }

        .product-card {
          min-width: 0;
          overflow: hidden;
          border: 1px solid rgba(141, 99, 73, .13);
          border-radius: 14px;
          background: rgba(255, 251, 245, .78);
          box-shadow: 0 8px 22px rgba(97, 66, 44, .045);
          animation: cardReveal .65s both;
          transition: transform .3s ease, box-shadow .3s ease,
            border-color .3s ease;
        }

        .product-card:hover {
          transform: translateY(-7px);
          border-color: rgba(171, 112, 82, .35);
          box-shadow: 0 17px 35px rgba(97, 66, 44, .11);
        }

        .product-image-wrap {
          position: relative;
          height: 205px;
          overflow: hidden;
          background: #eee0d0;
        }

        .product-image {
          width: 100%;
          height: 100%;
          display: block;
          object-fit: cover;
          transition: transform .7s cubic-bezier(.2,.7,.2,1);
        }

        .product-card:hover .product-image {
          transform: scale(1.07);
        }

        .image-shade {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(55, 37, 27, .18), transparent 35%, transparent);
          pointer-events: none;
        }

        .product-number {
          position: absolute;
          top: 12px;
          left: 12px;
          padding: 6px 9px;
          border: 1px solid rgba(255,255,255,.35);
          border-radius: 6px;
          color: #fffaf4;
          background: rgba(75, 55, 43, .32);
          backdrop-filter: blur(9px);
          font-size: 8px;
          letter-spacing: 1px;
        }

        .image-corner-icon {
          position: absolute;
          right: 12px;
          bottom: 12px;
          width: 31px;
          height: 31px;
          display: grid;
          place-items: center;
          border: 1px solid rgba(255,255,255,.5);
          border-radius: 50%;
          color: white;
          background: rgba(68, 48, 36, .28);
          backdrop-filter: blur(8px);
          transition: background .2s, transform .2s;
        }

        .product-card:hover .image-corner-icon {
          background: #a6664e;
          transform: rotate(45deg);
        }

        .product-details {
          padding: 16px 16px 13px;
        }

        .product-title-row {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          gap: 8px;
        }

        .product-title-row h3 {
          min-width: 0;
          overflow: hidden;
          margin: 0;
          color: #594235;
          font-family: Georgia, serif;
          font-size: 17px;
          font-weight: 400;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .product-price {
          flex-shrink: 0;
          color: #ac6c50;
          font-family: Georgia, serif;
          font-size: 15px;
        }

        .product-description {
          display: -webkit-box;
          min-height: 34px;
          overflow: hidden;
          margin: 8px 0 13px;
          color: #9d8879;
          font-family: Georgia, serif;
          font-size: 11px;
          line-height: 1.6;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
        }

        .product-card-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 6px;
          padding-top: 11px;
          border-top: 1px solid rgba(141, 99, 73, .11);
        }

        .product-tag {
          display: flex;
          align-items: center;
          gap: 7px;
          color: #a18b79;
          font-size: 7px;
          letter-spacing: 1px;
        }

        .tag-dot {
          width: 5px;
          height: 5px;
          box-shadow: none;
          background: #b47d62;
        }

        .view-label {
          display: flex;
          align-items: center;
          gap: 4px;
          color: #b18a72;
          font-size: 7px;
          letter-spacing: .7px;
        }

        .empty-state {
          min-height: 260px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 12px;
          padding: 30px;
          border: 1px dashed rgba(150, 104, 75, .25);
          border-radius: 15px;
          color: #a88a77;
          background: rgba(255, 250, 243, .45);
          text-align: center;
        }

        .empty-icon, .loading-orbit {
          width: 60px;
          height: 60px;
          display: grid;
          place-items: center;
          border: 1px solid rgba(168, 112, 80, .17);
          border-radius: 50%;
          color: #b27b5c;
          background: rgba(223, 185, 155, .17);
        }

        .loading-orbit {
          animation: loadingSpin 3s linear infinite;
        }

        .empty-state h3 {
          margin: 0;
          color: #624839;
          font-family: Georgia, serif;
          font-size: 22px;
          font-weight: 400;
        }

        .empty-state p {
          margin: 0;
          color: #a18a7b;
          font-family: Georgia, serif;
          font-size: 13px;
        }

        .retry-button {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 6px;
          padding: 10px 15px;
          border: 1px solid rgba(165, 104, 75, .3);
          border-radius: 8px;
          color: #996449;
          background: #fff9f0;
          cursor: pointer;
        }

        .page-footer {
          display: flex;
          justify-content: space-between;
          gap: 10px;
          padding: 17px 0;
          border-top: 1px solid var(--line);
          color: #b09a89;
          font-size: 7px;
          letter-spacing: 1.3px;
        }

        .footer-star {
          margin-left: 5px;
          color: #bb7857;
        }

        @keyframes floatAmbient {
          from { transform: translate3d(-15px, -10px, 0) scale(.95); }
          to { transform: translate3d(28px, 30px, 0) scale(1.12); }
        }

        @keyframes glowPulse {
          from { opacity: .65; transform: scale(.95); }
          to { opacity: 1; transform: scale(1.1); }
        }

        @keyframes orbitTurn {
          from { rotate: 0deg; }
          to { rotate: 360deg; }
        }

        @keyframes vaseFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }

        @keyframes leafSway {
          from { rotate: -7deg; }
          to { rotate: 7deg; }
        }

        @keyframes twinkle {
          0%, 100% { opacity: .4; transform: scale(.8); }
          50% { opacity: 1; transform: scale(1.2); }
        }

        @keyframes cardReveal {
          from { opacity: 0; transform: translateY(18px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes loadingSpin {
          to { transform: rotate(360deg); }
        }

        @media (max-width: 1100px) {
          .products-content {
            width: calc(100% - 250px);
            margin-left: 250px;
            padding-left: 4%;
            padding-right: 4%;
          }

          .product-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .hero-art {
            flex-basis: 250px;
          }
        }

        @media (max-width: 760px) {
          .products-content {
            width: 100%;
            margin-left: 0;
            padding: 0 20px 20px;
          }

          .topbar {
            height: 70px;
          }

          .collection-label {
            display: none;
          }

          .hero {
            min-height: auto;
            padding: 42px 0 30px;
          }

          .hero h1 {
            font-size: clamp(38px, 9vw, 55px);
          }

          .hero-art {
            display: none;
          }

          .hero-description {
            max-width: 100%;
          }

          .section-heading {
            align-items: flex-start;
            flex-direction: column;
          }

          .section-tools {
            width: 100%;
          }

          .search-box {
            flex: 1;
            width: auto;
          }

          .product-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 12px;
          }

          .product-image-wrap {
            height: 160px;
          }

          .product-details {
            padding: 12px;
          }

          .product-title-row {
            align-items: flex-start;
            flex-direction: column;
            gap: 4px;
          }

          .product-title-row h3 {
            max-width: 100%;
            font-size: 15px;
          }

          .product-price {
            font-size: 14px;
          }

          .view-label {
            display: none;
          }
        }

        @media (max-width: 390px) {
          .product-grid {
            grid-template-columns: 1fr;
          }

          .product-image-wrap {
            height: 220px;
          }

          .hero-actions {
            align-items: flex-start;
            flex-direction: column;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .castle-page *,
          .castle-page *::before,
          .castle-page *::after {
            animation-duration: .01ms !important;
            animation-iteration-count: 1 !important;
            scroll-behavior: auto !important;
            transition-duration: .01ms !important;
          }
        }
      `}</style>
    </main>
  );
}