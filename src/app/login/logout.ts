import jwt, {JwtPayload} from 'jsonwebtoken';

const decodeJwt = (token: string): JwtPayload | null => {
    const decoded = jwt.decode(token);
    if (typeof decoded === 'object' && decoded !== null) {
        return decoded as JwtPayload;
    }
    return null;
};

const startAutoLogout = (token: string) => {
    try {
        const decoded = decodeJwt(token);
        const expiryTime = (decoded?.exp || 0) * 1000; // Convert to milliseconds
        const currentTime = Date.now();
        const timeUntilExpiry = expiryTime - currentTime;

        if (timeUntilExpiry > 0) {
            // Schedule logout
            setTimeout(() => {
                sessionStorage.removeItem('authToken');
                window.location.href = "/";
            }, timeUntilExpiry);
        } else {
            // If already expired
            sessionStorage.removeItem('authToken');
            window.location.href = "/";
        }
    } catch (error) {
        console.error('Invalid token:', error);
        sessionStorage.removeItem('authToken');
        window.location.href = "/";
    }
};

export default startAutoLogout;