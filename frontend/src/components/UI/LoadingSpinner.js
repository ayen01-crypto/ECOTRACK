import React from 'react';
import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const SpinnerContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: ${props => props.fullHeight ? '100vh' : '200px'};
  width: 100%;
`;

const Spinner = styled.div`
  width: ${props => props.size || '40px'};
  height: ${props => props.size || '40px'};
  border: 3px solid ${props => props.theme === 'dark' ? '#2d3748' : '#e2e8f0'};
  border-top: 3px solid var(--primary);
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;

const LoadingText = styled.p`
  margin-top: 1rem;
  color: ${props => props.theme === 'dark' ? '#a0aec0' : '#718096'};
  font-size: 0.9rem;
`;

const LoadingSpinner = ({ 
  size, 
  text, 
  fullHeight = false, 
  theme = 'light' 
}) => {
  return (
    <SpinnerContainer fullHeight={fullHeight}>
      <div style={{ textAlign: 'center' }}>
        <Spinner size={size} theme={theme} />
        {text && <LoadingText theme={theme}>{text}</LoadingText>}
      </div>
    </SpinnerContainer>
  );
};

export default LoadingSpinner;
