import React,{useState,useEffect} from 'react';
import styled from "styled-components";
import { Link, useNavigate } from 'react-router-dom';
import Logo from "../assets/logo.svg";
import {ToastContainer,toast} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { registerRoute } from '../utils/APIRoutes';
function Register() {
  const navigate=useNavigate();
const [values,setvalues]=useState({
  username:"",
  email:"",
  password:"",
  confirmpassword:"",
});
async function handleSubmit(event){
   event.preventDefault();
   if(handleValidation()){
    const{password,confirmpassword,username,email}=values;
    const {data}= await axios.post(registerRoute,{
      username,
      email,
      password,
    });
    if(data.status===false){
       toast.error(data.msg,toastOptions)
    }
     if(data.status===true){
      localStorage.setItem("chat-app-user", JSON.stringify(data.user));
      navigate("/");
     }
   };
  }
  const toastOptions={
    position:"bottom-right",
    autoClose:7000,
    draggable:true,
    pauseOnHover:true,
    theme:"dark",
  }

  useEffect(()=>{
    if(localStorage.getItem("chat-app-user")){
      navigate("/")
    }
  },[]);

  function handleValidation(){
    const{password,confirmpassword,username,email}=values;
    if(password !== confirmpassword){
      toast.error("password and confirm password should be the same.",
        toastOptions
      );
      return false;
    }else if(username.length<3){
      toast.error("Username should be greater than 3 characters.",
        toastOptions
      );
      return false;
    }else if(password.length<8){
      toast.error("Password should be equal or greater than 8 charcters.",
        toastOptions
      );
      return false;
    }else if(email===""){
      toast.error("email is required.",
        toastOptions
      );
      return false;
    }
    return true;
  }
  function handleChange(event){
   setvalues({...values,[event.target.name]:event.target.value});
  }
  return (
  <>
    <FormContainer>
      <form onSubmit={handleSubmit}>
        <div class="brand">
          <img src={Logo} alt="logo" />
          <h1>SNAPPY</h1>
        </div>
         <input type="text" placeholder="Username" name="username" onChange={handleChange} />
         <input type="email" placeholder="Email" name="email" onChange={handleChange} />
         <input type="password" placeholder="Password" name="password" onChange={handleChange} />
         <input type="password" placeholder="Confirm Password" name="confirmpassword" onChange={handleChange} />
         <button type="submit">Create User</button>
         <span>
         Already have an account?<Link to="/login">Login</Link>
         </span>
      </form>
      
    </FormContainer>
    <ToastContainer />
  </>
  );
}
const FormContainer=styled.div`
height:100vh;
width:100vw;
display:flex;
flex-direction:column;
justify-content:center;
gap:1rem;
align-items:center;
background-color:#131324;
.brand{
  display:flex;
  align-items:center;
  gap:1rem;
  justify-content:center;
img{
  height:5rem;
}
h1{
  color:white;
  text-transform:uppercase;
}
}
form{
  display:flex;
  flex-direction:column;
  gap:2rem;
  background-color:#00000076;
  border-radius:2rem;
  padding:3rem 5rem;
  input{
   background-color:transparent;
   padding:1rem;
   border:0.1rem solid #4e0eff;
   border-radius:0.4rem;
   color:white;
   width:100%;
   font-size:1rem;
   &:focus{
    border:0.1rem solid #997af0;
    outline:none;
   }
  }
  button{
    background-color:#997af0;
    color:white;
    padding:1rem 2rem;
    border:none;
    font-weight:bold;
    cursor:pointer;
    border-radius:0.4rem;
    font-size:1rem;
    text-transform:uppercase;
    transition:0.5s ease-in-out;
    &:hover{
      background-color:#4e0eff;
    }
  }
  span{
    color:white;
    text-transform:uppercase;
    a{
      color:#4e0eff;
      text-decoration:none;
      text-weight:bold;
    }
  }
}
`;
export default Register;
