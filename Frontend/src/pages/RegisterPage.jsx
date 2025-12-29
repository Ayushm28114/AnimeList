import { useState } from "react";
import api from "../services/api.js";
import { useNavigate } from "react-router-dom";
import './styler.css';

function RegisterPage(){
    const navigate = useNavigate();
    const [form, setForm] = useState({username: '', password : '', email: ''});
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const handlechange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value}));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);   
        
        try{
            await api.post("/auth/register/", form);
            setSuccess("Registration successful! Redirecting to login... 😊");
            setTimeout(() => {
                navigate('/login');
            }, 1500);
        }
        catch(err){
            setError(`Registration failed 😥 ${err?.response?.data?.detail || err.message}`);
        }
    };

    return(
        <div className="register-container">
            <div className="register-wrapper">
                <h2 id="register-title">Create Account</h2>
                {error && <p className="error-message">{error}</p>}
                {success && <p className="success-message">{success}</p>}

                <form className="register-form" onSubmit={handleSubmit}>
                    <div className="form-field">
                        <label>Username</label>
                        <input  
                            name="username"
                            placeholder="Choose a username"
                            value={form.username}
                            onChange={handlechange}
                            required
                        />
                    </div>
                    <div className="form-field">
                        <label>Email</label>
                        <input  
                            type="email"
                            name="email"
                            placeholder="Enter your email"
                            value={form.email}
                            onChange={handlechange}
                            required
                        />
                    </div>
                    <div className="form-field">
                        <label>Password</label>
                        <input  
                            type="password"
                            name="password"
                            placeholder="Create a strong password"
                            value={form.password}
                            onChange={handlechange}
                            required
                            minLength={6}
                        />
                    </div>
                    <button className="register-button" type="submit">Create Account</button>
                </form>

                <div className="register-links">
                    <a href="/login">Already have an account? Login here</a>
                </div>
            </div>
        </div>
    );
}

export default RegisterPage;