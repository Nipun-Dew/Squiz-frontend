import jwt from "jsonwebtoken";

const decodeToken = (token: string) => {
    try {
        const decoded = jwt.decode(token);
        if (!decoded) {
            console.error("Unable to decode token");
        }
        return decoded;
    } catch (error) {
        console.error("Error decoding token:", error);
        return null;
    }
};

export default decodeToken;

