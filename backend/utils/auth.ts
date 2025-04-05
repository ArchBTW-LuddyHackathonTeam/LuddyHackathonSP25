import { randomBytes, pbkdf2 } from "crypto"
import { JWTPayload, jwtVerify, SignJWT } from "jose"

const jwtSecret = new TextEncoder().encode(process.env.JWT_SECRET)

export function hashPassword(password: string): Promise<string> {
    return new Promise((resolve, reject) => {
        pbkdf2(password, randomBytes(32).toString("hex"), 100000, 64, "sha256", (error, hashed) => {
            if (error) reject(error)
            else resolve(hashed.toString("hex"))
        })
    })
}

export function signToken(payload: object): Promise<string> {
    return new SignJWT(payload as JWTPayload)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("7d")
        .sign(jwtSecret)
}

export function verifyToken(token: string): Promise<object> {
    return jwtVerify(token, jwtSecret)
}
