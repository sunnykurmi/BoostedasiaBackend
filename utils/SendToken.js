exports.sendtoken = (user, statuscode, res) => {
    const token = user.getjwttoken();
    const cookieExpireDays = parseInt(process.env.COOKIE_EXPIRE);
    if (isNaN(cookieExpireDays) || cookieExpireDays <= 0) {
        return res.status(500).json({ message: 'Invalid COOKIE_EXPIRE configuration' });
    }
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + cookieExpireDays);
    const options = {
        expires: expirationDate,
        httpOnly: true,
    };
    res.status(statuscode).cookie('token', token, options).json({ success: true, id: user._id, token });
};
