import React, { useState } from 'react';

const SearchBar = ({ onSearch }) => {
    const [keyword, setKeyword] = useState('');

    const handleSearch = () => {
        if (keyword.trim()) onSearch(keyword);
    };

    return (
        <div className="flex flex-col sm:flex-row gap-2 w-full">
            <input
                type="text"
                placeholder="Enter a keyword (e.g., forest, facebook)"
                className="border p-2 rounded w-full sm:flex-1"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
            />
            <button
                className="bg-blue-500 text-white px-4 py-2 rounded w-full sm:w-auto"
                onClick={handleSearch}
            >
                Generate
            </button>
        </div>
    );
};

export default SearchBar;
