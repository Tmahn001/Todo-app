import React, {useState, useContext, useEffect} from 'react'
import { Article } from './Article'
import { CategoryForm } from './Category'
import AuthContext from '../context/AuthContext'

export const Main = () => {
  let {profile, getProfile} = useContext(AuthContext)
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  
  console.log(profile)

  useEffect(() => {
   getProfile();
  }, [])
  
  return (
    <main className='main container'>
      <h1 className='main__title'>Welcome {profile?.name}</h1>
      {/* Category Form Trigger Button */}
      <button onClick={() => setShowCategoryForm(true)}>Add Category</button>
      
      {/* Category Form Pop-up */}
      {showCategoryForm && (
        <div className="category-form-popup">
          <CategoryForm />
<div style={{textAlign:"center"}}>
<button onClick={() => setShowCategoryForm(false)} >Close</button>
</div>
        </div>
      )}
     <br></br>
     <p className='main__text'>
        Keep notes of what you have to do in your day
      </p>
      <Article />
    </main>
  )
}
