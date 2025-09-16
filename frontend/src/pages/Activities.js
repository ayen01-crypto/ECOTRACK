import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import styled from 'styled-components';

const ActivitiesContainer = styled.div`
  padding: 2rem 0;
  min-height: calc(100vh - 200px);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ComingSoonCard = styled.div`
  background: ${props => props.theme === 'dark' ? '#1a1a1a' : 'white'};
  padding: 3rem;
  border-radius: var(--border-radius-xl);
  box-shadow: var(--shadow-xl);
  text-align: center;
  max-width: 500px;
  border: 1px solid ${props => props.theme === 'dark' ? '#2d3748' : '#e2e8f0'};
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: ${props => props.theme === 'dark' ? '#e2e8f0' : '#2d3748'};
  margin-bottom: 1rem;
`;

const Subtitle = styled.p`
  color: ${props => props.theme === 'dark' ? '#a0aec0' : '#718096'};
  font-size: 1.1rem;
  line-height: 1.6;
`;

const Activities = () => {
  const { theme } = useTheme();

  return (
    <ActivitiesContainer>
      <div className="container">
        <ComingSoonCard theme={theme}>
          <Title theme={theme}>Activity Logging</Title>
          <Subtitle theme={theme}>
            This feature is coming soon! You'll be able to log your daily activities 
            and track their environmental impact with detailed analytics.
          </Subtitle>
        </ComingSoonCard>
      </div>
    </ActivitiesContainer>
  );
};

export default Activities;
