const Header = () => (
  <header
    style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      backgroundColor: '#3498db',
      color: 'white',
      padding: '20px',
      textAlign: 'center',
      fontSize: '2rem',
      fontWeight: 'bold',
      borderRadius: '8px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      zIndex: 1000,
      letterSpacing: '1px',
      marginBottom: '20px',
      width: '100%',
    }}
  >
    Electric Vehicle Population Dashboard
  </header>
);

export default Header;
