import React from 'react';

const ColorCard = ({ hex }) => {
    const copyToClipboard = () => {
        navigator.clipboard.writeText(hex);
        alert(`Copied ${hex}`);
    };

    return (
        <div className="p-4 rounded shadow-md text-center" style={{ backgroundColor: hex }}>
            <p className="text-white font-bold">{hex}</p>
            <button onClick={copyToClipboard} className="mt-2 bg-white text-black px-2 py-1 rounded text-lg">
                Copy
            </button>
        </div>
    );
};

export default ColorCard;
