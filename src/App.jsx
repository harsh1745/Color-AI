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

    const copyToClipboard = (hex) => {
        navigator.clipboard.writeText(hex);
        toast.success(`Copied ${hex} to clipboard!`, {
            position: "top-center",
            autoClose: 1500,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            theme: darkMode ? "dark" : "light",
        });
    };

    return (
        <div className={`${darkMode ? "dark" : ""}`}>
            <div className="w-full min-h-screen bg-white dark:bg-black text-black dark:text-white p-6 flex flex-col items-center transition-colors duration-500">

                {/* Header */}
                <h1
                    className="text-[4.5rem] font-sketch font-bold my-4 flex items-center gap-2 text-transparent bg-clip-text bg-[#BE5B50] dark:bg-[#FBDB93]"
                    data-aos="fade-down"
                >
                    <i className="fa-solid fa-palette"></i> AI Color Palette
                </h1>

                {/* Input, Generate Button & Dark Mode Toggle */}
                <div className="flex gap-2 mb-8 w-full max-w-4xl flex-wrap justify-center" data-aos="fade-up">
                    <input
                        type="text"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        placeholder="Enter a keyword like galaxy, forest..."
                        className="flex-1 min-w-[220px] px-5 py-3 rounded-full border border-gray-300 dark:border-white/10 bg-white/80 dark:bg-white/10 backdrop-blur text-black dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[#BE5B50] dark:focus:ring-[#FBDB93]"
                    />

                    <button
                        onClick={handleSearch}
                        disabled={loading}
                        className="bg-[#BE5B50] dark:bg-[#FBDB93] px-4 py-2 rounded-full text-[#FBDB93] dark:text-[#521C0D] font-semibold hover:scale-105 transition-transform whitespace-nowrap disabled:opacity-50 flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-[#FBDB93] dark:focus:ring-[#FBDB93]"
                    >
                        <i className="fa-solid fa-wand-magic-sparkles"></i>
                        {loading ? "Generating..." : "Generate"}
                    </button>

                    <button
                        onClick={() => setDarkMode(!darkMode)}
                        className="px-4 py-2 text-sm rounded-full font-semibold bg-gray-200 dark:bg-gray-700 dark:text-white text-black transition flex items-center gap-2"
                    >
                        <i className={`fa-solid ${darkMode ? "fa-moon" : "fa-sun"}`}></i>
                        {darkMode ? "Dark" : "Light"} Mode
                    </button>
                </div>

                {/* Loading Skeleton */}
                {loading && (
                    <div className="w-full max-w-6xl">
                        <p className="text-[#BE5B50] dark:text-[#FBDB93] font-bold text-center mb-6 animate-pulse">
                            Generating your palette...
                        </p>
                        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4">
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
                            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4">
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
                    <button
                        onClick={() => setColors([])}
                        className="mt-10 px-6 py-2 rounded-full bg-red-500 hover:bg-red-600 transition"
                    >
                        Clear Palette
                    </button>
                )}

                {/* Toast Container */}
                <ToastContainer />
            </div>
        </div>
    );
}
