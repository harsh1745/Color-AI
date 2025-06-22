import React, { useState, useEffect } from "react";
import { getColorsFromGemini } from "./api/gemini";
import { getColorName } from "./api/getColorName";
import AOS from "aos";
import "aos/dist/aos.css";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export default function App() {
    const [keyword, setKeyword] = useState("");
    const [colors, setColors] = useState([]);
    const [loading, setLoading] = useState(false);
    const [darkMode, setDarkMode] = useState(true);

    useEffect(() => {
        const saved = localStorage.getItem("darkMode");
        if (saved) setDarkMode(JSON.parse(saved));
    }, []);

    useEffect(() => {
        localStorage.setItem("darkMode", JSON.stringify(darkMode));
    }, [darkMode]);

    useEffect(() => {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true,
        });
    }, []);

    const handleSearch = async () => {
        if (!keyword.trim()) return;
        setColors([]);
        setLoading(true);
        try {
            const hexes = await getColorsFromGemini(keyword);
            const paddedHexes =
                hexes.length >= 20
                    ? hexes.slice(0, 20)
                    : [...hexes, ...Array(20 - hexes.length).fill(hexes[0])];

            const colorsWithNames = await Promise.all(
                paddedHexes.map(async (hex) => {
                    const name = await getColorName(hex);
                    return { hex, name };
                })
            );
            setColors(colorsWithNames);
        } catch (error) {
            console.error("Error fetching colors:", error);
        } finally {
            setLoading(false);
        }
    };

    // const copyToClipboard = (hex) => {
    //     navigator.clipboard.writeText(hex);
    //     toast.success(`Copied ${hex} to clipboard!`, {
    //         position: "top-center",
    //         autoClose: 1500,
    //         hideProgressBar: true,
    //         closeOnClick: true,
    //         pauseOnHover: false,
    //         draggable: true,
    //         theme: darkMode ? "dark" : "light",
    //     });
    // };
    const copyToClipboard = async (hex) => {
        try {
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(hex);
            } else {
                // fallback for mobile/insecure context
                const textArea = document.createElement("textarea");
                textArea.value = hex;
                textArea.style.position = "fixed";
                textArea.style.left = "-999999px";
                textArea.style.top = "-999999px";
                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();
                document.execCommand("copy");
                textArea.remove();
            }

            toast.success(`Copied ${hex} to clipboard!`, {
                position: "top-center",
                autoClose: 1500,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                theme: darkMode ? "dark" : "light",
            });
        } catch (err) {
            toast.error("Copy failed!", {
                position: "top-center",
                autoClose: 1500,
                theme: darkMode ? "dark" : "light",
            });
            console.error("Clipboard error:", err);
        }
    };


    return (
        <div className={`${darkMode ? "dark" : ""}`}>
            <div className="w-full min-h-screen bg-white dark:bg-black text-black dark:text-white p-4 md:p-6 flex flex-col items-center transition-colors duration-500">

                {/* Header */}
                <h1
                    className="text-[2.5rem] sm:text-[3.5rem] md:text-[4.5rem] font-sketch font-bold my-4 flex items-center gap-2 text-transparent bg-clip-text bg-[#BE5B50] dark:bg-[#FBDB93]"
                    data-aos="fade-down"
                >
                    <i className="fa-solid fa-palette"></i> AI Color Palette
                </h1>

                {/* Input, Generate Button & Dark Mode Toggle */}
                <div className="flex flex-col sm:flex-row gap-2 mb-8 w-full max-w-4xl flex-wrap justify-center" data-aos="fade-up">
                    <input
                        type="text"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        placeholder="Enter a keyword like galaxy, forest..."
                        className="w-full sm:flex-1 min-w-[220px] px-5 py-3 rounded-full border border-gray-300 dark:border-white/10 bg-white/80 dark:bg-white/10 backdrop-blur text-black dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[#BE5B50] dark:focus:ring-[#FBDB93]"
                    />

                    <button
                        onClick={handleSearch}
                        disabled={loading}
                        className="w-full sm:w-auto bg-[#BE5B50] dark:bg-[#FBDB93] px-4 py-2 rounded-full text-[#FBDB93] dark:text-[#521C0D] font-semibold transition-transform whitespace-nowrap disabled:opacity-50 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-[#FBDB93] dark:focus:ring-[#FBDB93]"
                    >
                        <i className="fa-solid fa-wand-magic-sparkles"></i>
                        {loading ? "Generating..." : "Generate"}
                    </button>

                    <button
                        onClick={() => setDarkMode(!darkMode)}
                        className={`w-full sm:w-auto px-4 py-2 rounded-full font-semibold transition flex items-center justify-center gap-2
    ${darkMode
                                ? "bg-[#FBDB93] text-[#521C0D]"
                                : "bg-[#BE5B50] text-[#FBDB93]"}
  `}
                    >
                        <i className={`fa-solid ${darkMode ? "fa-sun" : "fa-moon"}`}></i>
                        {darkMode ? "Light" : "Dark"} Mode
                    </button>

                </div>

                {/* Loading Skeleton */}
                {loading && (
                    <div className="w-full max-w-6xl">
                        <p className="text-[#BE5B50] dark:text-[#FBDB93] font-bold text-center mb-6 animate-pulse">
                            Generating your palette...
                        </p>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {Array(20)
                                .fill(0)
                                .map((_, index) => (
                                    <div
                                        key={index}
                                        className="w-full h-32 rounded-xl bg-gray-800 animate-pulse"
                                    />
                                ))}
                        </div>
                    </div>
                )}

                {/* Color Cards */}
                {!loading && (
                    colors.length === 0 ? (
                        <div className="text-center mt-32 opacity-80" data-aos="fade-up">
                            <i className="fa-solid fa-palette text-5xl text-[#BE5B50] dark:text-[#FBDB93]"></i>
                            <h2 className="text-2xl font-sketch font-semibold mt-4 text-[#BE5B50] dark:text-[#FBDB93]">No colors generated yet</h2>
                            <p className="text-[#BE5B50] dark:text-[#FBDB93] font-sketch">
                                Enter a prompt above to generate a beautiful color palette
                            </p>
                        </div>
                    ) : (
                        <div className="w-full max-w-6xl" data-aos="fade-up">
                            <h2 className="text-xl font-medium mb-6 text-left">
                                Colors for "{keyword}"
                            </h2>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                {colors.map(({ hex, name }, index) => (
                                    <div
                                        key={index}
                                        onClick={() => copyToClipboard(hex)}
                                        data-aos="zoom-in"
                                        data-aos-delay={index * 50}
                                        className="w-full h-32 rounded-xl cursor-pointer shadow-md hover:scale-105 transition-transform flex flex-col justify-between p-3"
                                        style={{ backgroundColor: hex }}
                                    >
                                        <span className="text-white font-bold text-lg drop-shadow-lg">
                                            {hex}
                                        </span>
                                        <span className="text-white text-sm font-medium drop-shadow-lg">
                                            {name}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )
                )}

                {/* Clear Button */}
                {!loading && colors.length > 0 && (
                    <div className="w-full flex justify-center mt-10 mb-16"> {/* 👈 Extra bottom margin added */}
                        <button
                            onClick={() => setColors([])}
                            className="px-6 py-2 rounded-full bg-red-500 hover:bg-red-600 transition text-white font-semibold"
                        >
                            Clear Palette
                        </button>
                    </div>
                )}
                {/* Toast Container */}
                <ToastContainer />
                {/* Social Footer */}
                <footer className="fixed bottom-4 left-1/2 transform -translate-x-1/2 flex gap-6 bg-white/80 dark:bg-black/80 backdrop-blur px-6 py-3 rounded-full shadow-md z-50">
                    <a
                        href="https://github.com/harsh1745"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-black dark:text-white hover:text-[#BE5B50] dark:hover:text-[#FBDB93] text-xl transition"
                    >
                        <i className="fab fa-github"></i>
                    </a>
                    <a
                        href="https://www.linkedin.com/in/harsh-makwana174/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-black dark:text-white hover:text-[#0077b5] text-xl transition"
                    >
                        <i className="fab fa-linkedin"></i>
                    </a>
                </footer>


            </div>
        </div>
    );
}
