import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

export const hashPassword = async (plaintext: string) : Promise<string> => {
    return await bcrypt.hash(plaintext, SALT_ROUNDS);
}

export const verifyPassword = async (plaintext: string, hash: string) : Promise<boolean> => {
    return await bcrypt.compare(plaintext, hash);
}