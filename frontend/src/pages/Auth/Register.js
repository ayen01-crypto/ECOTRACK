import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { FaEye, FaEyeSlash, FaLeaf } from 'react-icons/fa';
import styled from 'styled-components';

const RegisterContainer = styled.div`
  min-height: calc(100vh - 200px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 0;
`;

const RegisterCard = styled(motion.div)`
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

const PasswordStrength = styled.div`
  margin-top: 0.5rem;
  font-size: 0.8rem;
  color: ${props => {
    if (props.strength === 'weak') return '#e74c3c';
    if (props.strength === 'medium') return '#f39c12';
    if (props.strength === 'strong') return '#2ecc71';
    return '#a0aec0';
  }};
`;

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    fullName: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { register, error } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const getPasswordStrength = (password) => {
    if (password.length < 6) return 'weak';
    if (password.length < 8) return 'medium';
    if (password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)) return 'strong';
    return 'medium';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      return;
    }
    
    setIsLoading(true);

    const result = await register({
      username: formData.username,
      email: formData.email,
      fullName: formData.fullName,
      password: formData.password
    });
    
    if (result.success) {
      navigate('/dashboard');
    }
    
    setIsLoading(false);
  };

  const passwordStrength = getPasswordStrength(formData.password);
  const passwordsMatch = formData.password === formData.confirmPassword;

  return (
    <RegisterContainer>
      <RegisterCard
        theme={theme}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Logo>
          <FaLeaf />
          EcoTrack
        </Logo>
        
        <Title theme={theme}>Create Account</Title>
        
        {error && <ErrorMessage>{error}</ErrorMessage>}
        
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label theme={theme}>Username</Label>
            <Input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Choose a username"
              required
              theme={theme}
            />
          </FormGroup>
          
          <FormGroup>
            <Label theme={theme}>Full Name</Label>
            <Input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
              theme={theme}
            />
          </FormGroup>
          
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
                placeholder="Create a password"
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
            {formData.password && (
              <PasswordStrength strength={passwordStrength}>
                Password strength: {passwordStrength}
              </PasswordStrength>
            )}
          </FormGroup>
          
          <FormGroup>
            <Label theme={theme}>Confirm Password</Label>
            <InputContainer>
              <Input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                required
                theme={theme}
              />
              <PasswordToggle
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                theme={theme}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </PasswordToggle>
            </InputContainer>
            {formData.confirmPassword && !passwordsMatch && (
              <PasswordStrength strength="weak">
                Passwords do not match
              </PasswordStrength>
            )}
          </FormGroup>
          
          <Button
            type="submit"
            disabled={isLoading || !passwordsMatch || passwordStrength === 'weak'}
            theme={theme}
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </Button>
        </Form>
        
        <LinkText theme={theme}>
          Already have an account?{' '}
          <Link to="/login">Sign in here</Link>
        </LinkText>
      </RegisterCard>
    </RegisterContainer>
  );
};

export default Register;
