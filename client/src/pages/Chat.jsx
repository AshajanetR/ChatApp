import React,{useState,useEffect,useRef} from 'react'
import styled from "styled-components";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import { allUsersRoute, host } from '../utils/APIRoutes';
import Contacts from '../components/Contacts';
import Welcome from '../components/Welcome';
import ChatContainer from '../components/ChatContainer';
import {io} from "socket.io-client";
function Chat() {
  const socket=useRef();
  const navigate=useNavigate();
  const [contacts,setcontacts]=useState([]);
  const [currentuser,setCurrentUser]=useState(undefined);
  const [currentchat,setcurrentchat]=useState(undefined);
  const [isloaded,setisloaded]=useState(false);
  useEffect(()=>{
    const fetchUser=async()=>{
      if(!localStorage.getItem("chat-app-user")){
        navigate("/login");
      }else{
        setCurrentUser(await JSON.parse(localStorage.getItem("chat-app-user")));
      setisloaded(true);
      }
    }
    fetchUser();  
  },[]);
  useEffect(()=>{
   if(currentuser){
    socket.current=io(host);
    socket.current.emit("add-user",currentuser._id);
   }
  },[currentuser]);

  useEffect(()=>{
    const fetchContacts=async()=>{
      if(currentuser){
        if(currentuser.isAvatarImageSet){
          const data=await axios.get(`${allUsersRoute}/${currentuser._id}`);
          console.log(data.data);
          setcontacts(data.data);
        }else{
          navigate("/setAvatar");
        }
      }
    }
    fetchContacts();
   
  },[currentuser])

  const handleChatChange=(chat)=>{
    setcurrentchat(chat);

  }
  return (
    <Container>
    <div className='container'>
      <Contacts contacts={contacts} currentuser={currentuser} changeChat={handleChatChange}/>
    
    {
     isloaded && currentchat===undefined?
     (<Welcome currentUser={currentuser} />):(<ChatContainer CurrentChat={currentchat} currentUser={currentuser} socket={socket} />)
    }
    
    </div>
    </Container>
  )
}

const Container=styled.div`
height:100vh;
width:100vw;
display:flex;
flex-direction:column;
justify-content:center;
gap:1rem;
align-items:center;
background-color:#131324;
.container{
  height:85vh;
  width:85vw;
  background-color:#00000076;
  display:grid;
  grid-template-columns:25% 75%;
  @media screen and (min-width:720px) and (max-width:1080px){
    grid-template-columns:35% 65%;
}
}

`;
export default Chat;