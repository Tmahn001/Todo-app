import React, { useEffect, useState, useContext } from 'react'
import { Card } from './articleComponents/Card'
import { FiChevronRight, FiChevronLeft, FiAlertCircle } from 'react-icons/fi'
import AuthContext from '../context/AuthContext'
import {
  FormTask,
  InputFormTask,
  TextareaFormTask,
  ButtonFormTask,
} from './styled/FormStyled'

import emptyImg from '../img/bubble-gum-signing-the-contract.png'
import { Slide, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API = import.meta.env.VITE_API_URL

export const Article = ({categoryName}) => {
  let {authTokens, logoutUser} = useContext(AuthContext)
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const [categories, setCategories] = useState([]);

  const [tasks, setTasks] = useState([])
  const [isEdit, setIsEdit] = useState(false)
  const [currentId, setCurrentId] = useState(null)
  const [errorInputs, setErrorInputs] = useState({
    title: false,
    description: false,
  })
  const [pagination, setPagination] = useState({
    next: '',
    prev: '',
    self: '',
  })
  const [inputs, setInputs] = useState({
    title: '',
    description: '',
    priority: false,
    due_date: null,
  })
  console.log(inputs.priority)
  console.log(inputs.due_date)

  const handleInputChange = (e) => {
    const value = e.target.value
    const name = e.target.name

    setInputs({
      ...inputs,
      [name]: value,
    })
  }

  const handleOnClickCancel = () => {
    setIsEdit(false)
    setCurrentId(null)
    setInputs({
      title: '',
      description: '',
    })
  }

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };
  
  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
  };
  
  // Get Categories
  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API}/api/categories`, {
        headers: { 'x-access-token': authTokens?.token },
        method: 'GET',
      });

      if (res.status === 401) {
        // Unauthorized access, log out the user
        logoutUser();
        return;
      }

      if (res.ok) {
        const data = await res.json();
        setCategories(data.categories);
      } else {
        // Handle other error statuses if needed
        console.error(`Error: ${res.status}`);
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };

  // ==> Get all tasks : GET
  const getTasks = async () => {
    
    
  
    try {
      const url = new URL(`${API}/api/tasks`);
      const params = new URLSearchParams();

    if (selectedCategory) {
      params.append('category', selectedCategory);
    }

    if (searchQuery) {
      params.append('search', searchQuery);
    }

    url.search = params.toString();
      const res = await fetch(url.toString(), {
        headers: { 'x-access-token': authTokens?.token },
        method: 'GET',
      });
  
      if (res.status === 401) {
        // Unauthorized access, log out the user
        logoutUser();
        return;
      }
  
      if (res.ok) {
        const data = await res.json();
        setTasks(data.items);
        setPagination({
          next: data.links.next,
          prev: data.links.prev,
          self: data.links.self,
        });
      } else {
        // Handle other error statuses if needed
        console.error(`Error: ${res.status}`);
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };
  

  // ==> Get a single task : GET
  const getTask = async (idTask) => {
    const res = await fetch(`${API}/api/tasks/${idTask}`, {
      headers:{'x-access-token':authTokens?.token},
      method: 'GET',
    })

    const data = await res.json()
    console.log(data)

    setIsEdit(true)
    setCurrentId(data.id_task)
    setInputs({
      title: data.title,
      description: data.description,
    })
  }

  // ==> Create a task : POST
  const createTask = async () => {
    // Convert the due_date string to a Python datetime object
    const dueDate = inputs.due_date ? new Date(inputs.due_date) : null;
  
    const res = await fetch(`${API}/api/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': authTokens?.token
      },
      body: JSON.stringify({
        title: inputs.title,
        description: inputs.description,
        priority: inputs.priority,
        due_date: dueDate, // Pass the datetime object
        category_id: inputs.category_id
      }),
    });
  
    if (res.ok) {
      const data = await res.json();
      console.log(data);
  
      // Show success toast
      toast.success('Task created successfully', {
        position: 'top-right',
        autoClose: 3000, // Close the toast after 3 seconds (adjust as needed)
      });
  
      await getTasks(pagination.self);
    } else {
      // Handle the error case
      // Show error toast
      toast.error('Error creating task', {
        position: 'top-right',
        autoClose: 3000, // Close the toast after 3 seconds (adjust as needed)
      });
  
      console.error(`Error: ${res.status}`);
    }
  };
  // ==> Update a task : PUT
  const updateTask = async () => {
    const res = await fetch(`${API}/api/tasks/${currentId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...inputs,
      }),
    })

    const data = await res.json()
    console.log(data)

    setIsEdit(false)
    setCurrentId(null)

    await getTasks(pagination.self)
  }

  // ==> Delete a task : DELETE
  const deleteTask = async (idTask) => {
    const confirm = window.confirm('Are you sure you want to delete the task?')

    if (confirm) {
      await fetch(`${API}/api/tasks/${idTask}`, {
        method: 'DELETE',
      })

      await getTasks(pagination.self)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    // ==> Validate form fields
    if (inputs.title === '') {
      setErrorInputs({ title: true })
      return
    } else {
      setErrorInputs({ title: false })
    }

    if (inputs.description === '') {
      setErrorInputs({ description: true })
      return
    } else {
      setErrorInputs({ description: false })
    }

    if (!isEdit) {
      createTask()
    } else {
      updateTask()
    }

    setInputs({
      title: '',
      description: '',
    })
  }
  
  useEffect(() => {
    fetchCategories();
    getTasks()

  }, [categoryName, selectedCategory, searchQuery])

  console.log(inputs.category_id)

  return (
    <article className='article'>
           <section>
      <select
  name="category"
  value={selectedCategory}
  onChange={handleCategoryChange}
>
  <option value="">All Categories</option>
  {categories.map((category) => (
    <option key={category.id} value={category.id}>
      {category.name}
    </option>
  ))}
</select>

<input
  type="text"
  name="search"
  placeholder="Search tasks..."
  value={searchQuery}
  onChange={handleSearchInputChange}
/>

      </section>
      <section className='article__form'>
        <FormTask className='form' onSubmit={handleSubmit}>
          <div className='form__container'>
            <InputFormTask
              type='text'
              name='title'
              placeholder={errorInputs.title ? 'Please enter a value' : 'Title'}
              className={
                errorInputs.title ? 'form__input error-input' : 'form__input'
              }
              autoComplete='off'
              value={inputs.title}
              onChange={handleInputChange}
            />
            <FiAlertCircle
              style={
                errorInputs.title ? { display: 'block' } : { display: 'none' }
              }
              className='form__alerticon'
            />
          </div>
          <div className='form__container'>
            <TextareaFormTask
              name='description'
              className={
                errorInputs.description
                  ? 'form__textarea error-input'
                  : 'form__textarea'
              }
              rows='4'
              placeholder={
                errorInputs.description ? 'Please enter a value' : 'Description'
              }
              value={inputs.description}
              onChange={handleInputChange}
            />
          </div>
          <div className='form__container'>
          <label>
            Priority:
            <input
              type="checkbox"
              name="priority"
              checked={inputs.priority}
              onChange={(e) =>
                setInputs({ ...inputs, priority: e.target.checked })
              }
            />
          </label>


          </div>

          <div className='form__container'>
              <label>
                Category:
                <select
                  name="category_id"
                  value={inputs.category_id || ''}
                  onChange={handleInputChange}
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </label>
            </div>


          <div className='form__container'>
          <label>
          Due Date:
          <input
            type="date"
            name="due_date"
            value={inputs.due_date}
            onChange={handleInputChange}
          />
        </label>


          </div>
          <div className='form__btn'>
            <ButtonFormTask type='submit'>
              {!isEdit ? 'Create' : 'Update'}
            </ButtonFormTask>
            <ButtonFormTask
              style={!isEdit ? { display: 'none' } : { display: 'block' }}
              cancel
              type='button'
              onClick={handleOnClickCancel}
            >
              Cancel
            </ButtonFormTask>
          </div>
        </FormTask>
      </section>
 
      {tasks.length === 0 ? (
        <section className='article__empty'>
          <img src={emptyImg} alt='Empty Image' />
        </section>
      ) : (
        <section className='article__content'>
          <div className='cards'>
            {tasks.map((task) => (
              <Card
                key={task.id_task}
                idTask={task.id_task}
                title={task.title}
                priority={task.priority}
                description={task.description}
                timestamp={task.timestamp}
                getTask={getTask}
                deleteTask={deleteTask}
              />
            ))}
          </div>
          <div className='pagination'>
            <button
              className='pagination__left'
              type='button'
              onClick={() => getTasks(pagination.prev)}
            >
              <FiChevronLeft className='pagination__left-icon' />
            </button>
            <button
              className='pagination__right'
              type='button'
              onClick={() => getTasks(pagination.next)}
            >
              <FiChevronRight className='pagination__right-icon' />
            </button>
          </div>
        </section>
      )}
    </article>
  )
}
