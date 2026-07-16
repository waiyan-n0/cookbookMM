import { useNavigate} from "react-router-dom";
import {useState} from "react";

const ProtectedRoute = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const navigate = useNavigate();

    return (
        <div>
            {children}
        </div>
    );
}

export default ProtectedRoute;