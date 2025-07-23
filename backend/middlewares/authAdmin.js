import jwt from 'jsonwebtoken'

// admin authentication middleware
const authAdmin = async (req, res, next) => {
    try {
        const { atoken } = req.headers;
        const aToken = atoken;
        console.log(req.headers.atoken);

        // console.log(aToken);
        
        if (!aToken) {
            return res.json({ success: false, message: 'Not Authorized Login Again' });
        }
        
        const token_decode = jwt.verify(aToken, process.env.JWT_SECRET);
        // console.log("Decoded",token_decode);
        
        // console.log(process.env.JWT_SECRET);
        
        // console.log(token_decode.email); 
        // console.log(process.env.ADMIN_EMAIL);
        //  console.log(token_decode.password); 
        //  console.log(process.env.ADMIN_PASSWORD);

        if (
            token_decode.email !== process.env.ADMIN_EMAIL ||
            token_decode.password !== process.env.ADMIN_PASSWORD
        ) {

            return res.json({ success: false, message: 'Not Authorized Login Again' });
        }

        next();
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

export default authAdmin;
