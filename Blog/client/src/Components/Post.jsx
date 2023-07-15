import React from 'react'
import {format} from 'date-fns'
import '../App.css'
import { Link } from 'react-router-dom'

import '../App.css'
const Post = ({_id,title,summary,content,cover,createdAt,author}) => {
  return (
    <div className="post">
        <div className="image" style={{marginLeft:"25%"}}>
          <Link to={`/post/${_id}`}>
        <img src={'http://localhost:4000/'+cover} alt={summary}  />
        </Link>
        </div>
      <div className="texts">
      <Link to={`/post/${_id}`}>
      <h2>Title :{title}</h2>
      </Link>
       <p className="info">
        <a className="author">Author :{author.username}</a>
        <time>{format(new Date(createdAt),'MM d, yyyy , HH:mm')} </time>
       </p>
       <h2>Summary:</h2>
        <p className='summary'>
          {summary}
        </p>
      </div>
        
      </div>
  )
}

export default Post