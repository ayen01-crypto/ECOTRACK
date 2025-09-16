import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { 
  FaLeaf, 
  FaCalculator, 
  FaChartLine, 
  FaTrophy, 
  FaCalendarCheck,
  FaArrowRight
} from 'react-icons/fa';
import styled from 'styled-components';

const HeroSection = styled.section`
  background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
  color: white;
  padding: 4rem 0;
  text-align: center;
  border-radius: 0 0 2rem 2rem;
  margin-bottom: 4rem;
`;

const HeroContent = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 0 1rem;
`;

const HeroTitle = styled.h1`
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  line-height: 1.2;

  @media (max-width: 768px) {
    font-size: 2.2rem;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 1.2rem;
  margin-bottom: 2rem;
  opacity: 0.9;
  line-height: 1.6;
`;

const CTAButton = styled(Link)`
  display: inline-block;
  background: white;
  color: var(--primary);
  padding: 1rem 2rem;
  border-radius: var(--border-radius-lg);
  font-weight: 600;
  text-decoration: none;
  transition: var(--transition);
  box-shadow: var(--shadow-lg);

  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-xl);
  }
`;

const FeaturesSection = styled.section`
  padding: 4rem 0;
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
`;

const FeatureCard = styled(motion.div)`
  background: ${props => props.theme === 'dark' ? '#1a1a1a' : 'white'};
  padding: 2rem;
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-md);
  text-align: center;
  transition: var(--transition);

  &:hover {
    transform: translateY(-5px);
    box-shadow: var(--shadow-lg);
  }
`;

const FeatureIcon = styled.div`
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
  color: white;
  font-size: 2rem;
`;

const FeatureTitle = styled.h3`
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: ${props => props.theme === 'dark' ? '#e2e8f0' : '#2d3748'};
`;

const FeatureDescription = styled.p`
  color: ${props => props.theme === 'dark' ? '#a0aec0' : '#718096'};
  line-height: 1.6;
`;

const StatsSection = styled.section`
  background: ${props => props.theme === 'dark' ? '#1a1a1a' : '#f8fafc'};
  padding: 4rem 0;
  margin: 4rem 0;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  text-align: center;
`;

const StatItem = styled.div`
  h3 {
    font-size: 2.5rem;
    font-weight: 700;
    color: var(--primary);
    margin-bottom: 0.5rem;
  }

  p {
    color: ${props => props.theme === 'dark' ? '#a0aec0' : '#718096'};
    font-weight: 500;
  }
`;

const Home = () => {
  const { isAuthenticated } = useAuth();
  const { theme } = useTheme();

  const features = [
    {
      icon: <FaCalendarCheck />,
      title: 'Activity Logging',
      description: 'Track your daily activities and their environmental impact with our intuitive logging system.'
    },
    {
      icon: <FaCalculator />,
      title: 'Carbon Calculator',
      description: 'Calculate your carbon footprint with our comprehensive calculator covering all major categories.'
    },
    {
      icon: <FaChartLine />,
      title: 'Visual Analytics',
      description: 'See your progress with beautiful charts and graphs that make data easy to understand.'
    },
    {
      icon: <FaTrophy />,
      title: 'Achievements',
      description: 'Earn badges and unlock achievements as you make progress towards a more sustainable lifestyle.'
    }
  ];

  const stats = [
    { value: '4.2t', label: 'Average Carbon Footprint' },
    { value: '18', label: 'Trees Needed to Offset' },
    { value: '72%', label: 'Better Than Average' },
    { value: '1000+', label: 'Users Tracking Impact' }
  ];

  return (
    <div>
      <HeroSection>
        <HeroContent>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <HeroTitle>
              Track Your Carbon Footprint
            </HeroTitle>
            <HeroSubtitle>
              Join the fight against climate change by monitoring and reducing your 
              environmental impact with our easy-to-use tools and insights.
            </HeroSubtitle>
            <CTAButton to={isAuthenticated ? '/dashboard' : '/register'}>
              {isAuthenticated ? 'Go to Dashboard' : 'Get Started'}
              <FaArrowRight style={{ marginLeft: '0.5rem' }} />
            </CTAButton>
          </motion.div>
        </HeroContent>
      </HeroSection>

      <FeaturesSection>
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 style={{ textAlign: 'center', marginBottom: '1rem', fontSize: '2.5rem', fontWeight: '700' }}>
              How EcoTrack Helps You
            </h2>
            <p style={{ textAlign: 'center', color: theme === 'dark' ? '#a0aec0' : '#718096', fontSize: '1.1rem' }}>
              Our comprehensive platform provides everything you need to understand and reduce your environmental impact.
            </p>
          </motion.div>

          <FeaturesGrid>
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                theme={theme}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <FeatureIcon>
                  {feature.icon}
                </FeatureIcon>
                <FeatureTitle theme={theme}>
                  {feature.title}
                </FeatureTitle>
                <FeatureDescription theme={theme}>
                  {feature.description}
                </FeatureDescription>
              </FeatureCard>
            ))}
          </FeaturesGrid>
        </div>
      </FeaturesSection>

      <StatsSection theme={theme}>
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 style={{ textAlign: 'center', marginBottom: '3rem', fontSize: '2.5rem', fontWeight: '700' }}>
              Making a Real Impact
            </h2>
            <StatsGrid>
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <StatItem theme={theme}>
                    <h3>{stat.value}</h3>
                    <p>{stat.label}</p>
                  </StatItem>
                </motion.div>
              ))}
            </StatsGrid>
          </motion.div>
        </div>
      </StatsSection>
    </div>
  );
};

export default Home;
