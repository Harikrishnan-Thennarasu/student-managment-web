import { Redirect } from "react-router-dom";
import { useEffect, useState } from "react";

function Auth() {

    const [isAuthenticated, setAuthenticated] = useState(false);

    useEffect(() => {
        const userId = localStorage.getItem('userId');
        setAuthenticated(userId ? true : false);
    })

    if (isAuthenticated) {
        return (
            <Redirect
                to={{
                    pathname: "/dashboard",
                }}
            />
        );
    }

    return (
        <Redirect
            to={{
                pathname: "/login",
            }}
        />
    );
}

export default Auth;
