import axios from 'axios';
import React, { useState } from 'react';

const ResetPassword = () => {
    const [email, setEmail] = useState('');

    const sendEmailHandler = async (e) => {
        e.preventDefault()
        try {
            const res = await axios.post('/api/password/forgotpassword',  email );
            console.log(res.data);
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div>
            <form onSubmit={sendEmailHandler}>
                <input type='text' placeholder='enter email' onChange={(e) => setEmail(e.target.value)} />
                <button type='submit'>send link</button>
            </form>
        </div>
    );
}

export default ResetPassword;
