import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, AnimatePresence, useMotionValue } from 'framer-motion';
import { Menu, X, ArrowRight, ArrowUpRight, Check, FileText, ShoppingBag, Star, Globe, Leaf } from 'lucide-react';

/* --- FONTS & GLOBAL STYLES --- */
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500&family=Playfair+Display:ital,wght@0,400;0,600;1,400&display=swap');
    @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400&display=swap');
    
    :root {
      --bg-color: #F4F4F0;
      --text-color: #1A1A1A;
    }

    html.lenis, html.lenis body {
      height: auto;
    }

    .lenis.lenis-smooth {
      scroll-behavior: auto !important;
    }

    .lenis.lenis-smooth [data-lenis-prevent] {
      overscroll-behavior: contain;
    }

    .lenis.lenis-stopped {
      overflow: hidden;
    }

    body {
      background-color: var(--bg-color);
      color: var(--text-color);
      font-family: 'Inter', sans-serif;
      overflow-x: hidden;
      scrollbar-width: none; 
      -ms-overflow-style: none;
    }
    
    body.locked {
      overflow: hidden !important;
    }
    
    body::-webkit-scrollbar { 
      display: none; 
    }

    .font-serif { font-family: 'Playfair Display', serif; }
    .font-sans { font-family: 'Inter', sans-serif; }
    .font-mono { font-family: 'JetBrains Mono', monospace; }
    
    ::selection {
      background: #1a1a1a;
      color: #F4F4F0;
    }

    /* Magazine Column Layout */
    .magazine-columns {
      column-count: 1;
    }
    @media (min-width: 768px) {
      .magazine-columns {
        column-count: 2;
        column-gap: 3rem;
      }
    }
    
    .drop-cap::first-letter {
      float: left;
      font-family: 'Playfair Display', serif;
      font-size: 4rem;
      line-height: 3.5rem;
      padding-right: 0.5rem;
      padding-top: 0.2rem;
      font-weight: 700;
    }
  `}</style>
);

/* --- MOCK DATA --- */

const STORIES = [
  { id: 1, title: "The Architecture of Silence", category: "Spaces", img: "https://picsum.photos/seed/arch/800/1000", content: "Silence is not merely the absence of noise, but a spatial quality that can be designed. In this feature, we explore how brutalist structures create pockets of absolute stillness in urban environments. The walls, thick and unforgiving, act not just as barriers to the elements, but as filters for the cacophony of modern life. Walking through these corridors, one feels the weight of the material—concrete, raw and unpolished—absorbing sound, light, and time itself." },
  { id: 2, title: "Ceramics in the Digital Age", category: "Craft", img: "https://picsum.photos/seed/ceramic/800/1000", content: "As our lives become increasingly pixelated, the tactile resistance of clay offers a necessary grounding. We visit three studios redefining the ancient art for a post-digital world. These artisans are not rejecting technology, but rather integrating it into a process that remains fundamentally human." },
  { id: 3, title: "Shadows & Dust: A Memoir", category: "Literature", img: "https://picsum.photos/seed/dust/800/1000", content: "A haunting look into the archives of forgotten European libraries, where dust motes dance in the light of history. The smell of old paper, the crackle of binding glue, the silence that is heavy with the thoughts of centuries. These are spaces of preservation, but also of decay." },
  { id: 4, title: "Tokyo's Hidden Jazz Bars", category: "Travel", img: "https://picsum.photos/seed/tokyo/800/1000", content: "Behind nondescript doors in Shinjuku, the golden age of high-fidelity audio lives on. A guide to the best 'listening bars' in Tokyo. Here, conversation is discouraged, and the focus is entirely on the music. Tube amplifiers glow warmly in the dim light, and the needle drops on a rare Blue Note pressing." },
  { id: 5, title: "Sustainable Haute Couture", category: "Fashion", img: "https://picsum.photos/seed/fashion/800/1000", content: "Can luxury truly be sustainable? We examine the new wave of designers using bio-materials to create garments that eventually return to the earth. Mushroom leather, spider silk proteins, algae-based dyes. The future of fashion is not just about looking forward, but about looking inward." },
];

const INDEX_ITEMS = [
  { title: "Manifesto regarding modern art", author: "A. J. Fikry", date: "24.10.2023", type: "Essay", content: "Art must be dangerous. If it is safe, it is decoration. We must reject the commodification of creativity and return to the raw, the visceral, the uncomfortable." },
  { title: "Why we return to analog", author: "Elena S.", date: "12.11.2023", type: "Opinion", content: "The crackle of vinyl, the grain of film. Imperfection is the new luxury. In a world of 4K perfection, we crave the flaw, the mistake that proves a human hand was involved." },
  { title: "The brutalist revival in web design", author: "Marc D.", date: "05.01.2024", type: "Tech", content: "Stripping away the glossy veneer of Web 2.0 to reveal the raw HTML structure underneath. It is honesty in design, functionality over frivolity." },
  { title: "Coffee culture in Scandinavia", author: "Lars Jensen", date: "15.02.2024", type: "Culture", content: "More than a drink, 'fika' is a state of mind, a pause in the relentless march of time. It is a social institution, a necessary break for the soul." },
  { title: "Interview with Tadao Ando", author: "Editorial Team", date: "01.03.2024", type: "Interview", content: "The master of concrete speaks about light, wind, and the human spirit. 'I do not believe architecture has to speak too much. It should remain silent and let nature in the guise of sunlight and wind speak'." },
];

const ESSAY_IMAGES = [
  { id: 1, src: "https://picsum.photos/seed/essay1/1600/900", caption: "Fig 01. — Raw Concrete forms in light." },
  { id: 2, src: "https://picsum.photos/seed/essay2/1600/900", caption: "Fig 02. — The absence of color." },
  { id: 3, src: "https://picsum.photos/seed/essay3/1600/900", caption: "Fig 03. — Texture over structure." },
  { id: 4, src: "https://picsum.photos/seed/essay4/1600/900", caption: "Fig 04. — Human scale interaction." },
];

const FOCUS_PANELS = [
  { id: "fashion", title: "FASHION", img: "https://picsum.photos/seed/focus1/800/1200", desc: "Redefining textiles." },
  { id: "design", title: "DESIGN", img: "https://picsum.photos/seed/focus2/800/1200", desc: "Function follows form." },
  { id: "arch", title: "ARCH", img: "https://picsum.photos/seed/focus3/800/1200", desc: "Living spaces." },
  { id: "tech", title: "TECH", img: "https://picsum.photos/seed/focus4/800/1200", desc: "Digital ethics." },
];

const SHOP_ITEMS = [
  { id: 1, name: "The Concrete Lamp", price: "€450", sponsor: "Studio Brutal", img: "https://picsum.photos/seed/lamp/600/600" },
  { id: 2, name: "Velvet Vol. 14 (Print)", price: "€35", sponsor: "Velvet Press", img: "https://picsum.photos/seed/print/600/800" },
  { id: 3, name: "Ceramic Vase No. 5", price: "€120", sponsor: "Clay & Dust", img: "https://picsum.photos/seed/vase/600/600" },
  { id: 4, name: "Minimalist Chair", price: "€890", sponsor: "Nordic Wood", img: "https://picsum.photos/seed/chair/600/600" },
];

const TOP_ARTICLES = [
  { id: 1, rank: "01", title: "Why Silence is the Ultimate Luxury", author: "Sarah Jenkins", views: "24k Reads" },
  { id: 2, rank: "02", title: "The Return of Analog Photography", author: "Marc D.", views: "18k Reads" },
  { id: 3, rank: "03", title: "Sustainable Cities: A Pipe Dream?", author: "Eco Collective", views: "15k Reads" },
  { id: 4, rank: "04", title: "Fashion Week: Paris Recap", author: "Velvet Fashion", views: "12k Reads" },
];

const REFLECTIONS = [
  { title: "On Slowing Down", text: "In a world that demands instantaneity, we explore the radical act of waiting." },
  { title: "Digital Decay", text: "What happens to our online personas when we are gone? A digital archaeology." },
  { title: "The Joy of Missing Out", text: "Reclaiming our attention span one notification at a time." }
];

/* --- NEW UTILITY COMPONENT: REVEAL --- */
/* Animates children into view when scrolled to */
const Reveal = ({ children, width = "100%", delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }} // Triggers when element is 10% into view
      transition={{ duration: 0.8, delay: delay, ease: [0.22, 1, 0.36, 1] }}
      style={{ width }}
    >
      {children}
    </motion.div>
  );
};

/* --- MODAL COMPONENTS --- */

// 1. ARTICLE VIEW (Full Page Takeover)
const ArticleView = ({ story, onClose }) => {
  if (!story) return null;

  return (
    <motion.div
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "100%", transition: { duration: 0.5, ease: [0.76, 0, 0.24, 1] } }}
      transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
      className="fixed inset-0 z-[60] bg-[#F4F4F0] overflow-y-auto overscroll-contain"
      data-lenis-prevent="true"
    >
      {/* Sticky Header with Close Button */}
      <div className="sticky top-0 left-0 w-full flex justify-between items-center p-6 md:p-8 mix-blend-difference z-50 text-[#1A1A1A]">
        <span className="font-mono text-xs uppercase tracking-widest">{story.category}</span>
        <button onClick={onClose} className="group flex items-center gap-2 hover:opacity-70 transition-opacity">
          <span className="font-mono text-xs uppercase tracking-widest hidden md:block">Close Article</span>
          <div className="bg-black text-white rounded-full p-2 group-hover:rotate-90 transition-transform duration-300">
            <X size={20} />
          </div>
        </button>
      </div>

      {/* Content Container */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 pb-24">
        {/* Hero Title Area */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="flex flex-col items-center text-center mb-16 md:mb-24 pt-12"
        >
          <h1 className="text-5xl md:text-8xl lg:text-9xl font-serif leading-[0.9] tracking-tight mb-8 max-w-5xl">
            {story.title}
          </h1>
          <div className="flex gap-8 font-mono text-xs text-gray-500 uppercase tracking-widest">
            <span>By Editorial Team</span>
            <span>—</span>
            <span>5 Min Read</span>
          </div>
        </motion.div>

        {/* Hero Image */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.4, duration: 1 }}
          className="w-full aspect-video md:aspect-[21/9] overflow-hidden mb-16 md:mb-24"
        >
          <img src={story.img} alt={story.title} className="w-full h-full object-cover grayscale" />
        </motion.div>

        {/* Article Text */}
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="font-serif text-xl md:text-2xl leading-relaxed text-gray-800 magazine-columns drop-cap text-justify"
          >
            {story.content}
            <br /><br />
            <span className="font-sans text-lg">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
            </span>
            <br /><br />
            <span className="font-sans text-lg">
              Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.
            </span>
          </motion.div>
        </div>

        {/* Next Article Teaser */}
        <Reveal>
          <div className="mt-32 pt-12 border-t border-[#D6D6D2] flex justify-between items-end">
            <div>
              <span className="font-mono text-xs uppercase text-gray-400 mb-2 block">Up Next</span>
              <h3 className="text-3xl font-serif italic text-gray-300">The Void</h3>
            </div>
            <ArrowRight size={48} className="text-gray-300" strokeWidth={1} />
          </div>
        </Reveal>
      </div>
    </motion.div>
  );
};

// 2. ARCHIVE PANEL (Side Drawer)
const ArchivePanel = ({ item, onClose }) => {
  if (!item) return null;

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-[60] bg-black backdrop-blur-sm"
      />
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="fixed top-0 right-0 z-[65] h-full w-full md:w-[600px] bg-[#1A1A1A] text-[#F4F4F0] p-8 md:p-16 overflow-y-auto border-l border-gray-800 flex flex-col justify-between shadow-2xl overscroll-contain"
        data-lenis-prevent="true"
      >
        <div>
          <div className="flex justify-between items-start mb-16 border-b border-gray-700 pb-8">
            <div>
              <span className="font-mono text-xs text-gray-500 block mb-1">ARCHIVE REF:</span>
              <span className="font-mono text-xl">{item.date} — {item.type}</span>
            </div>
            <button onClick={onClose} className="hover:rotate-90 transition-transform duration-300">
              <X size={32} />
            </button>
          </div>

          <div className="mb-12">
            <span className="font-mono text-xs text-red-500 uppercase tracking-widest mb-4 block animate-pulse">
              ● Classified
            </span>
            <h2 className="text-4xl md:text-6xl font-serif leading-none mb-8">
              {item.title}
            </h2>
            <div className="flex items-center gap-4 mb-8">
              <div className="h-[1px] w-12 bg-gray-600"></div>
              <span className="font-mono text-xs text-gray-400 uppercase">Author: {item.author}</span>
            </div>
            <p className="font-mono text-sm md:text-base leading-relaxed text-gray-400 border-l-2 border-gray-700 pl-6">
              {item.content}
              <br /><br />
              [SYSTEM NOTE]: Additional data corrupted or redacted. Full restoration of this file requires level 4 clearance.
            </p>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex justify-between items-center font-mono text-xs text-gray-600">
          <span>ID: 882-991-X</span>
          <div className="flex gap-4">
            <span className="hover:text-white cursor-pointer transition-colors flex items-center gap-2"><FileText size={12} /> DOWNLOAD PDF</span>
            <span className="hover:text-white cursor-pointer transition-colors flex items-center gap-2"><ArrowRight size={12} /> OPEN SOURCE</span>
          </div>
        </div>
      </motion.div>
    </>
  );
};

/* --- RESTORED INTERACTIVE COMPONENTS (HOME SECTIONS) --- */

// 1. HERO (UPDATED WITH MOBILE VIDEO)
const Hero = () => {
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const springConfig = { damping: 25, stiffness: 150 };
  const cursorX = useSpring(useMotionValue(0), springConfig);
  const cursorY = useSpring(useMotionValue(0), springConfig);

  useEffect(() => {
    const moveCursor = (e) => {
      setCursor({ x: e.clientX, y: e.clientY });
      cursorX.set(e.clientX - 150);
      cursorY.set(e.clientY - 200);
    };
    window.addEventListener('mousemove', moveCursor);
    return () => window.removeEventListener('mousemove', moveCursor);
  }, [cursorX, cursorY]);

  return (
    <section className="relative min-h-screen flex items-center justify-center border-b border-[#D6D6D2] overflow-hidden cursor-crosshair">
      {/* VIDEO DE FONDO (SOLO MÓVIL) */}
      <div className="absolute inset-0 block md:hidden z-0">
        <div className="absolute inset-0 bg-black/20 z-10" />
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover grayscale contrast-125"
        >
          <source src="./hero-urban.mp4" type="video/mp4" />
        </video>
      </div>

      {/* INTERACCIÓN DESKTOP */}
      <motion.div
        style={{ x: cursorX, y: cursorY, opacity: isHovering ? 1 : 0, rotate: isHovering ? 5 : 0 }}
        className="fixed top-0 left-0 w-[300px] h-[400px] pointer-events-none z-10 hidden md:block"
      >
        <img
          src="https://picsum.photos/seed/avant/600/800"
          alt="Reveal"
          className="w-full h-full object-cover grayscale contrast-125"
        />
      </motion.div>

      {/* TEXTO HERO */}
      <div className="relative z-20 text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="text-[#F4F4F0] md:text-[#1A1A1A] md:mix-blend-darken"
        >
          <span className="text-xs md:text-sm font-sans uppercase tracking-[0.3em] mb-4 block drop-shadow-md md:drop-shadow-none">
            Est. 2024 — Digital Issue
          </span>
          <h2
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            className="text-6xl md:text-9xl font-serif leading-[0.9] tracking-tight hover:italic transition-all duration-500 cursor-none drop-shadow-lg md:drop-shadow-none"
          >
            CULTURE<br />IS FLUID
          </h2>
        </motion.div>
      </div>

      {/* Grid Lines */}
      <div className="absolute inset-0 grid grid-cols-4 pointer-events-none z-10 opacity-30 md:opacity-100">
        <div className="border-r border-[#D6D6D2] h-full" />
        <div className="border-r border-[#D6D6D2] h-full" />
        <div className="border-r border-[#D6D6D2] h-full" />
        <div className="border-r border-[#D6D6D2] h-full" />
      </div>
    </section>
  );
};

// 2. TICKER
const Marquee = () => {
  return (
    <div className="bg-[#1A1A1A] text-[#F4F4F0] py-4 border-b border-[#D6D6D2] overflow-hidden whitespace-nowrap flex">
      <motion.div
        animate={{ x: [0, -1000] }}
        transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
        className="flex gap-12 items-center text-lg md:text-2xl font-serif italic"
      >
        {[...Array(6)].map((_, i) => (
          <React.Fragment key={i}>
            <span>New Collection Fall/Winter</span>
            <span className="w-2 h-2 rounded-full bg-[#F4F4F0]" />
            <span>Interview with J. Anderson</span>
            <span className="w-2 h-2 rounded-full bg-[#F4F4F0]" />
            <span>The Death of Minimalism?</span>
            <span className="w-2 h-2 rounded-full bg-[#F4F4F0]" />
          </React.Fragment>
        ))}
      </motion.div>
    </div>
  );
};

// 3. FEATURED STORIES (With Reveal)
const FeaturedStories = ({ onStoryClick }) => {
  return (
    <section className="min-h-[200vh] border-b border-[#D6D6D2]">
      <div className="grid grid-cols-1 md:grid-cols-12 h-full">
        <div className="md:col-span-4 border-r border-[#D6D6D2] p-8 md:p-12 md:sticky md:top-0 md:h-screen flex flex-col justify-between bg-[#F4F4F0] z-10">
          <Reveal>
            <div>
              <h3 className="text-4xl md:text-6xl font-serif mb-6">Latest<br />Stories</h3>
              <p className="font-sans text-sm md:text-base text-gray-500 max-w-xs leading-relaxed">
                Curated selection of thoughts, movements, and artistic expressions shaping our current reality.
              </p>
            </div>
          </Reveal>
          <div className="font-mono text-xs mt-10 md:mt-0 opacity-50">
            SCROLL TO EXPLORE ↓
          </div>
        </div>

        <div className="md:col-span-8 bg-[#F4F4F0]">
          {STORIES.map((story, i) => (
            <div key={story.id} className="group border-b border-[#D6D6D2] last:border-b-0 p-8 md:p-20 flex flex-col items-center">
              <Reveal delay={i % 2 === 0 ? 0 : 0.1}>
                <div className="w-full max-w-lg cursor-pointer" onClick={() => onStoryClick(story)}>
                  <div className="overflow-hidden mb-6 relative aspect-[4/5]">
                    <motion.img
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                      src={story.img}
                      alt={story.title}
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                    />
                    <div className="absolute top-4 left-4 bg-[#F4F4F0] px-3 py-1 text-xs uppercase tracking-widest font-sans z-10 text-[#1A1A1A]">
                      {story.category}
                    </div>
                  </div>
                  <div className="flex justify-between items-start">
                    <h4 className="text-2xl md:text-4xl font-serif group-hover:italic transition-all duration-300">
                      {story.title}
                    </h4>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0 text-[#1A1A1A]">
                      <ArrowUpRight size={28} />
                    </div>
                  </div>
                  <div className="mt-4 flex gap-4 text-xs font-mono text-gray-400">
                    <span>0{i + 1}</span>
                    <span>—</span>
                    <span>5 MIN READ</span>
                  </div>
                </div>
              </Reveal>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// 4. INTERACTIVE INDEX (With Reveal)
const InteractiveList = ({ onIndexClick }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <section className="py-24 md:py-40 px-6 md:px-12 border-b border-[#D6D6D2]">
      <div className="max-w-6xl mx-auto">
        <Reveal>
          <div className="flex items-end justify-between mb-20">
            <h3 className="text-xl font-mono uppercase tracking-widest">Index / Archive</h3>
            <span className="text-xs font-mono text-gray-400">[ A — Z ]</span>
          </div>
        </Reveal>

        <div className="flex flex-col" onMouseLeave={() => setHoveredIndex(null)}>
          {INDEX_ITEMS.map((item, i) => (
            <Reveal key={i} delay={i * 0.05}>
              <motion.div
                onMouseEnter={() => setHoveredIndex(i)}
                onClick={() => onIndexClick(item)}
                className={`
                  relative py-8 border-t border-[#D6D6D2] last:border-b flex justify-between items-center cursor-pointer transition-all duration-500
                  ${hoveredIndex !== null && hoveredIndex !== i ? 'opacity-30 blur-[1px]' : 'opacity-100'}
                `}
              >
                <div className="flex items-baseline gap-8 md:gap-24">
                  <span className="font-mono text-xs text-gray-400 w-8">0{i + 1}</span>
                  <h4 className="text-2xl md:text-5xl font-serif hover:pl-4 transition-all duration-300">
                    {item.title}
                  </h4>
                </div>

                <div className="flex items-center gap-8">
                  <span className="hidden md:block font-sans text-xs uppercase tracking-widest">{item.author}</span>
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: hoveredIndex === i ? 1 : 0, x: hoveredIndex === i ? 0 : -10 }}
                  >
                    <ArrowRight size={24} />
                  </motion.div>
                </div>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

// 5. VISUAL ESSAY (Fixed Mobile Scroll & Padding)
const VisualEssay = ({ setView }) => {
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  // Responsive logic: Scroll further on mobile (-93%) to show the last card
  const [scrollEnd, setScrollEnd] = useState("-80%");
  useEffect(() => {
    const updateScroll = () => {
      setScrollEnd(window.innerWidth < 768 ? "-87%" : "-80%");
    };
    updateScroll();
    window.addEventListener('resize', updateScroll);
    return () => window.removeEventListener('resize', updateScroll);
  }, []);

  const x = useTransform(scrollYProgress, [0, 1], ["0%", scrollEnd]);

  return (
    <section ref={targetRef} className="relative h-[300vh] border-b border-[#D6D6D2]">
      <div className="sticky top-0 flex h-screen items-center overflow-hidden bg-[#F4F4F0]">

        <div className="absolute top-12 left-6 md:left-12 z-20 mix-blend-difference text-[#F4F4F0] pointer-events-none">
          <h3 className="text-xl font-mono uppercase tracking-widest">Visual Essay</h3>
          <p className="text-sm opacity-60">Swipe Left</p>
        </div>

        {/* Added right padding to container so the last item isn't flush against viewport edge */}
        <motion.div style={{ x }} className="flex gap-12 md:gap-24 px-6 md:px-32 pr-32 md:pr-32 items-center">

          <div className="w-[80vw] md:w-[30vw] shrink-0 flex flex-col justify-center md:pr-12">
            <h2 className="text-6xl md:text-8xl font-serif leading-none mb-8">
              Concrete<br /><span className="italic opacity-50">Dreams</span>
            </h2>
            <p className="font-sans text-sm md:text-base leading-relaxed max-w-sm">
              An exploration of brutalist forms in soft light. We traveled to the outskirts of Belgrade to capture the silence of concrete.
            </p>
          </div>

          {ESSAY_IMAGES.map((img, i) => (
            <div key={img.id} className="relative w-[85vw] md:w-[60vw] h-[55vh] md:h-[70vh] shrink-0 flex flex-col">
              <div className="relative w-full h-full overflow-hidden mb-4 group">
                <img src={img.src} alt="Essay" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000 scale-105 hover:scale-100 ease-in-out" />
                <div className="absolute top-0 right-0 p-4 text-[#F4F4F0] text-9xl font-serif opacity-20 mix-blend-overlay">
                  0{i + 1}
                </div>
              </div>
              <div className="flex items-center gap-4 border-t border-[#D6D6D2] pt-4">
                <span className="font-mono text-xs w-8">0{i + 1}</span>
                <p className="font-sans text-xs tracking-widest uppercase">{img.caption}</p>
              </div>
            </div>
          ))}

          {/* Fixed width for mobile readability */}
          <div className="w-[70vw] md:w-[30vw] shrink-0 flex flex-col justify-center items-start border-l border-[#D6D6D2] pl-12 md:pl-24 opacity-60">
            <span className="font-mono text-xs uppercase tracking-widest mb-6">See Full Gallery</span>
            <h3 className="text-5xl md:text-7xl font-serif mb-6 leading-tight">
              More<br />Visuals
            </h3>
            <button
              onClick={() => setView('visuals')}
              className="p-4 hover:bg-gray-200 rounded-full transition-colors animate-pulse border border-[#1A1A1A]"
            >
              <ArrowRight size={48} strokeWidth={1} />
            </button>
          </div>

        </motion.div>
      </div>
    </section>
  );
};

// 6. FOCUS SECTIONS (Elastic Accordion)
const FocusSections = ({ onStoryClick }) => {
  const [activePanel, setActivePanel] = useState(0);

  return (
    <section className="h-screen flex flex-col md:flex-row border-b border-[#D6D6D2] overflow-hidden">
      {FOCUS_PANELS.map((panel, index) => {
        const isActive = activePanel === index;
        return (
          <motion.div
            key={panel.id}
            onMouseEnter={() => setActivePanel(index)}
            onClick={() => setActivePanel(index)}
            layout
            className={`
              relative h-full border-b md:border-b-0 md:border-r border-[#D6D6D2] last:border-0 
              cursor-pointer overflow-hidden transition-colors duration-500
              ${isActive ? 'bg-[#1A1A1A] text-[#F4F4F0]' : 'bg-[#F4F4F0] text-[#1A1A1A] hover:bg-gray-200'}
            `}
            initial={false}
            animate={{
              flexGrow: isActive ? 3 : 1,
              flexBasis: isActive ? "40%" : "20%"
            }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <AnimatePresence>
              {isActive && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.4 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0 pointer-events-none"
                >
                  <img src={panel.img} alt="" className="w-full h-full object-cover grayscale" />
                </motion.div>
              )}
            </AnimatePresence>

            <div className="relative z-10 w-full h-full p-8 flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <span className="font-mono text-xs">0{index + 1}</span>
                {isActive && <ArrowUpRight size={24} />}
              </div>

              <div className="flex flex-col md:block">
                <div className={`
                    origin-bottom-left transition-all duration-500
                    ${isActive ? '' : 'md:absolute md:bottom-8 md:left-8 md:rotate-[-90deg] md:translate-x-full'}
                 `}>
                  <h3 className="text-3xl md:text-5xl font-serif whitespace-nowrap">
                    {panel.title}
                  </h3>
                </div>

                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: isActive ? 1 : 0, height: isActive ? 'auto' : 0 }}
                  className="hidden md:block overflow-hidden"
                >
                  <p className="mt-4 font-sans text-sm tracking-widest uppercase opacity-70 mb-4">{panel.desc}</p>
                  {isActive && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onStoryClick(panel);
                      }}
                      className="px-4 py-2 border border-[#F4F4F0] hover:bg-[#F4F4F0] hover:text-[#1A1A1A] transition-colors font-mono text-xs uppercase"
                    >
                      Discover
                    </button>
                  )}
                </motion.div>
              </div>
            </div>
          </motion.div>
        );
      })}
    </section>
  );
};

/* --- GLOBAL COMPONENTS --- */

const Header = ({ toggleMenu, setView }) => {
  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 w-full z-40 flex justify-between items-center px-6 py-6 mix-blend-difference text-[#F4F4F0]"
    >
      <div className="text-xs font-sans tracking-widest uppercase opacity-70">Vol. 14</div>
      <button onClick={() => setView('home')} className="text-2xl font-serif tracking-tighter font-bold relative z-50 hover:opacity-70 transition-opacity">
        VELVET
      </button>
      <button onClick={toggleMenu} className="group flex items-center gap-2 cursor-pointer">
        <span className="text-xs uppercase tracking-widest hidden sm:block group-hover:tracking-[0.2em] transition-all">Menu</span>
        <Menu size={24} strokeWidth={1} />
      </button>
    </motion.header>
  );
};

const FullScreenMenu = ({ isOpen, toggleMenu, setView }) => {
  const menuVariants = {
    closed: { y: "-100%" },
    open: { y: 0, transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } }
  };

  const handleNav = (viewName) => {
    setView(viewName);
    toggleMenu();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          variants={menuVariants}
          initial="closed"
          animate="open"
          exit="closed"
          className="fixed inset-0 bg-[#1A1A1A] text-[#F4F4F0] z-50 flex flex-col justify-between p-10 md:p-20"
        >
          <div className="w-full flex justify-end">
            <button onClick={toggleMenu} className="hover:rotate-90 transition-transform duration-500">
              <X size={32} strokeWidth={1} />
            </button>
          </div>

          <nav className="flex flex-col gap-4 md:gap-8">
            {["home", "stories", "visuals", "shop", "top"].map((item, i) => (
              <div key={item} className="overflow-hidden">
                <motion.button
                  initial={{ y: 100, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 * i }}
                  onClick={() => handleNav(item)}
                  className="text-5xl md:text-8xl font-serif italic hover:text-[#D6D6D2] hover:pl-10 transition-all duration-500 block text-left capitalize"
                >
                  {item}
                </motion.button>
              </div>
            ))}
          </nav>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

/* --- VIEWS (Updated with Reveal for Sections) --- */

// 1. HOME VIEW
const HomeView = ({ setView, onStoryClick, onIndexClick }) => {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <Hero />
      <Marquee />
      <FeaturedStories onStoryClick={onStoryClick} />
      <InteractiveList onIndexClick={onIndexClick} />
      <VisualEssay setView={setView} />
      <FocusSections onStoryClick={onStoryClick} />
    </motion.div>
  );
};

// 2. STORIES VIEW
const StoriesView = () => {
  return (
    <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="pt-32 min-h-screen">
      <div className="container mx-auto px-6 md:px-12 mb-24">
        <Reveal>
          <h1 className="text-6xl md:text-9xl font-serif mb-8 text-[#1A1A1A]">Stories</h1>
          <p className="font-mono text-xs uppercase tracking-widest max-w-md text-gray-500">
            A collection of thoughts on life, nature, and the shifting paradigms of our world.
          </p>
        </Reveal>
      </div>
      <section className="bg-[#EAEAE5] py-24 px-6 md:px-12 border-y border-[#D6D6D2]">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          <div className="md:col-span-4">
            <Reveal>
              <span className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest mb-4"><Star size={12} /> Reflections</span>
              <h2 className="text-4xl font-serif italic">The Art of Being</h2>
            </Reveal>
          </div>
          <div className="md:col-span-8 grid gap-12">
            {REFLECTIONS.map((ref, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className="border-b border-gray-400 pb-8 last:border-0">
                  <h3 className="text-2xl font-serif mb-2">{ref.title}</h3>
                  <p className="font-sans text-gray-600 leading-relaxed">{ref.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      <section className="py-24 px-6 md:px-12">
        <Reveal>
          <div className="flex justify-between items-end mb-12">
            <span className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest"><Leaf size={12} /> Nature & Life</span>
          </div>
        </Reveal>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Reveal>
            <div className="relative h-[80vh] group overflow-hidden">
              <img src="https://picsum.photos/seed/nature1/800/1200" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000" />
              <div className="absolute bottom-6 left-6 text-white mix-blend-difference">
                <h3 className="text-4xl font-serif italic">Return to Earth</h3>
              </div>
            </div>
          </Reveal>
          <div className="flex flex-col gap-4">
            <Reveal delay={0.2}>
              <div className="h-[40vh] bg-gray-200 overflow-hidden relative group">
                <img src="https://picsum.photos/seed/nature2/800/600" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000" />
                <div className="absolute bottom-4 left-4 text-white mix-blend-difference">
                  <h3 className="text-xl font-serif">Organic Forms</h3>
                </div>
              </div>
            </Reveal>
            <Reveal delay={0.4}>
              <div className="h-[40vh] bg-gray-200 overflow-hidden relative group">
                <img src="https://picsum.photos/seed/nature3/800/600" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000" />
                <div className="absolute bottom-4 left-4 text-white mix-blend-difference">
                  <h3 className="text-xl font-serif">Silent Growth</h3>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
      <section className="py-24 px-6 md:px-12 bg-[#1A1A1A] text-[#F4F4F0]">
        <Reveal>
          <div className="border-b border-gray-700 pb-12 mb-12 flex justify-between items-end">
            <h2 className="text-5xl md:text-7xl font-serif">World Shift</h2>
            <Globe className="animate-spin-slow" size={48} strokeWidth={1} />
          </div>
        </Reveal>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 font-mono text-sm">
          <Reveal delay={0.1}><p className="opacity-70 leading-relaxed text-justify">The geopolitical landscape is shifting beneath our feet...</p></Reveal>
          <Reveal delay={0.2}><p className="opacity-70 leading-relaxed text-justify">Climate migration is no longer a future concept; it is happening now...</p></Reveal>
          <Reveal delay={0.3}><p className="opacity-70 leading-relaxed text-justify">Technological singularities are approaching. AI is writing our poetry...</p></Reveal>
        </div>
      </section>
    </motion.div>
  );
};

// 3. VISUALS VIEW
const VisualsView = () => {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="pt-32 min-h-screen">
      <div className="px-6 md:px-12 mb-12">
        <Reveal>
          <h1 className="text-6xl md:text-9xl font-serif text-center">Visuals</h1>
        </Reveal>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0">
        {[...Array(9)].map((_, i) => (
          <Reveal key={i} delay={i % 3 * 0.1}>
            <div className="aspect-square relative group overflow-hidden border border-[#D6D6D2]">
              <img src={`https://picsum.photos/seed/gallery${i}/800/800`} className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700 ease-in-out" />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <span className="font-serif text-3xl italic text-white">Vision {i + 1}</span>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </motion.div>
  );
};

