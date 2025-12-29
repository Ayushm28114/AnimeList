import {useState} from "react";
import {useAuth} from '../context/AuthContext';
import './styler.css';

function Login() {
    const {login, loading} = useAuth();
    const [form, setForm] = useState({username: '', password: ''});
    const [error, setError] = useState(null);

    const handlechange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value}));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        try{
            await login(form.username, form.password);
        }
        catch(err){
            setError(`Invalid username or password: ${err?.message ?? ''}`);
        }
    };

    return(
        <div className="login-container">
            <div className="login-wrapper">
                <h2 id="login-title">Login</h2>
                {error && <p className="error-message">{error}</p>}

                <form className="login-form" onSubmit={handleSubmit}>
                    <div className="form-field">
                        <label>Username</label>
                        <input 
                            name="username"
                            placeholder="Enter your username"
                            value={form.username}
                            onChange={handlechange}
                            required 
                        />
                    </div>
                    <div className="form-field">
                        <label>Password</label>
                        <input 
                            type="password"
                            name="password"
                            placeholder="Enter your password"
                            value={form.password}
                            onChange={handlechange}
                            required
                        />
                    </div>
                    <button 
                        className={`login-button ${loading ? 'loading' : ''}`}
                        type="submit" 
                        disabled={loading}
                    >
                        {loading ? "Loading..." : "Login"}
                    </button>
                </form>

                <div className="login-links">
                    <a href="/register">Don't have an account? Register here</a>
                    <a href="/forgot-password">Forgot Password?</a>
                </div>
            </div>
        </div>
    )
}

export default Login;