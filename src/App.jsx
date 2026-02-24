import './App.css';
import Navbar from './sections/Navbar';
import Hero from './sections/Hero';
import Skills from './sections/Skills';
import Projects from './sections/Projects';
import About from './sections/About';
import Contact from './sections/Contact';
import Footer from './sections/Footer';

export default function App() {
  return (
    <>
      {/* Animated background blobs */}
      <div className="bg-blobs" aria-hidden="true">
        <div className="blob blob--1" />
        <div className="blob blob--2" />
        <div className="blob blob--3" />
      </div>

      {/* Noise / grain overlay */}
      <div className="noise-overlay" aria-hidden="true" />

      {/* Main content */}
      <Navbar />
      <main>
        <Hero />
        <Skills />
        <Projects />
        <About />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
