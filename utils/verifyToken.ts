import jwt from "jsonwebtoken";

export const verifyToken = (token: string) => {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!);
        return decoded as { id: string };
    } catch (error) {
        return null;
    }
};
