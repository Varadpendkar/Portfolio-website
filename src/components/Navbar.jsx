import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiDownload, FiMenu, FiX } from "react-icons/fi";

const NAV_ITEMS = [
  { id: "about", label: "About" },
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Skills" },
  { id: "contact", label: "Contact" },
];

const Navbar = ({ activeSection, onNavigate, resumeUrl }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navigate = (id) => {
    onNavigate(id);
    setIsOpen(false);
  };

  return (
    <header className={`navbar ${isScrolled ? "navbar--scrolled" : ""}`}>
      <button className="nav-logo" onClick={() => navigate("hero")}>
        VP
      </button>

      <nav className="nav-links nav-links--desktop" aria-label="Primary">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => navigate(item.id)}
            className={`nav-link ${activeSection === item.id ? "is-active" : ""}`}
          >
            {item.label}
          </button>
        ))}
      </nav>

      <div className="nav-actions">
        <a className="resume-btn" href={resumeUrl} download>
          <FiDownload />
          Download Resume
        </a>
        <button
          className="mobile-menu-btn"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-label="Toggle menu"
        >
          {isOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="mobile-menu"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.25 }}
          >
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => navigate(item.id)}
                className={`mobile-nav-link ${activeSection === item.id ? "is-active" : ""}`}
              >
                {item.label}
              </button>
            ))}

            <a
              className="resume-btn resume-btn--mobile"
              href={resumeUrl}
              download
            >
              <FiDownload />
              Download Resume
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
