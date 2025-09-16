import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { FaEye, FaEyeSlash, FaLeaf } from 'react-icons/fa';
import styled from 'styled-components';

const LoginContainer = styled.div`
  min-height: calc(100vh - 200px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 0;
`;

const LoginCard = styled(motion.div)`
  background: ${props => props.theme === 'dark' ? '#1a1a1a' : 'white'};
  padding: 3rem;
  border-radius: var(--border-radius-xl);
  box-shadow: var(--shadow-xl);
  width: 100%;
  max-width: 400px;
  border: 1px solid ${props => props.theme === 'dark' ? '#2d3748' : '#e2e8f0'};
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 2rem;
  color: var(--primary);
  font-size: 2rem;
  font-weight: 700;

  svg {
    margin-right: 0.5rem;
  }
`;

const Title = styled.h1`
  text-align: center;
  margin-bottom: 2rem;
  color: ${props => props.theme === 'dark' ? '#e2e8f0' : '#2d3748'};
  font-size: 1.8rem;
  font-weight: 600;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  color: ${props => props.theme === 'dark' ? '#e2e8f0' : '#2d3748'};
  font-weight: 500;
  font-size: 0.9rem;
`;

const InputContainer = styled.div`
  position: relative;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid ${props => props.theme === 'dark' ? '#2d3748' : '#e2e8f0'};
  border-radius: var(--border-radius);
  background: ${props => props.theme === 'dark' ? '#2d3748' : 'white'};
  color: ${props => props.theme === 'dark' ? '#e2e8f0' : '#2d3748'};
  font-size: 1rem;
  transition: var(--transition);

  &:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 3px rgba(46, 204, 113, 0.1);
  }

  &::placeholder {
    color: ${props => props.theme === 'dark' ? '#a0aec0' : '#718096'};
  }
`;

const PasswordToggle = styled.button`
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: ${props => props.theme === 'dark' ? '#a0aec0' : '#718096'};
  cursor: pointer;
  padding: 0.25rem;
  transition: var(--transition);

  &:hover {
    color: var(--primary);
  }
`;

const Button = styled.button`
  background: var(--primary);
  color: white;
  padding: 0.75rem 1rem;
  border: none;
  border-radius: var(--border-radius);
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition);
  margin-top: 1rem;

  &:hover {
    background: var(--primary-dark);
  }

  &:disabled {
    background: ${props => props.theme === 'dark' ? '#4a5568' : '#a0aec0'};
    cursor: not-allowed;
  }
`;

const LinkText = styled.p`
  text-align: center;
  margin-top: 1.5rem;
  color: ${props => props.theme === 'dark' ? '#a0aec0' : '#718096'};

  a {
    color: var(--primary);
    text-decoration: none;
    font-weight: 500;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const ErrorMessage = styled.div`
  background: rgba(231, 76, 60, 0.1);
  color: var(--danger);
  padding: 0.75rem 1rem;
  border-radius: var(--border-radius);
  border: 1px solid rgba(231, 76, 60, 0.2);
  font-size: 0.9rem;
  margin-bottom: 1rem;
`;

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { login, error } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const result = await login(formData);
    
    if (result.success) {
      navigate('/dashboard');
    }
    
    setIsLoading(false);
  };

  return (
    <LoginContainer>
      <LoginCard
        theme={theme}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Logo>
          <FaLeaf />
          EcoTrack
        </Logo>
        
        <Title theme={theme}>Welcome Back</Title>
        
        {error && <ErrorMessage>{error}</ErrorMessage>}
        
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label theme={theme}>Email Address</Label>
            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
              theme={theme}
            />
          </FormGroup>
          
          <FormGroup>
            <Label theme={theme}>Password</Label>
            <InputContainer>
              <Input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
                theme={theme}
              />
              <PasswordToggle
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                theme={theme}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </PasswordToggle>
            </InputContainer>
          </FormGroup>
          
          <Button
            type="submit"
            disabled={isLoading}
            theme={theme}
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </Button>
        </Form>
        
        <LinkText theme={theme}>
          Don't have an account?{' '}
          <Link to="/register">Create one here</Link>
        </LinkText>
      </LoginCard>
    </LoginContainer>
  );
};

export default Login;
