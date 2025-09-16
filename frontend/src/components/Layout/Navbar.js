import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { 
  FaLeaf, 
  FaBars, 
  FaTimes, 
  FaUser, 
  FaSignOutAlt, 
  FaSun, 
  FaMoon,
  FaCog
} from 'react-icons/fa';
import styled from 'styled-components';

const NavbarContainer = styled.nav`
  background: ${props => props.theme === 'dark' ? '#1a1a1a' : '#ffffff'};
  box-shadow: var(--shadow-md);
  position: sticky;
  top: 0;
  z-index: 1000;
  transition: var(--transition);
`;

const NavContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  max-width: 1200px;
  margin: 0 auto;
  padding-left: 1rem;
  padding-right: 1rem;
`;

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  font-weight: 700;
  font-size: 1.5rem;
  color: var(--primary);
  text-decoration: none;
  transition: var(--transition);

  &:hover {
    color: var(--primary-dark);
  }

  svg {
    margin-right: 0.5rem;
    font-size: 1.8rem;
  }
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;

  @media (max-width: 768px) {
    display: none;
  }
`;

const NavLink = styled(Link)`
  color: ${props => props.theme === 'dark' ? '#e2e8f0' : '#2d3748'};
  text-decoration: none;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: var(--border-radius);
  transition: var(--transition);
  position: relative;

  &:hover {
    color: var(--primary);
    background: ${props => props.theme === 'dark' ? 'rgba(46, 204, 113, 0.1)' : 'rgba(46, 204, 113, 0.05)'};
  }

  &.active {
    color: var(--primary);
    background: ${props => props.theme === 'dark' ? 'rgba(46, 204, 113, 0.15)' : 'rgba(46, 204, 113, 0.1)'};
  }
`;

const AuthButtons = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;

  @media (max-width: 768px) {
    display: none;
  }
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  border-radius: var(--border-radius);
  font-weight: 500;
  transition: var(--transition);
  cursor: pointer;
  border: none;
  font-size: 0.9rem;

  &.primary {
    background: var(--primary);
    color: white;

    &:hover {
      background: var(--primary-dark);
    }
  }

  &.outline {
    background: transparent;
    color: var(--primary);
    border: 1px solid var(--primary);

    &:hover {
      background: var(--primary);
      color: white;
    }
  }

  &.icon {
    background: transparent;
    color: ${props => props.theme === 'dark' ? '#e2e8f0' : '#2d3748'};
    padding: 0.5rem;
    border-radius: 50%;

    &:hover {
      background: ${props => props.theme === 'dark' ? 'rgba(46, 204, 113, 0.1)' : 'rgba(46, 204, 113, 0.05)'};
      color: var(--primary);
    }
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  background: transparent;
  border: none;
  color: ${props => props.theme === 'dark' ? '#e2e8f0' : '#2d3748'};
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;

  @media (max-width: 768px) {
    display: block;
  }
`;

const MobileMenu = styled(motion.div)`
  display: none;
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: ${props => props.theme === 'dark' ? '#1a1a1a' : '#ffffff'};
  box-shadow: var(--shadow-lg);
  border-top: 1px solid ${props => props.theme === 'dark' ? '#2d3748' : '#e2e8f0'};

  @media (max-width: 768px) {
    display: block;
  }
`;

const MobileMenuContent = styled.div`
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const UserMenu = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const UserAvatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--primary);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 0.9rem;
`;

const DropdownMenu = styled(motion.div)`
  position: absolute;
  top: 100%;
  right: 0;
  background: ${props => props.theme === 'dark' ? '#1a1a1a' : '#ffffff'};
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-lg);
  border: 1px solid ${props => props.theme === 'dark' ? '#2d3748' : '#e2e8f0'};
  min-width: 200px;
  overflow: hidden;
  z-index: 1000;
`;

const DropdownItem = styled.button`
  width: 100%;
  padding: 0.75rem 1rem;
  background: transparent;
  border: none;
  color: ${props => props.theme === 'dark' ? '#e2e8f0' : '#2d3748'};
  text-align: left;
  cursor: pointer;
  transition: var(--transition);
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    background: ${props => props.theme === 'dark' ? 'rgba(46, 204, 113, 0.1)' : 'rgba(46, 204, 113, 0.05)'};
    color: var(--primary);
  }
`;

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
    setUserMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About' },
  ];

  const protectedLinks = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/calculator', label: 'Calculator' },
    { path: '/activities', label: 'Activities' },
    { path: '/achievements', label: 'Achievements' },
  ];

  const allLinks = isAuthenticated ? [...navLinks, ...protectedLinks] : navLinks;

  return (
    <NavbarContainer theme={theme}>
      <NavContent>
        <Logo to="/">
          <FaLeaf />
          EcoTrack
        </Logo>

        <NavLinks>
          {allLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={isActive(link.path) ? 'active' : ''}
              theme={theme}
            >
              {link.label}
            </NavLink>
          ))}
        </NavLinks>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Button
            className="icon"
            onClick={toggleTheme}
            theme={theme}
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? <FaMoon /> : <FaSun />}
          </Button>

          {isAuthenticated ? (
            <UserMenu>
              <Button
                className="icon"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                theme={theme}
              >
                <UserAvatar>
                  {user?.username?.charAt(0).toUpperCase()}
                </UserAvatar>
              </Button>

              <AnimatePresence>
                {userMenuOpen && (
                  <DropdownMenu
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    theme={theme}
                  >
                    <DropdownItem
                      onClick={() => {
                        navigate('/profile');
                        setUserMenuOpen(false);
                      }}
                      theme={theme}
                    >
                      <FaUser />
                      Profile
                    </DropdownItem>
                    <DropdownItem
                      onClick={() => {
                        navigate('/profile');
                        setUserMenuOpen(false);
                      }}
                      theme={theme}
                    >
                      <FaCog />
                      Settings
                    </DropdownItem>
                    <DropdownItem
                      onClick={handleLogout}
                      theme={theme}
                    >
                      <FaSignOutAlt />
                      Logout
                    </DropdownItem>
                  </DropdownMenu>
                )}
              </AnimatePresence>
            </UserMenu>
          ) : (
            <AuthButtons>
              <Button
                className="outline"
                onClick={() => navigate('/login')}
              >
                Login
              </Button>
              <Button
                className="primary"
                onClick={() => navigate('/register')}
              >
                Register
              </Button>
            </AuthButtons>
          )}

          <MobileMenuButton
            onClick={toggleMobileMenu}
            theme={theme}
          >
            {mobileMenuOpen ? <FaTimes /> : <FaBars />}
          </MobileMenuButton>
        </div>
      </NavContent>

      <AnimatePresence>
        {mobileMenuOpen && (
          <MobileMenu
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            theme={theme}
          >
            <MobileMenuContent>
              {allLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={isActive(link.path) ? 'active' : ''}
                  theme={theme}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </NavLink>
              ))}
              
              {!isAuthenticated && (
                <>
                  <Button
                    className="outline"
                    onClick={() => {
                      navigate('/login');
                      setMobileMenuOpen(false);
                    }}
                    style={{ marginTop: '1rem' }}
                  >
                    Login
                  </Button>
                  <Button
                    className="primary"
                    onClick={() => {
                      navigate('/register');
                      setMobileMenuOpen(false);
                    }}
                  >
                    Register
                  </Button>
                </>
              )}
            </MobileMenuContent>
          </MobileMenu>
        )}
      </AnimatePresence>
    </NavbarContainer>
  );
};

export default Navbar;
