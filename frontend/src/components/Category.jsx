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

export const CategoryForm = ({handleSubmit, handleInputChange, categoryName, error}) => {
  const { authTokens } = useContext(AuthContext);
  

  

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
