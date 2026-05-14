"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { getProducts } from "@/firebase/services";
import { Product } from "@/types";
import { FiTag, FiStar, FiArrowRight, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import InquiryForm from "./InquiryForm";



function ImageCarousel({ images, title }: { images: string[]; title: string }) {
  const [current, setCurrent] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="w-full h-56 bg-bg-secondary flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-3 rounded-full border border-cyan-500/30 flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#00D9FF" strokeWidth="1.5">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <path d="m21 15-5-5L5 21" />
            </svg>
          </div>
          <span className="text-text-secondary text-xs font-body">Product Preview</span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-56 overflow-hidden group">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0"
        >
          <Image src={images[current]} alt={title} fill className="object-cover" />
        </motion.div>
      </AnimatePresence>
      {images.length > 1 && (
        <>
          <button
            onClick={() => setCurrent((c) => (c - 1 + images.length) % images.length)}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full glass flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <FiChevronLeft size={14} className="text-accent-cyan" />
          </button>
          <button
            onClick={() => setCurrent((c) => (c + 1) % images.length)}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full glass flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <FiChevronRight size={14} className="text-accent-cyan" />
          </button>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`w-1.5 h-1.5 rounded-full transition-all ${i === current ? "bg-accent-cyan w-4" : "bg-white/30"}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function ProductsSection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
  getProducts()
    .then((data) => setProducts(data))
    .catch(() => setProducts([]))
    .finally(() => setLoading(false));
}, []);

  return (
    <section id="products" className="py-24 relative">
      <div className="absolute inset-0 bg-bg-secondary/40" />
      <div className="absolute inset-0 cyber-grid opacity-20" />
      <div className="max-w-7xl mx-auto px-6 relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-block px-4 py-1 rounded-full border border-cyan-500/30 text-accent-cyan font-display text-xs tracking-widest mb-4">
            PRODUCT SHOWCASE
          </div>
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-white">
            Our <span className="gradient-text">Products</span>
          </h2>
          <p className="mt-4 text-text-secondary font-body text-lg max-w-2xl mx-auto">
            Cutting-edge software solutions engineered to transform how you operate, compete, and innovate.
          </p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center gap-3 py-12">
            {[0, 1, 2].map((i) => (
              <div key={i} className="loading-dot w-3 h-3 rounded-full bg-accent-cyan" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
                className="glass rounded-xl overflow-hidden neon-border product-card group"
              >
                {/* Image */}
                <div className="relative overflow-hidden">
                  <ImageCarousel images={product.images} title={product.title} />
                  {product.featured && (
                    <div className="absolute top-3 right-3 px-2 py-1 rounded text-xs font-display tracking-widest neon-btn-filled flex items-center gap-1">
                      <FiStar size={10} /> FEATURED
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="font-display text-sm font-bold text-white mb-3 leading-tight group-hover:text-accent-cyan transition-colors">
                    {product.title}
                  </h3>
                  <p className="text-text-secondary font-body text-sm leading-relaxed mb-4 line-clamp-3">
                    {product.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-5">
                    {product.tags?.map((tag) => (
                      <span key={tag} className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-body bg-cyan-500/10 text-accent-cyan border border-cyan-500/20">
                        <FiTag size={9} /> {tag}
                      </span>
                    ))}
                  </div>

                  <button
                    onClick={() => setSelectedProduct(product)}
                    className="w-full neon-btn py-3 rounded font-display text-xs tracking-widest flex items-center justify-center gap-2 group"
                  >
                    INQUIRE / GET IN TOUCH <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Inquiry Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <InquiryForm
            productName={selectedProduct.title}
            onClose={() => setSelectedProduct(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
