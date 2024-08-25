exports.sendtoken = (user, statuscode, res) => {
    console.log("user   ", user, "\n status code   ", statuscode);
    const token = user.getjwttoken();
    console.log("token    ", token);

    const cookieExpireDays = parseInt(process.env.COOKIE_EXPIRE);
    console.log("expire time for cookie   ", cookieExpireDays);
    if (isNaN(cookieExpireDays) || cookieExpireDays <= 0) {
        console.log("Invalid COOKIE_EXPIRE configuration");
        return res.status(500).json({ message: 'Invalid COOKIE_EXPIRE configuration' });
    }
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + cookieExpireDays);
    const options = {
        expires: expirationDate,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Set to true in production
        sameSite: "None", // Necessary for cross-origin cookies
    };
    console.log("cookie options.... ", options);
    res.status(statuscode)
        .cookie('token', token, options)
        .json({ success: true, id: user._id, token });
};