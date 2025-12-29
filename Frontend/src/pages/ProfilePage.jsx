import {useAuth} from '../context/AuthContext';
import './styler.css';

const ProfilePage = () => {
    const{ user } = useAuth();

    return(
        <div>
            <h2>Welcome to your Profile {user.name}</h2>
            <p>There will be many details about your account here, including your reviews, watchlists, etc.</p>
        </div>
    );
}

export default ProfilePage;