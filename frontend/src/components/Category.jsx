import React, { useState, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import { Slide, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
    FormTask,
    InputFormTask,
    TextareaFormTask,
    ButtonFormTask,
  } from './styled/FormStyled'

const API = import.meta.env.VITE_API_URL

export const CategoryForm = () => {
  const { authTokens } = useContext(AuthContext);
  const [categoryName, setCategoryName] = useState('');
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    setCategoryName(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API}/api/categories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': authTokens?.token,
        },
        body: JSON.stringify({ name: categoryName }),
      });

      if (res.ok) {
        // Category added successfully, clear input and error
        toast.success("New category added")
        setCategoryName('');
        setError('');
        // You can also update the list of categories here if needed
      } else if (res.status === 400) {
        // Handle validation errors or category already exists
        toast.warning("category exists",
            {position: toast.POSITION.TOP_RIGHT,}
         )
        const data = await res.json();
        setError(data.error);
      } else {
        // Handle other error statuses if needed
        toast.error("Failed to add category",
            {position: toast.POSITION.TOP_RIGHT,}
        )
        console.error(`Error: ${res.status}`);

      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };

  return (
   
    <article className='article'>
      <section className='article__form'>
      <FormTask className='form' onSubmit={handleSubmit}>
        <div className='form__container'>
        <InputFormTask
        required
        type="text"
        name="categoryName"
        placeholder="Enter category name"
        value={categoryName}
        onChange={handleInputChange}
      />
        </div>
      
      
      <ButtonFormTask type='submit'>
        Add Category
        </ButtonFormTask>
      {error && <div className="error">{error}</div>}
    </FormTask>
      </section>
      </article>
      
    
  );
};
