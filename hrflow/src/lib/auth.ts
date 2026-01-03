
import { SignJWT, jwtVerify } from 'jose';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';

const SECRET_KEY = process.env.JWT_SECRET || 'secret-key-change-in-prod';
const key = new TextEncoder().encode(SECRET_KEY);

export async function encrypt(payload: any) {
    return await new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('7d') // Session lasts 7 days
        .sign(key);
}

export async function decrypt(input: string): Promise<any> {
    try {
        const { payload } = await jwtVerify(input, key, {
            algorithms: ['HS256'],
        });
        return payload;
    } catch (error) {
        return null;
    }
}

export async function hashPassword(password: string) {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
}

export async function verifyPassword(password: string, hash: string) {
    return await bcrypt.compare(password, hash);
}

export async function getSession() {
    const session = (await cookies()).get('session')?.value;
    if (!session) return null;
    return await decrypt(session);
}

export async function createSession(userId: string, role: string) {
    const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    const session = await encrypt({ userId, role, expires });

    (await cookies()).set('session', session, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        expires: expires,
        sameSite: 'lax',
        path: '/',
    });
}

export async function deleteSession() {
    (await cookies()).delete('session');
}
