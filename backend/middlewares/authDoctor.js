import jwt from 'jsonwebtoken'

// doctor authentication middleware
const authDoctor = async (req, res, next) => {
    try {
        // Get token from headers - check multiple possible header names
        const dToken = req.headers.dtoken || req.headers.dToken || req.headers.authorization?.replace('Bearer ', '')
        
        // Check if token exists
        if (!dToken) {
            return res.status(401).json({ 
                success: false, 
                message: 'Not Authorized Login Again' 
            })
        }

        // Verify JWT_SECRET exists
        if (!process.env.JWT_SECRET) {
            console.error('JWT_SECRET is not defined in environment variables')
            return res.status(500).json({ 
                success: false, 
                message: 'Server configuration error' 
            })
        }

        // Verify and decode the token
        const token_decode = jwt.verify(dToken, process.env.JWT_SECRET)
        
        // Check if token contains required data
        if (!token_decode.id) {
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid token format' 
            })
        }

        // Initialize req.body if it doesn't exist
        if (!req.body) {
            req.body = {}
        }
        
        // Add doctor ID to request
        req.body.docId = token_decode.id
        
        // Optional: Add more doctor info if available in token
        if (token_decode.email) {
            req.body.docEmail = token_decode.email
        }
        
        next()
        
    } catch (error) {
        console.error('Auth middleware error:', error)
        
        // Handle specific JWT errors
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid token' 
            })
        }
        
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ 
                success: false, 
                message: 'Token expired. Please login again' 
            })
        }
        
        if (error.name === 'NotBeforeError') {
            return res.status(401).json({ 
                success: false, 
                message: 'Token not active yet' 
            })
        }
        
        // Generic error response
        return res.status(500).json({ 
            success: false, 
            message: 'Authentication failed' 
        })
    }
}

export default authDoctor