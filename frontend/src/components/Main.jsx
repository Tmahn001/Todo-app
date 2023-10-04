import React, {useState, useContext, useEffect} from 'react'
import { Article } from './Article'
import { CategoryForm } from './Category'
import AuthContext from '../context/AuthContext'
import { Slide, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API = import.meta.env.VITE_API_URL
export const Main = () => {
  let {profile, getProfile, authTokens} = useContext(AuthContext)
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  
  console.log(profile)

  useEffect(() => {
   getProfile();
  }, [])

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
    <main className='main container'>
      <h1 className='main__title'>Welcome {profile?.name}</h1>
      {/* Category Form Trigger Button */}
      <button onClick={() => setShowCategoryForm(true)}>Add Category</button>
      
      {/* Category Form Pop-up */}
      {showCategoryForm && (
        <div className="category-form-popup">
          <CategoryForm handleSubmit={handleSubmit} handleInputChange={handleInputChange} categoryName={categoryName} error={error} />
<div style={{textAlign:"center"}}>
<button onClick={() => setShowCategoryForm(false)}  style={{ backgroundColor: '#DD5353', color: 'white', borderRadius: '5', width:'3rem', height:'3rem' }}>Close</button>
</div>
        </div>
      )}
     <br></br>
     <p className='main__text'>
        Manage your tasks 
      </p>
      <Article categoryName={categoryName} />
    </main>
  )
}
