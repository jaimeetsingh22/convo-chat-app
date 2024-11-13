import React from 'react'
import "./style.css"

const TypingLayout = () => { 
    return (
        <div
            style={{
                color: 'black',
                borderRadius: '10px 20px 10px 20px',
                padding: '0rem',
                height:"1.5rem",
                width: '3rem',
                marginTop:"2rem"
            }}
        >
            <div className="box">
                <div className="dot1"></div>
                <div className="dot2"></div>
                <div className="dot3"></div>
            </div>
        </div>
    )
}

export default TypingLayout