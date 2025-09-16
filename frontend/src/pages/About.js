import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { 
  FaLeaf, 
  FaUsers, 
  FaTarget, 
  FaLightbulb,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope
} from 'react-icons/fa';
import styled from 'styled-components';

const AboutContainer = styled.div`
  padding: 2rem 0;
`;

const HeroSection = styled.div`
  background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
  color: white;
  padding: 4rem 0;
  text-align: center;
  border-radius: 0 0 2rem 2rem;
  margin-bottom: 4rem;
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
  opacity: 0.9;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
`;

const Section = styled.section`
  margin-bottom: 4rem;
`;

const SectionTitle = styled.h2`
  font-size: 2.5rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 3rem;
  color: ${props => props.theme === 'dark' ? '#e2e8f0' : '#2d3748'};
`;

const SectionContent = styled.div`
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
`;

const SectionText = styled.p`
  font-size: 1.1rem;
  line-height: 1.8;
  color: ${props => props.theme === 'dark' ? '#a0aec0' : '#718096'};
  margin-bottom: 2rem;
`;

const TeamGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
`;

const TeamMember = styled(motion.div)`
  background: ${props => props.theme === 'dark' ? '#1a1a1a' : 'white'};
  padding: 2rem;
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-md);
  text-align: center;
  border: 1px solid ${props => props.theme === 'dark' ? '#2d3748' : '#e2e8f0'};
`;

const MemberImage = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  margin: 0 auto 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 2rem;
  font-weight: 700;
`;

const MemberName = styled.h4`
  font-size: 1.2rem;
  font-weight: 600;
  color: ${props => props.theme === 'dark' ? '#e2e8f0' : '#2d3748'};
  margin-bottom: 0.5rem;
`;

const MemberRole = styled.p`
  color: var(--primary);
  font-weight: 500;
  margin-bottom: 1rem;
`;

const ContactSection = styled.div`
  background: ${props => props.theme === 'dark' ? '#1a1a1a' : '#f8fafc'};
  padding: 3rem 0;
  border-radius: var(--border-radius-lg);
  margin-top: 4rem;
`;

const ContactGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
`;

const ContactItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: ${props => props.theme === 'dark' ? '#2d3748' : 'white'};
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-sm);
`;

const ContactIcon = styled.div`
  width: 50px;
  height: 50px;
  background: var(--primary);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.2rem;
`;

const ContactText = styled.div`
  color: ${props => props.theme === 'dark' ? '#e2e8f0' : '#2d3748'};
  font-weight: 500;
`;

const About = () => {
  const { theme } = useTheme();

  const teamMembers = [
    {
      name: 'ARYATUHA KENNETH ADONIS',
      role: 'Lead Developer',
      initial: 'A'
    },
    {
      name: 'AYEN GEOFFREY ALEXANDER',
      role: 'Co-Developer',
      initial: 'A'
    },
    {
      name: 'AIJUKIRE GILBERT G-TECH',
      role: 'Sustainability Expert',
      initial: 'A'
    },
    {
      name: 'KULABAKO ARNOLD ODONGO',
      role: 'Data Analyst',
      initial: 'K'
    },
    {
      name: 'TURYAHABWE PATIENCE',
      role: 'Data Analyst',
      initial: 'T'
    }
  ];

  return (
    <AboutContainer>
      <HeroSection>
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <HeroTitle>About EcoTrack</HeroTitle>
            <HeroSubtitle>
              Empowering individuals to make a positive environmental impact through 
              data-driven insights and actionable recommendations.
            </HeroSubtitle>
          </motion.div>
        </div>
      </HeroSection>

      <div className="container">
        <Section>
          <SectionTitle theme={theme}>Our Mission</SectionTitle>
          <SectionContent>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <SectionText theme={theme}>
                EcoTrack was founded on 15th August 2025 with a simple mission: to make 
                carbon tracking accessible and actionable for everyone. We believe that by 
                providing clear insights into personal environmental impact, we can empower 
                individuals to make meaningful changes that collectively make a significant 
                difference in the fight against climate change.
              </SectionText>
            </motion.div>
          </SectionContent>
        </Section>

        <Section>
          <SectionTitle theme={theme}>What We Do</SectionTitle>
          <SectionContent>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <SectionText theme={theme}>
                Our platform helps you understand, track, and reduce your carbon footprint 
                through easy-to-use tools, detailed analytics, and personalized recommendations. 
                We translate complex environmental data into actionable insights that help you 
                live more sustainably.
              </SectionText>
            </motion.div>
          </SectionContent>
        </Section>

        <Section>
          <SectionTitle theme={theme}>Our Team</SectionTitle>
          <TeamGrid>
            {teamMembers.map((member, index) => (
              <TeamMember
                key={index}
                theme={theme}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <MemberImage>
                  {member.initial}
                </MemberImage>
                <MemberName theme={theme}>
                  {member.name}
                </MemberName>
                <MemberRole>
                  {member.role}
                </MemberRole>
              </TeamMember>
            ))}
          </TeamGrid>
        </Section>

        <ContactSection theme={theme}>
          <SectionTitle theme={theme}>Contact Us</SectionTitle>
          <ContactGrid>
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <ContactItem theme={theme}>
                <ContactIcon>
                  <FaMapMarkerAlt />
                </ContactIcon>
                <ContactText theme={theme}>
                  Kabale University, Kikungiri Hill
                </ContactText>
              </ContactItem>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <ContactItem theme={theme}>
                <ContactIcon>
                  <FaPhone />
                </ContactIcon>
                <ContactText theme={theme}>
                  +256749537430 / +256394785202 / +256785488123
                </ContactText>
              </ContactItem>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <ContactItem theme={theme}>
                <ContactIcon>
                  <FaEnvelope />
                </ContactIcon>
                <ContactText theme={theme}>
                  kennetharyatuha@gmail.com
                </ContactText>
              </ContactItem>
            </motion.div>
          </ContactGrid>
        </ContactSection>
      </div>
    </AboutContainer>
  );
};

export default About;
