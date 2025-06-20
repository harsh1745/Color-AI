import React, { useState } from 'react';

const SearchBar = ({ onSearch }) => {
    const [keyword, setKeyword] = useState('');

    const handleSearch = () => {
        if (keyword.trim()) onSearch(keyword);
    };

    return (
        <div className="flex gap-2">
            <input
                type="text"
                placeholder="Enter a keyword (e.g., forest, facebook)"
                className="border p-2 rounded w-full"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
            />
            <button
                className="bg-blue-500 text-white px-4 py-2 rounded"
                onClick={handleSearch}
            >
                Generate
            </button>
        </div>
    );
};

export default SearchBar;
