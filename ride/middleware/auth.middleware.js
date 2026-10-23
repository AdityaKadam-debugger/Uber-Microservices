const jwt = require('jsonwebtoken');
const axios = require('axios');

module.exports.userAuth = async (req,res,next) => {
    try
    {
        const token = req.cookies.token || req.headers.authorization.split(' ')[1];
        if(!token){
            return res.status(404).json({
                message : "Unauthorized"
            })
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await usermodel.findById(decoded._id);
        if(!user){
            return res.status(404).json({
                message: "Unauthorized"
            })
        }
        req.user = user;
        next();
    }catch(err){
        return res.status(400).json(
            {
                message : "Error Occured"
            }
        )
    }
    // Here we need user service data for authentication in ride service basically here we fetching the user data form the user's database to the ride service 
    
    const response = await axios.get(`${BASE_URL}/user/me`,{
        headers: {
            Authorization: `Bearer ${token}`
        }
    })

    const user = response.data;
    if(!user){
        return res.status(401).json({message: "Unauthorized"})
    }
    req.user = user;
    next();
    
}

