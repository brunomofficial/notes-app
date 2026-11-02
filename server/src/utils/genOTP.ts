import crypto from "crypto"

export const genOTP = () => {
    return crypto.randomInt(100_000, 1000_000).toString();
}