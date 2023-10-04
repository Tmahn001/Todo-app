import { createContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import jwt_decode from "jwt-decode"
import { Slide, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const AuthContext = createContext()

export default AuthContext;
const API = import.meta.env.VITE_API_URL

export const AuthProvider = ({children}) =>{
    let [authTokens, setAuthTokens] = useState(()=> localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null)
    let [user, setUser] = useState(()=> localStorage.getItem('authTokens') ? jwt_decode(localStorage.getItem('authTokens')) : null)
    let [loading, setLoading] = useState(true)
    let [profile, setProfile] = useState([]) 
    const navigate = useNavigate()


    let loginUser = async (e) => {
        e.preventDefault();
        let formdata = new FormData();
        formdata.append("email", e.target.email.value);
        formdata.append("password", e.target.password.value);
      
        try {
          let response = await fetch(`${API}/api/login`, {
            method: 'POST',
            body: formdata
          });
      
          if (response.status === 200) {
            let data = await response.json();
            setAuthTokens(data);
            setUser(jwt_decode(data.token));
            localStorage.setItem('authTokens', JSON.stringify(data));
            const message = "Logged in successfully";
            toast.success(message, {
              position: toast.POSITION.TOP_CENTER,
              autoClose: 1500, // 3 seconds
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              transition: Slide,
            });
            setTimeout(() => {
              navigate("/");
            }, 1600);
          } else if (response.status === 401) {
            // Unauthorized: User does not exist
            toast.error("User does not exist", {
              position: toast.POSITION.TOP_RIGHT,
            });
          } else if (response.status === 403) {
            // Forbidden: Wrong password
            toast.error("Invalid details", {
              position: toast.POSITION.TOP_RIGHT,
            });
          } else {
            // Other error status codes
            toast.error("An error occurred. Please try again later.", {
              position: toast.POSITION.TOP_RIGHT,
            });
          }
        } catch (error) {
          console.error("An error occurred:", error);
          toast.error("An error occurred. Please try again later.", {
            position: toast.POSITION.TOP_RIGHT,
          });
        }
      }

      let signupUser = async (e) => {
        e.preventDefault();
        let formdata = new FormData();
        formdata.append("email", e.target.email.value);
        formdata.append("name", e.target.name.value);
        formdata.append("password", e.target.password.value);
      
        try {
          let response = await fetch(`${API}/api/signup`, {
            method: 'POST',
            body: formdata
          });
      
          if (response.status === 201) {
            let data = await response.json();
            const message = "Account created";
            toast.success(message, {
              position: toast.POSITION.TOP_CENTER,
              autoClose: 1500, // 3 seconds
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              transition: Slide,
            });
            setTimeout(() => {
              navigate("/login");
            }, 1700);
          } else if (response.status === 202) {
            // Unauthorized: User does not exist
            toast.error("User exists", {
              position: toast.POSITION.TOP_RIGHT,
            });
          } else if (response.status === 400) {
            // Forbidden: Wrong password
            toast.error("Invalid details", {
              position: toast.POSITION.TOP_RIGHT,
            });
          } else {
            // Other error status codes
            toast.error("An error occurred. Please try again later.", {
              position: toast.POSITION.TOP_RIGHT,
            });
          }
        } catch (error) {
          console.error("An error occurred:", error);
          toast.error("An error occurred. Please try again later.", {
            position: toast.POSITION.TOP_RIGHT,
          });
        }
      }
      
      


    let logoutUser = () => {
        setAuthTokens(null)
        setUser(null)
        localStorage.removeItem('authTokens')
        navigate('/login')
    }

    let updateToken = async ()=> {

        let response = await fetch(`${API}/api/user`, {
            method:'GET',
            headers:{
                'Content-Type':'application/json',
                'x-access-token': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJwdWJsaWNfaWQiOiI3NjRiMDQ0Ny1lMWYxLTQwN2MtYmEwZC03ZmM4YzhlN2UwNmUiLCJleHAiOjE2OTYyODExNzJ9.zsV8a8gvanLqImMhtp5DpId8XGxJKslCdqg8si5lITY'
            },
            
        })

        let data = await response.json()
        
        if (response.status === 200){
            setAuthTokens(data)
            setUser(jwt_decode(data.token))
            localStorage.setItem('authTokens', JSON.stringify(data))
        }else{
            logoutUser()
        }

        if(loading){
            setLoading(false)
        }
    }

    let getProfile = async()=>{
        let response = await fetch(`${API}/api/user`, {
            method:'GET',
            headers:{
                'Content-Type':'application/json',
                'x-access-token': authTokens?.token
            }

        })
        let data = await response.json()

        if(response.status === 200){
            setProfile(data)
            
        }else if(response.statusText === 'Unauthorized'){
            logoutUser()
        }

    }

    let context_data ={
        user:user,
        authTokens:authTokens,
        signupUser:signupUser,
        loginUser:loginUser,
        logoutUser:logoutUser,
        getProfile:getProfile,
        profile:profile,
    }

 



    

    return(
        <AuthContext.Provider value={context_data}>
            {children}
           

        </AuthContext.Provider>
    )
}
