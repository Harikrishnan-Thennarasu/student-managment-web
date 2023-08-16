
import { useEffect, useState } from "react";
import "./login.css";
import { Link, Redirect } from "react-router-dom";
import { toLogin } from "../../provider/service";

const Login = () => {
    const [userName, onNameChange] = useState('');
    const [password, onPasswordChange] = useState('');
    const [isEnableLoginButton, onEnableLoginButton] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [isAuthenticated, setAuthenticated] = useState(false);

    useEffect(() => {
        const userId = localStorage.getItem('userId');
        setAuthenticated(userId ? true : false);
    }, [])

    useEffect(() => {
        if (userName && password) {
            onEnableLoginButton(true);
        } else {
            onEnableLoginButton(false);
        }
        setErrorMsg('')
    }, [userName, password]);

    const onLogin = async () => {
        try {
            const req = {
                userName,
                password
            }
            const result = await toLogin(req);
            if (result && result.success) {
                setAuthenticated(true)
                localStorage.setItem('userId', result.data._id);
            } else {
                if (result && result.statusCode == 401) {
                    setErrorMsg('Invaild credential !')
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
                    pathname: "/dashboard",
                    state: { userId: 'Hari001' }
                }}
            />
        );
    }

    return (
        <div className="Main">
            <div className='Container'>
                <p >Login With Your Credential</p>
                <input type="text" className='Field' placeholder='Usename' onChange={(event) => onNameChange(event.target.value)} />
                <input type="password" className='Field' placeholder='Password' onChange={(event) => onPasswordChange(event.target.value)} />
                <input type='button' className='Field' value={'Login'} onClick={onLogin} disabled={!isEnableLoginButton} />
                {errorMsg && <p style={{ fontSize: 15, color: ' #ff1100' }}>{errorMsg}</p>}
                <p><Link to="/signup">Sign Up Here</Link></p>
            </div>
        </div>
    )
}

export default Login;


