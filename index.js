const {Validate} = require('totp')
const opt = (options = {}) => {
    options = Object.assign({},{
        key : "secret",
        length : 6,
        period : 30,
        T0 : 0
    },options)
    return options
}
module.exports = (option = {})=>{
    const options = opt(option)
    return function middleware(req, res, next){
        const authToken = req.headers['authorization'] && req.headers['authorization'].split(" ")
        if(authToken && authToken.length > 1 && authToken[0] === "Bearer"){
            const token = authToken[1]
            if(Validate(token,options.key,options.length,options.period,options.T0)){
                next()
            }else{
                throw new Error('Invalid Token');
            }
        }
    }
}
