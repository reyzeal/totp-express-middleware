const {Validate} = require('totp')
const opt = (options = {}) => {
    options = Object.assign({},{
        key : "secret",
        length : 6,
        period : 30,
        T0 : 0,
        type : "default"
    },options)
    return options
}
module.exports = (option = {})=>{
    const options = opt(option)
    return function middleware(req, res, next){
        const authToken = req.headers['authorization'] && req.headers['authorization'].split(" ")
        if(authToken && authToken.length > 1 && authToken[0] === "Bearer"){
            const token = authToken[1]
            let salt = ""
            switch (options.type) {
                case "default":
                    break;
                case "body":
                    salt = (req.body && req.body.length) || ""
                    break
                case "path":
                    salt = req.path
                    break;
                default:
                    throw Error("Salt type is not defined")
            }
            if(Validate(token,options.key+salt,options.length,options.period,options.T0)){
                next()
            }else{
                throw new Error('Invalid Token');
            }
        }else{
            throw new Error('Token not provided');
        }
    }
}
