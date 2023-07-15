import React, { useState } from 'react'
import '../App.css'


const Register = () => {
    const [username,setUsername]=useState('')
    const [password,setPassword]=useState('')
    async function register(ev){
        ev.preventDefault();
            const response = await fetch('http://localhost:4000/register',{
                method:'POST',
                body:JSON.stringify({username,password}),
                headers:{'Content-Type':'application/json'},
            })
            if(response.status === 200){
                alert("registration succesfully")
            }
            else{
                alert("registraion failed")
            }
        }

    

  return (
    <form className='register' onSubmit={register}>
        <h1>Register</h1>
        <input type='text' placeholder='UserName' value={username} onChange={ev => setUsername(ev.target.value)}/>
        <input type='password' placeholder='Password' value={password} onChange={ev => setPassword(ev.target.value)}/>
        <button>Register</button>
    </form> 
     )
}

export default Register