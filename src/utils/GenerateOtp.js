const generateOtp = () =>
{
    const min=1000;
    const max=9999;
    return Math.floor(min + Math.random() * (max-min+1));
}
export default generateOtp;