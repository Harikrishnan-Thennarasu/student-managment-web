import { useEffect, useState } from 'react';
import { toSignUp } from '../../provider/service';
import './signup.css';
import { Link, Redirect } from 'react-router-dom';

const SignUp = () => {
    const [userName, onNameChange] = useState('');
    const [password, onPasswordChange] = useState('');
    const [isEnableSignUpButton, onEnableSignUpButton] = useState(false);
    const [errorMsg, setErrorMsg] = useState('')
    const [isAuthenticated, setAuthenticated] = useState(false);

    useEffect(() => {
        const userId = localStorage.getItem('userId');
        setAuthenticated(userId ? true : false);
    }, [])


    useEffect(() => {
        if (userName && password) {
            onEnableSignUpButton(true);
        } else {
            onEnableSignUpButton(false);
        }
        setErrorMsg('');
    }, [userName, password]);

    const onSignUp = async () => {
        try {
            const req = {
                userName,
                password
            }
            const result = await toSignUp(req);
            if (result && result.success) {
                setAuthenticated(true);
                localStorage.setItem('userId', result.data._id);
            } else {
                if (result && result.statusCode == 409) {
                    setErrorMsg('Usename not availabile, try diffrent one')
                } else {
                    setErrorMsg('Internal server error')
                }
            }

        } catch (e) {
            console.error(e);
        }
    }


    if (isAuthenticated) {
        return (
            <Redirect
                to={{
                    pathname: "/dashboard"
                }}
            />
        );
    }

    return (
        <div className="Main">
            <div className='Container'>
                <p className="Header">Create Your Profile</p>
                <input type="text" className='Field' placeholder='Usename' onChange={(event) => onNameChange(event.target.value)} />
                <input type="password" className='Field' placeholder='Password' onChange={(event) => onPasswordChange(event.target.value)} />
                <input type='button' className='Field' value={'Sign Up'} onClick={onSignUp} disabled={!isEnableSignUpButton} />
                {errorMsg && <p style={{ fontSize: 15, color: ' #ff1100' }}>{errorMsg}</p>}
                <p><Link to="/login">Back To Login</Link></p>
            </div>
        </div>
    )
}

export default SignUp;