// 4. SHOP VIEW
const ShopView = () => {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="pt-32 min-h-screen">
      <div className="container mx-auto px-6 md:px-12">
        <Reveal>
          <div className="flex justify-between items-end mb-24 border-b border-[#D6D6D2] pb-8">
            <h1 className="text-5xl md:text-8xl font-serif">Shop</h1>
            <span className="font-mono text-xs uppercase tracking-widest">Sponsored Curations</span>
          </div>
        </Reveal>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-24">
          {SHOP_ITEMS.map((item, i) => (
            <Reveal key={item.id} delay={i * 0.1}>
              <div className="group cursor-pointer">
                <div className="bg-gray-200 aspect-[3/4] mb-6 overflow-hidden relative">
                  <img src={item.img} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute top-4 right-4 bg-white px-3 py-1 font-mono text-xs shadow-lg">{item.sponsor}</div>
                </div>
                <div className="flex justify-between items-start">
                  <div><h3 className="font-serif text-xl mb-1">{item.name}</h3><p className="font-mono text-xs text-gray-500">{item.price}</p></div>
                  <button className="p-2 border border-gray-300 rounded-full hover:bg-black hover:text-white transition-colors"><ShoppingBag size={16} /></button>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

// 5. TOP VIEW
const TopView = () => {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="pt-32 min-h-screen bg-[#F4F4F0]">
      <div className="container mx-auto px-6 md:px-12 max-w-4xl">
        <Reveal>
          <h1 className="text-5xl md:text-8xl font-serif mb-16 text-center">Top Reads</h1>
        </Reveal>
        <div className="flex flex-col gap-4">
          {TOP_ARTICLES.map((article, i) => (
            <Reveal key={article.id} delay={i * 0.1}>
              <div className="group border border-[#D6D6D2] p-8 md:p-12 hover:bg-white hover:shadow-xl transition-all duration-300 cursor-pointer flex items-center justify-between">
                <div className="flex items-center gap-8 md:gap-16">
                  <span className="font-serif text-4xl md:text-6xl text-gray-300 group-hover:text-[#1A1A1A] transition-colors italic">{article.rank}</span>
                  <div>
                    <h3 className="text-2xl md:text-3xl font-serif mb-2 group-hover:underline decoration-1 underline-offset-4">{article.title}</h3>
                    <div className="font-mono text-xs text-gray-500 flex gap-4"><span>By {article.author}</span><span>•</span><span>{article.views}</span></div>
                  </div>
                </div>
                <ArrowRight className="opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all duration-300" />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

// FOOTER
const BrutalistFooter = ({ setView }) => {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
  const handleNav = (view) => { setView(view); scrollToTop(); };

  return (
    <footer className="relative bg-[#1A1A1A] text-[#F4F4F0] min-h-screen flex flex-col justify-between overflow-hidden">
      <div className="absolute inset-0 grid grid-cols-4 md:grid-cols-6 pointer-events-none opacity-10">
        {[...Array(6)].map((_, i) => (<div key={i} className="border-r border-[#F4F4F0] h-full" />))}
      </div>
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 border-b border-gray-800 flex-grow">
        <div className="lg:col-span-8 p-8 md:p-16 md:border-r border-gray-800 flex flex-col justify-center gap-12">
          <Reveal>
            <div className="uppercase tracking-widest text-xs text-gray-500 font-mono mb-4">( Stay in the loop )</div>
            <div>
              <h3 className="text-4xl md:text-6xl font-serif italic mb-8">Join the cult(ure).</h3>
              <div className="relative border-b border-gray-700">
                <input type="email" placeholder="Email Address" className="w-full bg-transparent text-2xl py-4 focus:outline-none placeholder:text-gray-700" />
              </div>
            </div>
          </Reveal>
        </div>
        <div className="lg:col-span-4 grid grid-cols-2 grid-rows-2">
          {[{ label: "Stories", id: "stories" }, { label: "Visuals", id: "visuals" }, { label: "Shop", id: "shop" }, { label: "Top", id: "top" }].map((item, i) => (
            <button key={item.label} onClick={() => handleNav(item.id)} className="group border-r border-b border-gray-800 last:border-r-0 flex flex-col justify-between p-6 hover:bg-[#F4F4F0] hover:text-[#1A1A1A] transition-colors relative overflow-hidden h-full text-left">
              <span className="font-mono text-xs opacity-50">0{i + 1}</span>
              <div className="flex justify-between items-end w-full">
                <span className="font-serif text-3xl italic group-hover:translate-x-2 transition-transform">{item.label}</span>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity"><ArrowUpRight size={24} /></div>
              </div>
            </button>
          ))}
        </div>
      </div>
      <div className="p-6 md:p-8 flex flex-col md:flex-row justify-between items-end gap-6 text-gray-500 font-mono text-xs uppercase tracking-widest bg-[#1A1A1A]">
        <div className="flex gap-8"><span>Privacy</span><span>Terms</span><span>Sitemap</span></div>
        <div>Velvet Mag © 2024</div>
      </div>
    </footer>
  );
};

/* --- MAIN APP WRAPPER --- */
export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentView, setCurrentView] = useState('home');
  const [activeStory, setActiveStory] = useState(null); // For Full Page Articles
  const [activeIndexItem, setActiveIndexItem] = useState(null); // For Archive Drawer
  const lenisRef = useRef(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = "https://cdn.jsdelivr.net/gh/studio-freight/lenis@1.0.29/bundled/lenis.min.js";
    script.async = true;
    script.onload = () => {
      const lenis = new window.Lenis({
        duration: 0.9,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        smooth: true,
      });
      lenisRef.current = lenis;
      function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);
    };
    document.body.appendChild(script);
    return () => document.body.removeChild(script);
  }, []);

  useEffect(() => {
    if (lenisRef.current) lenisRef.current.scrollTo(0, { immediate: true });
    window.scrollTo(0, 0);
  }, [currentView]);

  // Effect to lock main scroll when modal/article is open
  useEffect(() => {
    const isModalOpen = activeStory || activeIndexItem;

    if (lenisRef.current) {
      if (isModalOpen) {
        lenisRef.current.stop();
        document.body.classList.add('locked');
      } else {
        lenisRef.current.start();
        document.body.classList.remove('locked');
      }
    }
  }, [activeStory, activeIndexItem]);

  return (
    <div className="bg-[#F4F4F0] min-h-screen selection:bg-black selection:text-white flex flex-col">
      <GlobalStyles />

      {/* 1. Article Full Page View */}
      <AnimatePresence>
        {activeStory && (
          <ArticleView story={activeStory} onClose={() => setActiveStory(null)} />
        )}
      </AnimatePresence>

      {/* 2. Archive Technical Drawer */}
      <AnimatePresence>
        {activeIndexItem && (
          <ArchivePanel item={activeIndexItem} onClose={() => setActiveIndexItem(null)} />
        )}
      </AnimatePresence>

      <Header toggleMenu={() => setIsMenuOpen(!isMenuOpen)} setView={setCurrentView} />
      <FullScreenMenu isOpen={isMenuOpen} toggleMenu={() => setIsMenuOpen(false)} setView={setCurrentView} />

      <main className="relative z-10 flex-grow">
        <AnimatePresence mode="wait">
          {currentView === 'home' && <HomeView key="home" setView={setCurrentView} onStoryClick={setActiveStory} onIndexClick={setActiveIndexItem} />}
          {currentView === 'stories' && <StoriesView key="stories" />}
          {currentView === 'visuals' && <VisualsView key="visuals" />}
          {currentView === 'shop' && <ShopView key="shop" />}
          {currentView === 'top' && <TopView key="top" />}
        </AnimatePresence>
      </main>

      <BrutalistFooter setView={setCurrentView} />
    </div>
  );
}