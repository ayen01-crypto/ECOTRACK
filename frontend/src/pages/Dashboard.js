import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { usersAPI } from '../services/api';
import { 
  FaFootprint, 
  FaTree, 
  FaRecycle, 
  FaChartLine,
  FaArrowUp,
  FaArrowDown,
  FaLeaf
} from 'react-icons/fa';
import styled from 'styled-components';
import LoadingSpinner from '../components/UI/LoadingSpinner';

const DashboardContainer = styled.div`
  padding: 2rem 0;
`;

const WelcomeSection = styled.div`
  background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
  color: white;
  padding: 2rem;
  border-radius: var(--border-radius-lg);
  margin-bottom: 2rem;
  text-align: center;
`;

const WelcomeTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
`;

const WelcomeSubtitle = styled.p`
  opacity: 0.9;
  font-size: 1.1rem;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const StatCard = styled(motion.div)`
  background: ${props => props.theme === 'dark' ? '#1a1a1a' : 'white'};
  padding: 1.5rem;
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-md);
  border: 1px solid ${props => props.theme === 'dark' ? '#2d3748' : '#e2e8f0'};
`;

const StatIcon = styled.div`
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
  margin-bottom: 1rem;
`;

const StatValue = styled.h3`
  font-size: 2rem;
  font-weight: 700;
  color: ${props => props.theme === 'dark' ? '#e2e8f0' : '#2d3748'};
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.p`
  color: ${props => props.theme === 'dark' ? '#a0aec0' : '#718096'};
  font-weight: 500;
`;

const StatChange = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  margin-top: 0.5rem;
  font-size: 0.9rem;
  color: ${props => props.positive ? '#2ecc71' : '#e74c3c'};
`;

const ChartsSection = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
`;

const ChartCard = styled.div`
  background: ${props => props.theme === 'dark' ? '#1a1a1a' : 'white'};
  padding: 1.5rem;
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-md);
  border: 1px solid ${props => props.theme === 'dark' ? '#2d3748' : '#e2e8f0'};
`;

const ChartTitle = styled.h3`
  font-size: 1.3rem;
  font-weight: 600;
  color: ${props => props.theme === 'dark' ? '#e2e8f0' : '#2d3748'};
  margin-bottom: 1rem;
`;

const InsightsSection = styled.div`
  background: ${props => props.theme === 'dark' ? '#1a1a1a' : 'white'};
  padding: 2rem;
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-md);
  border: 1px solid ${props => props.theme === 'dark' ? '#2d3748' : '#e2e8f0'};
`;

const InsightsTitle = styled.h3`
  font-size: 1.3rem;
  font-weight: 600;
  color: ${props => props.theme === 'dark' ? '#e2e8f0' : '#2d3748'};
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const InsightItem = styled.div`
  padding: 1rem;
  background: ${props => props.theme === 'dark' ? '#2d3748' : '#f8fafc'};
  border-radius: var(--border-radius);
  margin-bottom: 1rem;
  border-left: 4px solid var(--primary);
`;

const InsightText = styled.p`
  color: ${props => props.theme === 'dark' ? '#e2e8f0' : '#2d3748'};
  line-height: 1.6;
`;

const Dashboard = () => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await usersAPI.getDashboard();
        setDashboardData(response.data.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <LoadingSpinner fullHeight text="Loading dashboard..." />;
  }

  if (!dashboardData) {
    return (
      <div className="container">
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <h2>Unable to load dashboard data</h2>
          <p>Please try refreshing the page.</p>
        </div>
      </div>
    );
  }

  const { user: userData, period, statistics, insights } = dashboardData;

  const stats = [
    {
      icon: <FaFootprint />,
      value: `${userData.carbonFootprint.total.toFixed(1)}t`,
      label: 'Total Carbon Footprint',
      change: '+2.3%',
      positive: false
    },
    {
      icon: <FaTree />,
      value: Math.ceil(userData.carbonFootprint.total * 18),
      label: 'Trees Needed to Offset',
      change: '+1',
      positive: false
    },
    {
      icon: <FaRecycle />,
      value: '72%',
      label: 'Better Than Average',
      change: '+5%',
      positive: true
    },
    {
      icon: <FaChartLine />,
      value: statistics.byCategory.length,
      label: 'Activities This Month',
      change: '+3',
      positive: true
    }
  ];

  return (
    <DashboardContainer>
      <div className="container">
        <WelcomeSection>
          <WelcomeTitle>
            Welcome back, {userData.username}!
          </WelcomeTitle>
          <WelcomeSubtitle>
            Here's your environmental impact overview for {period.name}
          </WelcomeSubtitle>
        </WelcomeSection>

        <StatsGrid>
          {stats.map((stat, index) => (
            <StatCard
              key={index}
              theme={theme}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <StatIcon>
                {stat.icon}
              </StatIcon>
              <StatValue theme={theme}>
                {stat.value}
              </StatValue>
              <StatLabel theme={theme}>
                {stat.label}
              </StatLabel>
              <StatChange positive={stat.positive}>
                {stat.positive ? <FaArrowUp /> : <FaArrowDown />}
                {stat.change}
              </StatChange>
            </StatCard>
          ))}
        </StatsGrid>

        <ChartsSection>
          <ChartCard theme={theme}>
            <ChartTitle theme={theme}>
              Monthly Carbon Footprint Trend
            </ChartTitle>
            <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#a0aec0' }}>
              Chart will be implemented with Chart.js
            </div>
          </ChartCard>

          <ChartCard theme={theme}>
            <ChartTitle theme={theme}>
              Footprint by Category
            </ChartTitle>
            <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#a0aec0' }}>
              Chart will be implemented with Chart.js
            </div>
          </ChartCard>
        </ChartsSection>

        {insights && insights.length > 0 && (
          <InsightsSection theme={theme}>
            <InsightsTitle theme={theme}>
              <FaLeaf />
              Personalized Insights
            </InsightsTitle>
            {insights.map((insight, index) => (
              <InsightItem key={index} theme={theme}>
                <InsightText theme={theme}>
                  {insight.message}
                </InsightText>
              </InsightItem>
            ))}
          </InsightsSection>
        )}
      </div>
    </DashboardContainer>
  );
};

export default Dashboard;
