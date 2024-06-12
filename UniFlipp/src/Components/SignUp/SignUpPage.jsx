import { useState } from 'react';
import { useNavigate } from 'react-router-dom'
import React from 'react';
import './signup.css';


function SignUpPage() {
    const navigate = useNavigate();
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const serverurl = import.meta.env.VITE_SERVER_URL

    async function registerUser(e) {
        e.preventDefault();
        const response = await fetch(`${serverurl}/api/register`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name,
                email,
                password
            }),
        })

        const data = await response.json()
        if (data.status === 'ok') {
            navigate('/login')
        }

    }
    return (
        <div className='container5'> { }
            <h1>Registration for UniFlip</h1>
            <form onSubmit={registerUser}>
                <input placeholder='Name'
                    type='text'
                    onChange={(e) => setName(e.target.value)}
                    value={name} />
                <br />
                <input placeholder='Email'
                    type='email'
                    onChange={(e) => setEmail(e.target.value)}
                    value={email} />
                <br />
                <br />
                <input placeholder='Password'
                    type='password'
                    onChange={(e) => setPassword(e.target.value)}
                    value={password} />
                <br />
                <br />
                <input type='submit' value='Submit' />
            </form>
        </div>
    );
}

export default SignUpPage;
