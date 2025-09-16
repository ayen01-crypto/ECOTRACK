import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { 
  FaLeaf, 
  FaFacebookF, 
  FaTwitter, 
  FaInstagram, 
  FaLinkedinIn,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope
} from 'react-icons/fa';
import styled from 'styled-components';

const FooterContainer = styled.footer`
  background: ${props => props.theme === 'dark' ? '#1a1a1a' : '#2c3e50'};
  color: white;
  padding: 3rem 0 1rem;
  margin-top: 4rem;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
`;

const FooterSection = styled.div`
  h3 {
    margin-bottom: 1rem;
    font-size: 1.2rem;
    color: var(--primary);
  }

  p {
    color: #bdc3c7;
    line-height: 1.6;
    margin-bottom: 1rem;
  }

  ul {
    list-style: none;
  }

  li {
    margin-bottom: 0.5rem;
  }

  a {
    color: #bdc3c7;
    text-decoration: none;
    transition: var(--transition);

    &:hover {
      color: var(--primary);
    }
  }
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  font-weight: 700;
  font-size: 1.5rem;
  color: var(--primary);
  margin-bottom: 1rem;

  svg {
    margin-right: 0.5rem;
    font-size: 1.8rem;
  }
`;

const SocialIcons = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;

  a {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 50%;
    color: white;
    transition: var(--transition);

    &:hover {
      background: var(--primary);
      transform: translateY(-2px);
    }
  }
`;

const ContactInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  color: #bdc3c7;

  svg {
    color: var(--primary);
  }
`;

const Copyright = styled.div`
  text-align: center;
  padding-top: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  color: #95a5a6;
`;

const Footer = () => {
  const { theme } = useTheme();

  return (
    <FooterContainer theme={theme}>
      <FooterContent>
        <FooterSection>
          <Logo>
            <FaLeaf />
            EcoTrack
          </Logo>
          <p>
            Helping you reduce your environmental impact one step at a time. 
            Track your carbon footprint and make sustainable choices with our 
            easy-to-use tools and insights.
          </p>
          <SocialIcons>
            <a href="#" aria-label="Facebook">
              <FaFacebookF />
            </a>
            <a href="#" aria-label="Twitter">
              <FaTwitter />
            </a>
            <a href="#" aria-label="Instagram">
              <FaInstagram />
            </a>
            <a href="#" aria-label="LinkedIn">
              <FaLinkedinIn />
            </a>
          </SocialIcons>
        </FooterSection>

        <FooterSection>
          <h3>Quick Links</h3>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/calculator">Calculator</Link></li>
            <li><Link to="/dashboard">Dashboard</Link></li>
            <li><Link to="/activities">Activities</Link></li>
            <li><Link to="/achievements">Achievements</Link></li>
          </ul>
        </FooterSection>

        <FooterSection>
          <h3>Contact Us</h3>
          <ContactInfo>
            <FaMapMarkerAlt />
            <span>Kabale University, Kikungiri Hill</span>
          </ContactInfo>
          <ContactInfo>
            <FaPhone />
            <span>+256749537430 / +256394785202 / +256785488123</span>
          </ContactInfo>
          <ContactInfo>
            <FaEnvelope />
            <span>kennetharyatuha@gmail.com</span>
          </ContactInfo>
        </FooterSection>

        <FooterSection>
          <h3>Our Team</h3>
          <ul>
            <li>ARYATUHA KENNETH ADONIS - Lead Developer</li>
            <li>AYEN GEOFFREY ALEXANDER - Co-Developer</li>
            <li>AIJUKIRE GILBERT G-TECH - Sustainability Expert</li>
            <li>KULABAKO ARNOLD ODONGO - Data Analyst</li>
            <li>TURYAHABWE PATIENCE - Data Analyst</li>
          </ul>
        </FooterSection>
      </FooterContent>

      <Copyright>
        <p>&copy; 2025 EcoTrack. All rights reserved.</p>
      </Copyright>
    </FooterContainer>
  );
};

export default Footer;
