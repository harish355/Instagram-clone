import React, { useEffect,useState } from 'react'
import './Post.css';
import Avatar from '@material-ui/core/Avatar';
import {db} from './firebase';
import firebase from "firebase";
// import { IconName } from "react-icons/ai";
import FavoriteRoundedIcon from '@material-ui/icons/FavoriteRounded';

function Post({username,caption,imageurl,postId,user,likes}) {
    const [comments,setComments]=useState([]);
    const [comment,setComment]=useState('');

    useEffect(() => {
        let unsubscribe;
        if (postId) {
            unsubscribe = db
                .collection("posts")
                .doc(postId)
                .collection("comments")
                .orderBy('timestamp','desc')
                .onSnapshot((snapshot) => {
                    setComments(snapshot.docs.map((doc) => doc.data()));
                })
        }

        return () => {
             unsubscribe();
        };
    }, [postId]);

    const postComment = (event) => {

        event.preventDefault();
        db.collection("posts").doc(postId).collection("comments").add({
            text: comment,
            username: user.displayName,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
        setComment('');
      }
      const likePost = () => {
        db.collection("posts").doc(postId).update({
            likes:likes+1 
        })
      }
    
    return (
        <div className="post">
            <div className="post_header">
                <div className="post_avatar">
             <Avatar alt="Rider" src="https://lh3.googleusercontent.com/ogw/ADGmqu9EoeROJF5mjLOR0RS8NPH08rVlR3TLMTFTWRhdzg=s83-c-mo"  /> 
             </div>
            <h3 className="post__username">{username}</h3>
            </div>
            <img className="post_image" src={imageurl} alt="Post_Image"/>
            {user && 
            <div className="post__like_box">
            <button
            className="post__button"
            type="submit"
            onClick={likePost}
            ><FavoriteRoundedIcon /></button>
            <h4 >{likes} Likes</h4>
            </div>
        }
            <h4 className="post_text"><strong>{username}</strong> {caption}</h4>
            
            <div className="post__comments">
                {comments.map((comment)=>(
                    <p>
                        <strong>{comment.username}</strong> {comment.text}
                    </p>
                ))}
            </div>

            {user && (
                <form className="post__comment_box">
                    <input
                    className="post__input"
                    type="text"
                    placeholder="Add a comment"
                    value={comment}
                    onChange={(e)=>setComment(e.target.value)}
                    />
                    <button 
                    className="post__button"
                    disabled={!comment}
                    type="submit"
                    onClick={postComment}
                    >Post</button>
                </form>
            )}

        </div>
    )
}

export default Post
