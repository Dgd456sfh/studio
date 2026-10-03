
"use client";
import Sidebar from "@/components/Sidebar";
import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Plus,
  Upload,
  ImagePlus,
  Sparkles,
  ArrowUpRight,
  Package,
  CheckCircle2,
  Loader2,
  X,
  Images,
} from "lucide-react";

export default function DashboardPage() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [productCount, setProductCount] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setProductCount(data.products.length);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!image) {
      setPreview("");
      return;
    }

    const url = URL.createObjectURL(image);
    setPreview(url);

    return () => URL.revokeObjectURL(url);
  }, [image]);

  function handleImageChange(file: File | null) {
    setError("");
    setMessage("");

    if (!file) {
      setImage(null);
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError("Please select an image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be smaller than 5 MB.");
      return;
    }

    setImage(file);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!image) {
      setError("Please select a product image.");
      return;
    }

    if (!name.trim() || price === "" || Number(price) < 0) {
      setError("Please enter a valid product name and price.");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", name.trim());
      formData.append("description", description.trim());
      formData.append("price", price);
      formData.append("image", image);

      // Temporary demo ID for local testing only.
      formData.append("userId", "000000000000000000000001");

      const response = await fetch("/api/products", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Product upload failed.");
      }

      setMessage("Your product has been added to your collection!");
      setName("");
      setDescription("");
      setPrice("");
      setImage(null);
      setProductCount((count) => count === null ? null : count + 1);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="studio-page">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />
      <div className="ambient ambient-three" />
      <div className="grain" />

      <Sidebar />
<div className="studio-content">
        <header className="topbar">
          <Link href="/products" className="brand">
            <div className="brand-icon">
              <Sparkles size={19} />
            </div>
            <span>atelier<span className="brand-dot">.</span>studio</span>
          </Link>

          <div className="topbar-right">
            <span className="collection-label">
              <span className="live-dot" />
              YOUR CREATIVE SPACE
            </span>
            <Link href="/products" className="top-link">
              <Images size={15} />
              My Collection
              <ArrowUpRight size={13} />
            </Link>
          </div>
        </header>

        <section className="hero">
          <div className="hero-copy">
            <div className="eyebrow">
              <span className="eyebrow-line" />
              THE CREATIVE WORKSHOP
            </div>

            <h1>
              Bring your ideas
              <br />
              to <span>life.</span>
            </h1>

            <p className="hero-description">
              Every beautiful creation starts somewhere.
              Make this your little corner to create, curate
              and showcase your products.
            </p>

            <div className="hero-bottom">
              <div className="hero-stat">
                <div className="stat-icon"><Package size={17} /></div>
                <div>
                  <strong>{productCount === null ? "—" : productCount.toString().padStart(2, "0")}</strong>
                  <span>PRODUCTS CREATED</span>
                </div>
              </div>
              <div className="hero-divider" />
              <div className="hero-stat">
                <div className="stat-icon"><Sparkles size={17} /></div>
                <div>
                  <strong>01</strong>
                  <span>CREATIVE STUDIO</span>
                </div>
              </div>
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
            <span className="art-caption">A world of your own</span>
          </div>
        </section>

        <section className="workspace">
          <div className="form-heading">
            <div>
              <div className="section-kicker">LET'S MAKE SOMETHING</div>
              <h2>Add a new treasure<span>.</span></h2>
              <p>Fill in the details and give your product a place in your gallery.</p>
            </div>
            <div className="step-pill">
              <Sparkles size={13} />
              YOUR WORKSHOP
            </div>
          </div>

          <div className="form-layout">
            <form className="product-form" onSubmit={handleSubmit}>
              <div className="form-section-title">
                <span className="section-number">01</span>
                <div>
                  <h3>Product details</h3>
                  <p>Tell us a little about your creation.</p>
                </div>
              </div>

              <div className="field">
                <label htmlFor="product-name">PRODUCT NAME <span>*</span></label>
                <input
                  id="product-name"
                  type="text"
                  placeholder="e.g. Handmade ceramic vase"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="field">
                <label htmlFor="product-description">DESCRIPTION</label>
                <textarea
                  id="product-description"
                  placeholder="Share the story behind your product..."
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
                <span className="field-hint">A few words can make your product memorable.</span>
              </div>

              <div className="field">
                <label htmlFor="product-price">PRICE <span>*</span></label>
                <div className="price-input">
                  <span>₹</span>
                  <input
                    id="product-price"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                  />
                  <span className="currency-label">INR</span>
                </div>
              </div>

              <div className="form-divider" />

              <div className="form-section-title">
                <span className="section-number">02</span>
                <div>
                  <h3>Product imagery</h3>
                  <p>Let your product shine through its image.</p>
                </div>
              </div>

              <label className={`upload-zone ${preview ? "has-image" : ""}`}>
                {preview ? (
                  <div className="preview-wrap">
                    <img src={preview} alt="Product preview" />
                    <div className="preview-overlay">
                      <span><ImagePlus size={16} /> Change image</span>
                    </div>
                    <button
                      type="button"
                      className="remove-image"
                      aria-label="Remove image"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setImage(null);
                      }}
                    >
                      <X size={15} />
                    </button>
                  </div>
                ) : (
                  <div className="upload-placeholder">
                    <div className="upload-icon"><Upload size={23} /></div>
                    <strong>Drop your image here</strong>
                    <span>or <u>browse files</u> from your device</span>
                    <small>JPG, PNG, WEBP · MAX 5 MB</small>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="file-input"
                  onChange={(e) => handleImageChange(e.target.files?.[0] || null)}
                />
              </label>

              {error && (
                <div className="feedback error-feedback">
                  <X size={16} />
                  {error}
                </div>
              )}

              {message && (
                <div className="feedback success-feedback">
                  <CheckCircle2 size={17} />
                  {message}
                </div>
              )}

              <button
                type="submit"
                className="submit-button"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 size={17} className="spin" />
                    Adding your product...
                  </>
                ) : (
                  <>
                    <Plus size={18} />
                    Add to my collection
                    <ArrowUpRight size={16} />
                  </>
                )}
              </button>

              <p className="secure-note">
                <Sparkles size={12} />
                Your creation will be saved to your product collection.
              </p>
            </form>

            <aside className="side-panel">
              <div className="preview-card">
                <div className="preview-card-top">
                  <span>THE LITTLE PREVIEW</span>
                  <Sparkles size={15} />
                </div>
                <div className="live-preview-image">
                  {preview ? (
                    <img src={preview} alt="Selected product" />
                  ) : (
                    <div className="preview-placeholder">
                      <div className="placeholder-arch">
                        <ImagePlus size={29} />
                      </div>
                      <span>Your image will appear here</span>
                    </div>
                  )}
                </div>
                <div className="live-preview-details">
                  <span className="preview-overline">YOUR NEW CREATION</span>
                  <h3>{name || "Your product name"}</h3>
                  <p>{description || "A little description of your lovely product will appear here."}</p>
                  <div className="preview-price">
                    <span>YOUR PRICE</span>
                    <strong>₹{price ? Number(price).toLocaleString("en-IN") : "0.00"}</strong>
                  </div>
                </div>
              </div>

              <div className="tip-card">
                <div className="tip-icon"><Sparkles size={17} /></div>
                <div>
                  <span className="tip-label">A LITTLE TIP</span>
                  <h4>Beauty is in the details.</h4>
                  <p>Use a clear, well-lit product photo and a thoughtful description to make your creation stand out.</p>
                </div>
              </div>

              <Link href="/products" className="view-collection">
                <div className="view-collection-icon"><Images size={18} /></div>
                <div>
                  <strong>Explore your gallery</strong>
                  <span>See everything you've created</span>
                </div>
                <ArrowUpRight size={17} />
              </Link>
            </aside>
          </div>
        </section>

        <footer className="page-footer">
          <span>MADE FOR YOUR IMAGINATION <span className="footer-star">✳</span></span>
          <span>AI PRODUCT STUDIO · 2026</span>
        </footer>
      </div>

      <style jsx global>{`
        .studio-page {
          --ink: #49362e;
          --muted: #a18c7d;
          --terracotta: #a6664e;
          --line: rgba(117, 79, 57, 0.13);
          position: relative;
          isolation: isolate;
          min-height: 100vh;
          overflow: hidden;
          background: #f7efe5;
          color: var(--ink);
          font-family: Arial, Helvetica, sans-serif;
        }

        .studio-content {
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
          animation: dashFloat 13s ease-in-out infinite alternate;
        }

        .ambient-one {
          width: 420px; height: 420px; top: 3%; left: 17%;
          background: radial-gradient(circle, rgba(222, 166, 130, .27), transparent 70%);
        }

        .ambient-two {
          width: 550px; height: 550px; right: -150px; top: 28%;
          background: radial-gradient(circle, rgba(194, 128, 105, .17), transparent 70%);
          animation-delay: -5s;
        }

        .ambient-three {
          width: 450px; height: 450px; left: 24%; bottom: -200px;
          background: radial-gradient(circle, rgba(232, 197, 157, .32), transparent 70%);
          animation-delay: -8s;
        }

        .grain {
          position: absolute; z-index: -1; inset: 0; pointer-events: none; opacity: .14;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.15'/%3E%3C/svg%3E");
        }

        .topbar {
          height: 88px; display: flex; justify-content: space-between; align-items: center;
          border-bottom: 1px solid var(--line);
        }

        .brand {
          display: flex; align-items: center; gap: 11px; color: #60483b;
          font-family: Georgia, serif; font-size: 20px; letter-spacing: -.7px;
          font-weight: 600; text-decoration: none;
        }

        .brand-icon {
          width: 35px; height: 35px; display: grid; place-items: center;
          border-radius: 12px; color: #fff8ee; background: #a9674f;
          box-shadow: 0 5px 16px rgba(140, 82, 57, .2);
        }

        .brand-dot, .form-heading h2 span { color: #bd795b; }

        .topbar-right { display: flex; align-items: center; gap: 16px; }

        .collection-label, .section-kicker, .eyebrow, .page-footer {
          font-size: 9px; font-weight: 700; letter-spacing: 1.6px;
        }

        .collection-label { display: flex; align-items: center; gap: 8px; color: #9b8170; }

        .live-dot {
          width: 7px; height: 7px; border-radius: 50%; background: #9d9e70;
          box-shadow: 0 0 0 4px rgba(157, 158, 112, .12);
        }

        .top-link {
          display: flex; align-items: center; gap: 7px; padding: 10px 12px;
          border: 1px solid var(--line); border-radius: 9px;
          color: #926b55; background: rgba(255,250,243,.65);
          text-decoration: none; font-size: 11px; transition: .2s;
        }

        .top-link:hover { background: #fffaf3; transform: translateY(-2px); }

        .hero {
          min-height: 315px; display: flex; align-items: center;
          justify-content: space-between; gap: 20px; padding: 37px 0;
          border-bottom: 1px solid var(--line);
        }

        .hero-copy { position: relative; z-index: 2; max-width: 550px; }

        .eyebrow {
          display: flex; align-items: center; gap: 10px; color: #a16c53; margin-bottom: 17px;
        }

        .eyebrow-line { display: inline-block; width: 27px; height: 1px; background: #b47a5d; }

        .hero h1 {
          margin: 0; color: #4c382e; font-family: Georgia, 'Times New Roman', serif;
          font-size: clamp(39px, 4.1vw, 59px); line-height: 1.06;
          font-weight: 400; letter-spacing: -2.5px;
        }

        .hero h1 span { color: #b97557; font-style: italic; }

        .hero-description {
          max-width: 385px; margin: 15px 0 21px; color: #927c6e;
          font-family: Georgia, serif; font-size: 13px; line-height: 1.8;
        }

        .hero-bottom { display: flex; align-items: center; gap: 17px; }

        .hero-stat { display: flex; align-items: center; gap: 9px; }

        .stat-icon {
          width: 34px; height: 34px; display: grid; place-items: center;
          border: 1px solid rgba(160,110,80,.13); border-radius: 10px;
          color: #a66c51; background: rgba(255,250,243,.6);
        }

        .hero-stat div:last-child { display: flex; flex-direction: column; gap: 3px; }

        .hero-stat strong { color: #674b3b; font-family: Georgia,serif; font-size: 17px; font-weight: 400; }

        .hero-stat span { color: #a18b7b; font-size: 7px; font-weight: 700; letter-spacing: .8px; }

        .hero-divider { width: 1px; height: 30px; background: var(--line); }

        .hero-art {
          position: relative; flex: 0 1 280px; height: 250px; min-width: 190px;
          overflow: hidden; border: 1px solid rgba(160,110,80,.13);
          border-radius: 48% 48% 14px 14px;
          background: linear-gradient(155deg,#f0d7bf,#f6e5d2 54%,#d8a68d);
          box-shadow: inset 0 0 50px rgba(255,251,238,.35);
        }

        .sun-glow {
          position: absolute; top: 15px; right: 20px; width: 180px; height: 180px;
          border-radius: 50%; background: radial-gradient(circle,rgba(255,246,212,.75),transparent 70%);
          animation: dashGlow 5s ease-in-out infinite alternate;
        }

        .sun-disc {
          position: absolute; top: 31px; right: 50px; width: 82px; height: 82px;
          border-radius: 50%; background: linear-gradient(145deg,#f9d9a8,#d9a06f);
          box-shadow: 0 0 45px rgba(255,227,174,.5);
        }

        .art-orbit { position: absolute; border: 1px solid rgba(255,247,225,.55); border-radius: 50%; }

        .orbit-one { width: 220px; height: 105px; top: 38px; left: 30px; transform: rotate(-28deg); animation: dashOrbit 24s linear infinite; }
        .orbit-two { width: 250px; height: 140px; top: 18px; left: 10px; transform: rotate(33deg); border-color: rgba(176,111,76,.2); animation: dashOrbit 30s linear infinite reverse; }

        .art-arch { position: absolute; bottom: 25px; border-radius: 90px 90px 0 0; }
        .arch-back { right: 17px; width: 105px; height: 145px; background: rgba(191,125,94,.42); border: 1px solid rgba(255,241,217,.35); }
        .arch-front { right: 37px; width: 88px; height: 120px; background: linear-gradient(140deg,#c28a6b,#a86b54); box-shadow: inset 7px 0 14px rgba(255,224,186,.18); }
        .art-pedestal { position: absolute; bottom: 24px; left: 22px; width: 132px; height: 16px; border-radius: 3px; background: #bd896c; box-shadow: 0 10px 16px rgba(116,71,47,.16); }

        .art-vase { position: absolute; bottom: 40px; left: 61px; width: 57px; height: 81px; animation: dashVase 4s ease-in-out infinite; }
        .vase-neck { position: absolute; top: 0; left: 20px; width: 17px; height: 22px; border-radius: 5px 5px 2px 2px; background: #7e6754; }
        .vase-body { position: absolute; bottom: 0; left: 0; width: 57px; height: 65px; border-radius: 40% 40% 43% 43%; background: linear-gradient(105deg,#d5b69a,#9d7a61); box-shadow: inset 8px 0 12px rgba(255,243,220,.3),5px 8px 12px rgba(112,75,52,.13); }

        .art-leaf {
          position: absolute; width: 24px; height: 53px; border-radius: 100% 0 100% 0;
          background: linear-gradient(135deg,#879078,#58674f);
          transform-origin: bottom center; bottom: 115px; left: 85px;
          animation: dashLeaf 4s ease-in-out infinite alternate;
        }

        .leaf-one { transform: rotate(-38deg); }
        .leaf-two { height: 59px; left: 83px; transform: rotate(22deg); animation-delay: -1.5s; }
        .leaf-three { height: 45px; left: 81px; transform: rotate(58deg); animation-delay: -2s; }

        .art-sparkle { position: absolute; color: rgba(255,249,225,.9); animation: dashTwinkle 3s ease-in-out infinite; }
        .sparkle-one { top: 53px; left: 35px; font-size: 20px; }
        .sparkle-two { top: 105px; right: 28px; font-size: 18px; animation-delay: -1s; }
        .sparkle-three { top: 28px; left: 130px; font-size: 16px; animation-delay: -2s; }

        .art-caption { position: absolute; bottom: 10px; right: 12px; color: rgba(255,249,232,.8); font-family: Georgia,serif; font-size: 10px; font-style: italic; }

        .workspace { padding: 36px 0 55px; }

        .form-heading {
          display: flex; align-items: end; justify-content: space-between;
          gap: 15px; margin-bottom: 24px;
        }

        .section-kicker { margin-bottom: 8px; color: #ad7b60; font-size: 8px; }

        .form-heading h2 {
          margin: 0; color: #503c31; font-family: Georgia,serif;
          font-size: clamp(25px,2.5vw,34px); font-weight: 400; letter-spacing: -.8px;
        }

        .form-heading p { margin: 8px 0 0; color: #9b8575; font-family: Georgia,serif; font-size: 12px; line-height: 1.6; }

        .step-pill {
          display: flex; align-items: center; gap: 7px; flex-shrink: 0;
          padding: 9px 12px; border: 1px solid rgba(160,110,80,.15);
          border-radius: 20px; color: #a16c53; background: rgba(255,250,243,.6);
          font-size: 8px; font-weight: 700; letter-spacing: 1px;
        }

        .form-layout { display: grid; grid-template-columns: minmax(0,1.4fr) minmax(210px,.8fr); gap: 21px; align-items: start; }

        .product-form {
          padding: 25px; border: 1px solid rgba(141,99,73,.13);
          border-radius: 15px; background: rgba(255,251,245,.78);
          box-shadow: 0 8px 22px rgba(97,66,44,.045);
          backdrop-filter: blur(10px);
        }

        .form-section-title { display: flex; align-items: center; gap: 12px; margin-bottom: 23px; }

        .section-number {
          width: 35px; height: 35px; display: grid; place-items: center;
          border: 1px solid rgba(166,102,78,.18); border-radius: 10px;
          color: #a66c51; background: rgba(223,185,155,.16);
          font-family: Georgia,serif; font-size: 13px;
        }

        .form-section-title h3 { margin: 0; color: #5b4234; font-family: Georgia,serif; font-size: 17px; font-weight: 400; }
        .form-section-title p { margin: 4px 0 0; color: #a18b7b; font-family: Georgia,serif; font-size: 11px; }

        .field { display: flex; flex-direction: column; gap: 9px; margin-bottom: 19px; }

        .field label { color: #9c7963; font-size: 8px; font-weight: 700; letter-spacing: 1.2px; }
        .field label span { color: #b66f52; }

        .field input, .field textarea {
          width: 100%; padding: 13px 14px; outline: none;
          border: 1px solid rgba(139,99,73,.16); border-radius: 9px;
          color: #614839; background: rgba(255,255,255,.55);
          font-family: Georgia,serif; font-size: 12px; transition: border-color .2s,box-shadow .2s;
        }

        .field input:focus, .field textarea:focus {
          border-color: rgba(177,112,81,.6);
          box-shadow: 0 0 0 3px rgba(177,112,81,.07);
        }

        .field input::placeholder, .field textarea::placeholder { color: #b5a193; }
        .field textarea { resize: vertical; min-height: 105px; line-height: 1.7; }
        .field-hint { color: #b09b8b; font-family: Georgia,serif; font-size: 10px; }

        .price-input {
          display: flex; align-items: center; border: 1px solid rgba(139,99,73,.16);
          border-radius: 9px; background: rgba(255,255,255,.55); transition: .2s;
        }

        .price-input:focus-within { border-color: rgba(177,112,81,.6); box-shadow: 0 0 0 3px rgba(177,112,81,.07); }
        .price-input > span:first-child { padding-left: 14px; color: #a66c51; font-family: Georgia,serif; font-size: 15px; }
        .price-input input { border: 0; box-shadow: none !important; background: transparent; }
        .currency-label { padding-right: 13px; color: #ad9786; font-size: 8px; letter-spacing: 1px; }

        .form-divider { height: 1px; margin: 25px 0; background: var(--line); }

        .upload-zone {
          position: relative; display: block; width: 100%; min-height: 180px;
          overflow: hidden; border: 1px dashed rgba(160,110,80,.35);
          border-radius: 12px; background: rgba(243,226,209,.25);
          cursor: pointer; transition: border-color .2s,background .2s;
        }

        .upload-zone:hover { border-color: #b47a5d; background: rgba(243,226,209,.45); }

        .upload-placeholder { min-height: 180px; display: flex; flex-direction: column; justify-content: center; align-items: center; gap: 9px; }

        .upload-icon {
          width: 45px; height: 45px; display: grid; place-items: center;
          border: 1px solid rgba(166,108,81,.16); border-radius: 13px;
          color: #aa7357; background: rgba(255,250,243,.75); margin-bottom: 3px;
        }

        .upload-placeholder strong { color: #6a4c3a; font-family: Georgia,serif; font-size: 14px; font-weight: 400; }
        .upload-placeholder span { color: #a18b7b; font-family: Georgia,serif; font-size: 11px; }
        .upload-placeholder u { color: #a6664e; text-underline-offset: 3px; }
        .upload-placeholder small { margin-top: 4px; color: #b6a191; font-size: 8px; letter-spacing: 1.2px; }

        .file-input { position: absolute; width: 1px; height: 1px; overflow: hidden; opacity: 0; }

        .preview-wrap { position: relative; height: 220px; }
        .preview-wrap img { width: 100%; height: 100%; display: block; object-fit: contain; background: #f0e2d4; }
        .preview-overlay { position: absolute; inset: 0; display: grid; place-items: center; opacity: 0; background: rgba(56,38,28,.3); transition: opacity .2s; }
        .preview-wrap:hover .preview-overlay { opacity: 1; }
        .preview-overlay span { display: flex; align-items: center; gap: 7px; padding: 10px 14px; border-radius: 20px; color: #fff; background: rgba(61,44,34,.65); font-size: 11px; }
        .remove-image { position: absolute; top: 10px; right: 10px; width: 29px; height: 29px; display: grid; place-items: center; border: 1px solid rgba(255,255,255,.5); border-radius: 50%; color: white; background: rgba(55,39,30,.55); cursor: pointer; }

        .feedback { display: flex; align-items: center; gap: 8px; margin: 15px 0; padding: 12px; border-radius: 9px; font-size: 11px; line-height: 1.5; }
        .error-feedback { border: 1px solid #e8c5b7; color: #a34d37; background: #fff0e9; }
        .success-feedback { border: 1px solid #d1d8bb; color: #637448; background: #f3f5e9; }

        .submit-button {
          width: 100%; display: flex; align-items: center; justify-content: center;
          gap: 10px; margin-top: 21px; padding: 15px;
          border: 1px solid #a6664e; border-radius: 9px;
          color: #fff9f2; background: #a6664e;
          box-shadow: 0 7px 17px rgba(146,83,57,.15);
          font-size: 12px; font-weight: 600; cursor: pointer;
          transition: transform .25s,box-shadow .25s,background .25s;
        }

        .submit-button:hover:not(:disabled) { transform: translateY(-3px); background: #92583f; box-shadow: 0 12px 23px rgba(146,83,57,.2); }
        .submit-button:disabled { opacity: .65; cursor: wait; }
        .spin { animation: dashSpin 1s linear infinite; }

        .secure-note { display: flex; align-items: center; justify-content: center; gap: 6px; margin: 13px 0 0; color: #b09a89; font-family: Georgia,serif; font-size: 10px; }

        .side-panel { display: flex; flex-direction: column; gap: 15px; }

        .preview-card {
          overflow: hidden; border: 1px solid rgba(141,99,73,.13);
          border-radius: 14px; background: rgba(255,251,245,.8);
          box-shadow: 0 8px 22px rgba(97,66,44,.045);
        }

        .preview-card-top { display: flex; justify-content: space-between; align-items: center; padding: 15px 16px; color: #a47b62; font-size: 8px; font-weight: 700; letter-spacing: 1.3px; }
        .preview-card-top svg { color: #b67a59; }

        .live-preview-image { height: 155px; margin: 0 13px; overflow: hidden; border-radius: 9px; background: #f1e4d7; }
        .live-preview-image img { width: 100%; height: 100%; display: block; object-fit: cover; animation: dashReveal .4s ease both; }

        .preview-placeholder { height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 9px; color: #b39b88; }
        .placeholder-arch { width: 65px; height: 78px; display: grid; place-items: center; border: 1px solid rgba(165,113,81,.24); border-radius: 50% 50% 5px 5px; color: #ae7e60; background: rgba(222,190,163,.22); }
        .preview-placeholder span { font-family: Georgia,serif; font-size: 10px; }

        .live-preview-details { padding: 16px; }
        .preview-overline { color: #b18b71; font-size: 7px; font-weight: 700; letter-spacing: 1.3px; }
        .live-preview-details h3 { overflow: hidden; margin: 7px 0; color: #594235; font-family: Georgia,serif; font-size: 19px; font-weight: 400; text-overflow: ellipsis; white-space: nowrap; }
        .live-preview-details p { display: -webkit-box; min-height: 34px; overflow: hidden; margin: 0; color: #9d8879; font-family: Georgia,serif; font-size: 11px; line-height: 1.6; -webkit-box-orient: vertical; -webkit-line-clamp: 2; }

        .preview-price { display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-top: 15px; padding-top: 12px; border-top: 1px solid var(--line); }
        .preview-price span { color: #ad9786; font-size: 7px; font-weight: 700; letter-spacing: 1px; }
        .preview-price strong { color: #ac6c50; font-family: Georgia,serif; font-size: 18px; font-weight: 400; }

        .tip-card { display: flex; gap: 11px; padding: 15px; border: 1px solid rgba(164,119,83,.12); border-radius: 12px; background: rgba(233,211,189,.28); }
        .tip-icon { flex-shrink: 0; width: 30px; height: 30px; display: grid; place-items: center; border-radius: 9px; color: #a66c51; background: rgba(255,250,243,.75); }
        .tip-label { color: #a77a5f; font-size: 7px; font-weight: 700; letter-spacing: 1.2px; }
        .tip-card h4 { margin: 5px 0; color: #684b39; font-family: Georgia,serif; font-size: 13px; font-weight: 400; }
        .tip-card p { margin: 0; color: #9e8878; font-family: Georgia,serif; font-size: 10px; line-height: 1.65; }

        .view-collection { display: flex; align-items: center; gap: 11px; padding: 14px; border: 1px solid rgba(141,99,73,.13); border-radius: 12px; color: inherit; background: rgba(255,251,245,.65); text-decoration: none; transition: transform .2s,background .2s; }
        .view-collection:hover { transform: translateY(-2px); background: rgba(255,251,245,.95); }
        .view-collection-icon { width: 35px; height: 35px; display: grid; place-items: center; border-radius: 10px; color: #a66c51; background: rgba(223,185,155,.22); }
        .view-collection div:nth-child(2) { display: flex; flex: 1; flex-direction: column; gap: 4px; }
        .view-collection strong { color: #684b39; font-family: Georgia,serif; font-size: 12px; font-weight: 400; }
        .view-collection span { color: #a18b7b; font-family: Georgia,serif; font-size: 10px; }
        .view-collection > svg { color: #b18a72; }

        .page-footer { display: flex; justify-content: space-between; gap: 10px; padding: 17px 0; border-top: 1px solid var(--line); color: #b09a89; font-size: 7px; letter-spacing: 1.3px; }
        .footer-star { margin-left: 5px; color: #bb7857; }

        @keyframes dashFloat { from { transform: translate3d(-15px,-10px,0) scale(.95); } to { transform: translate3d(28px,30px,0) scale(1.12); } }
        @keyframes dashGlow { from { opacity: .65; transform: scale(.95); } to { opacity: 1; transform: scale(1.1); } }
        @keyframes dashOrbit { from { rotate: 0deg; } to { rotate: 360deg; } }
        @keyframes dashVase { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
        @keyframes dashLeaf { from { rotate: -7deg; } to { rotate: 7deg; } }
        @keyframes dashTwinkle { 0%,100% { opacity: .4; transform: scale(.8); } 50% { opacity: 1; transform: scale(1.2); } }
        @keyframes dashSpin { to { transform: rotate(360deg); } }
        @keyframes dashReveal { from { opacity: 0; } to { opacity: 1; } }

        @media (max-width: 1100px) {
          .studio-content { width: calc(100% - 250px); margin-left: 250px; padding-left: 4%; padding-right: 4%; }
          .form-layout { grid-template-columns: minmax(0,1.2fr) minmax(190px,.8fr); gap: 14px; }
          .product-form { padding: 19px; }
          .hero-art { flex-basis: 235px; }
        }

        @media (max-width: 760px) {
          .studio-content { width: 100%; margin-left: 0; padding: 0 20px 20px; }
          .topbar { height: 70px; }
          .collection-label { display: none; }
          .hero { min-height: auto; padding: 38px 0 30px; }
          .hero h1 { font-size: clamp(38px,9vw,55px); }
          .hero-art { display: none; }
          .hero-description { max-width: 100%; }
          .form-heading { align-items: flex-start; flex-direction: column; }
          .form-layout { grid-template-columns: 1fr; }
          .side-panel { display: grid; grid-template-columns: 1fr 1fr; align-items: start; }
          .preview-card { grid-row: span 2; }
          .page-footer { margin-top: 20px; }
        }

        @media (max-width: 480px) {
          .studio-content { padding-left: 15px; padding-right: 15px; }
          .top-link { font-size: 0; gap: 5px; }
          .top-link svg { width: 16px; height: 16px; }
          .product-form { padding: 16px; }
          .side-panel { display: flex; }
          .hero-bottom { gap: 10px; }
          .hero-stat span { font-size: 6px; }
          .page-footer { font-size: 6px; letter-spacing: .8px; }
        }

        @media (prefers-reduced-motion: reduce) {
          .studio-page *, .studio-page *::before, .studio-page *::after {
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