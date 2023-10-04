import React, {useEffect, useState, useContext} from 'react';
import AuthContext from '../context/AuthContext';

import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const AuthWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const AuthInner = styled.div`
  background-color: #f8f9fa;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Form = styled.form`
  text-align: left;
`;

const Title = styled.h3`
  margin-bottom: 20px;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid #ced4da;
  border-radius: 4px;
`;

const CheckboxLabel = styled.label`
  display: block;
  margin-bottom: 5px;
`;

const CustomCheckbox = styled.input`
  margin-right: 5px;
`;

const LoginButton = styled.button`
  width: 100%;
  padding: 10px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #0056b3;
  }
`;

const ForgotPasswordLink = styled.p`
  text-align: right;
`;



const SignupForm =()=>{

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    let formdata = new FormData()
    formdata.append("email", email);
    formdata.append("password", password);

    let {signupUser} = useContext(AuthContext)
    const navigate = useNavigate();
    function gotoLoginPage() {
      navigate("/login");
    }

  return (
    <AuthWrapper>
      <AuthInner>
        <Form encType="multipart/form-data" onSubmit={signupUser}>
          <Title>Sign up</Title>
          <FormGroup>
            <Label>Email</Label>
            <Input
              type="email"
              name="email"
              placeholder="test_@gmail.com"
              
            />
            
          </FormGroup>
          <FormGroup>
            <Label>Name</Label>
            <Input
              type="name"
              name="name"
              placeholder="James Brown"
              
            />
            
          </FormGroup>
          
          <FormGroup>
            <Label>Password</Label>
            <Input
              type="password"
              name="password"
              placeholder="********"
              
            />
          </FormGroup>
          <FormGroup>
          <ForgotPasswordLink>
            
              Have an account?
              <a onClick={gotoLoginPage}>Login</a>
              </ForgotPasswordLink>
    
          </FormGroup>
          <LoginButton type="submit">Sign up</LoginButton>
          <ForgotPasswordLink>
            Forgot <a href="#">password?</a>
          </ForgotPasswordLink>
        </Form>
      </AuthInner>
    </AuthWrapper>
  );
}

export default SignupForm;
