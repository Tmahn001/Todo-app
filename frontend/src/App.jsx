import React from 'react'
import { Header } from './components/Header'
import { Main } from './components/Main'
import Login from './components/login';
import SignupForm from './components/signup';
import { AuthProvider } from './context/AuthContext';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import PrivateRoute from './utils/PrivateRoute';
import { ToastContainer } from "react-toastify";
import { CategoryForm } from './components/Category';

function App() {
  return (
    <>

      <Header />
      <Router>
      <ToastContainer/>
      <AuthProvider>
      <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignupForm />} />
        <Route path="/" element={ <PrivateRoute><Main/></PrivateRoute>} />
        <Route path="/add-category" element={ <PrivateRoute><CategoryForm/></PrivateRoute>} />
        </Routes>
       
      </AuthProvider>
        

      </Router>
      
    </>
  )
}

export default App
