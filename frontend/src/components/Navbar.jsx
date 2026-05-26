import React from 'react';

function Navbar() {
  const navStyle = {
    display: 'flex',
    justifyContent: 'between',
    alignItems: 'center',
    background: '#1b4332', // Dark green NGO theme color
    color: 'white',
    padding: '15px 30px',
    borderRadius: '8px'
  };

  const linkStyle = {
    color: 'white',
    textDecoration: 'none',
    marginLeft: '20px',
    fontWeight: 'bold'
  };

  return (
    <nav style={navStyle}>
      <h2>🌱 NGO For Betterment</h2>
      <div style={{ marginLeft: 'auto' }}>
        <a href="#" style={linkStyle}>Home</a>
        <a href="#" style={linkStyle}>About Us</a>
        <a href="#" style={linkStyle}>Events</a>
        <a href="#" style={{...linkStyle, background: '#ee9b00', padding: '8px 15px', borderRadius: '5px'}}>Donate Now</a>
      </div>
    </nav>
  );
}

export default Navbar;