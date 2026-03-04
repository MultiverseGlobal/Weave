import React from 'react';
import './CamelotBadge.css';

const CamelotBadge = ({ code }) => {
    if (!code || code === '—') return <span className="camelot-badge-empty">—</span>;

    // Extract number and letter (e.g., "8A")
    const num = parseInt(code);
    const type = code.slice(-1); // A or B

    return (
        <div className={`camelot-badge ${type === 'B' ? 'major' : 'minor'}`}>
            <span className="badge-num">{num}</span>
            <span className="badge-type">{type}</span>
        </div>
    );
};

export default CamelotBadge;
