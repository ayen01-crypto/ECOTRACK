import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { FaHome, FaArrowLeft } from 'react-icons/fa';
import styled from 'styled-components';

const NotFoundContainer = styled.div`
  padding: 4rem 0;
  min-height: calc(100vh - 200px);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const NotFoundCard = styled.div`
  background: ${props => props.theme === 'dark' ? '#1a1a1a' : 'white'};
  padding: 3rem;
  border-radius: var(--border-radius-xl);
  box-shadow: var(--shadow-xl);
  text-align: center;
  max-width: 500px;
  border: 1px solid ${props => props.theme === 'dark' ? '#2d3748' : '#e2e8f0'};
`;

const ErrorCode = styled.h1`
  font-size: 6rem;
  font-weight: 700;
  color: var(--primary);
  margin-bottom: 1rem;
  line-height: 1;
`;

const Title = styled.h2`
  font-size: 2rem;
  font-weight: 600;
  color: ${props => props.theme === 'dark' ? '#e2e8f0' : '#2d3748'};
  margin-bottom: 1rem;
`;

const Subtitle = styled.p`
  color: ${props => props.theme === 'dark' ? '#a0aec0' : '#718096'};
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 2rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
`;

const Button = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: var(--border-radius);
  font-weight: 500;
  text-decoration: none;
  transition: var(--transition);

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
`;

const NotFound = () => {
  const { theme } = useTheme();

  return (
    <NotFoundContainer>
      <div className="container">
        <NotFoundCard theme={theme}>
          <ErrorCode>404</ErrorCode>
          <Title theme={theme}>Page Not Found</Title>
          <Subtitle theme={theme}>
            Sorry, the page you are looking for doesn't exist or has been moved.
          </Subtitle>
          <ButtonGroup>
            <Button to="/" className="primary">
              <FaHome />
              Go Home
            </Button>
            <Button to="javascript:history.back()" className="outline">
              <FaArrowLeft />
              Go Back
            </Button>
          </ButtonGroup>
        </NotFoundCard>
      </div>
    </NotFoundContainer>
  );
};

export default NotFound;
