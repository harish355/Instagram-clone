import './App.css';
import React ,{useState,useEffect} from 'react';
import Post from './Post';
import {db,auth} from './firebase';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { Button, Input } from '@material-ui/core';
import ImageUpload from './ImageUpload';
// import InstagramEmbed from 'react-instagram-embed';




function getModalStyle() {
  const top = 50 ;
  const left = 50 ;
  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));


function App() {
  const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle);
  const [posts,setPosts]=useState([ ]);
  const [open,setOpen]=useState(false);
  const [openSignIn,setOpenSignIn]=useState(false);
  const [username,setUsername]=useState("");
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [user,setUser]=useState(null);

  useEffect(() => {
    const unsubscribe=auth.onAuthStateChanged((authUser)=>
    {
      if(authUser)
      {
        console.log("User Logged In");
        console.log(authUser);
        setUser(authUser);
      }
      else{
        setUser(null);
        console.log("User not Logged in");
      }
    })
    return () =>{
      //perform some clean up
      unsubscribe();
    }
  }, [user,username])

  useEffect(() => {
    db.collection('posts').orderBy('timestamp','desc').onSnapshot(snapshot=>{
      setPosts(snapshot.docs.map(doc=>({
        id:   doc.id,
        post: doc.data()
      })));
    })
  }, [])

  const signup =(event)=>
  {
    event.preventDefault();
    auth.createUserWithEmailAndPassword(email,password)
    .then((authUser)=>{
      return authUser.user.updateProfile(
        {
          displayName:username,
        })
    })
    .catch((error)=>alert(error.message));
    setOpen(false);
    setUsername("");
    setEmail("");
    setPassword("");

  }

  const signin=(event)=>
  {
    event.preventDefault();
    auth.signInWithEmailAndPassword(email,password)
    .catch((error)=>alert(error.message))

    setOpenSignIn(false);
    setUsername("");
    setEmail("");
    setPassword("");
  }

  return (
    <div className="app">
      
      <Modal
        open={open}
        onClose={()=>setOpen(false)}
      >
        <div style={modalStyle} className={classes.paper}>
      <form className="app__signup">
        <center>
        <img className="app__header_image" alt="instagram_logo" src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"/>
        </center>
        <Input
        placeholder="Username"
        type="text"
        value={username}
        onChange={(e)=>setUsername(e.target.value)}
        />
        
        <Input
        placeholder="email"
        type="text"
        value={email}
        onChange={(e)=>setEmail(e.target.value)}
        />
        
        <Input
        placeholder="password"
        type="password"
        value={password}
        onChange={(e)=>setPassword(e.target.value)}
        />
        
        <Button type="submit" onClick={signup}>Sign Up</Button>
    </form>
    
    </div>
      </Modal>
      <Modal
        open={openSignIn}
        onClose={()=>setOpenSignIn(false)}
      >
        <div style={modalStyle} className={classes.paper}>
      <form className="app__signup">
        <center>
        <img className="app__header_image" alt="instagram_logo" src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"/>
        </center>
        <Input
        placeholder="email"
        type="text"
        value={email}
        onChange={(e)=>setEmail(e.target.value)}
        />
        
        <Input
        placeholder="password"
        type="password"
        value={password}
        onChange={(e)=>setPassword(e.target.value)}
        />
        
        <Button type="submit" onClick={signin}>Login</Button>
    </form>
    
    </div>
      </Modal>
      



    <div className="app__header">
            <img className="app__header_image" alt="instagram_logo" src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"/>
            {user?(
            <Button type="submit" onClick={()=>{auth.signOut()}}>Logout</Button>
            ):
            (<div className="app__loginContainer">
            <Button onClick={()=>{setOpenSignIn(true)}}>Sign In</Button>
              <Button onClick={()=>{setOpen(true)}}>Sign Up</Button>
              </div>
            )}
        </div>

        <div className="app__post">
              <div className="app__post_left">
            {
              posts.map(({id,post})=>(
                <Post key={id} postId={id} user={user} username={post.username} likes={post.likes} caption={post.caption} imageurl={post.imageurl}/>
              ))
            }
            </div>
            <div className="app__post_right">
              
            {/* <InstagramEmbed

              url="https://instagr.am/p/CAX8psZMEdL_Lkto_rA_8oIhfc0/"
              maxWidth={320}
              hideCaption={false}
              containerTagName="div"
              protocol=""
              injectScript
              onLoading={() => {}}
              onSuccess={() => {}}
              onAfterRender={() => {}}
              onFailure={() => {}}
            /> */}
            </div>
        </div>
        
        

      {user?.displayName ? (<ImageUpload username={user.displayName}/>)
      : 
      (<center><h3>Sorry You need To Login to Upload</h3></center>)
      }
    </div>
  );
}

export default App;
