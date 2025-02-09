import React from 'react'

export default function Loader({ size }) {
    return (
        <div className="bouncing-loader">
            <span style={{ width: `${size}px`, height: `${size}px`, margin: `${size / 4}px` }}></span>
            <span style={{ width: `${size}px`, height: `${size}px`, margin: `${size / 4}px` }}></span>
            <span style={{ width: `${size}px`, height: `${size}px`, margin: `${size / 4}px` }}></span>
        </div>
    )
}
