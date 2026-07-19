export function calculatePlatformFee(
    amount: number
) {
    const percentage = 10;

    return Math.round(
        amount * percentage / 100
    );
}