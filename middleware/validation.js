const { Query } = require("pg");

const allowedFields = ['title', 'content'];

function validateCreateNote(req, res, next){

    const fieldsSentByUser = Object.keys(req.body);
    const allValid = fieldsSentByUser.every(fields => allowedFields.includes(fields));
    if(!allValid){
        return res.status(400).json({
            message: "Bad request. Invalid fields sent."
        });
    }

    let {title, content} = req.body;
    //does title and content exist?
    if(title === undefined || content === undefined){
        return res.status(400).json({
            message: 'Bad request. The note must have a title and content.'
        });
    }
    //are they strings?
    if(typeof title !== 'string' || typeof content !== 'string'){
        return res.status(400).json({
            message: 'Bad request. The title and content must be strings.'
        });
    }
    title = title.trim();
    content = content.trim();

    if(title.length === 0 || content.length === 0){
        return res.status(400).json({
            message: 'Bad request. The title or the content cannot be empty.'
        });
    }

    if(title.length < 5 || content.length < 5){
        return res.status(400).json({
            message: 'Bad request. The title or content length are too small (atleast 5).'
        });
    }

    if(title.length > 50 || content.length > 5000){
        return res.status(400).json({
            message: 'Bad request. The title or content length are too large. Title: Under 50 characters, Content: Under 5000 characters.'
        });
    }
    req.body.title = title;
    req.body.content = content;
    next();
}

function validatePatchNote(req, res, next){

    const fieldsSentByUser = Object.keys(req.body);
    const allValid = fieldsSentByUser.every(fields => allowedFields.includes(fields));
    if(!allValid){
        return res.status(400).json({
            message: "Bad request. Invalid fields sent."
        });
    }

    let {title, content} = req.body;
    //does title or content exist?
    if(title === undefined && content === undefined){
        return res.status(400).json({
            message: 'Bad request. To update you must provide a title or content.'
        });
    }
    //are they strings?
    if(title !== undefined){
        if(typeof title !== 'string'){
            return res.status(400).json({
                message: 'Bad request. The title must be string.'
            });
        }
        title = title.trim();
        if(title.length === 0){
            return res.status(400).json({
                message: 'Bad request. The title cannot be empty.'
            });
        }
        if(title.length < 5){
            return res.status(400).json({
                message: 'Bad request. The title is too small. Minimum length is 5.'
            });
        }

        if(title.length > 50){
            return res.status(400).json({
                message: 'Bad request. The title is too large. Must be under 50 characters.'
            });
        }
        req.body.title = title;
    }

    if(content !== undefined){
        if(typeof content !== 'string'){
            return res.status(400).json({
                message: 'Bad request. The content must be string.'
            });
        }
        content = content.trim();
        if(content.length === 0){
            return res.status(400).json({
                message: 'Bad request. The content cannot be empty.'
            });
        }
        if(content.length < 5){
            return res.status(400).json({
                message: 'Bad request. The content is too small. Minimum length is 5.'
            });
        }
        if(content.length > 5000){
            return res.status(400).json({
                message: 'Bad request. The content is too large. Must be under 5000 characters.'
            });
        }
        req.body.content = content;
    }
    next();
}

const allowedRegFields = ['email', 'password'];

function validateRegister(req, res, next){
    const fieldsReg = Object.keys(req.body)
    const allValidReg = fieldsReg.every(field => allowedRegFields.includes(field))

    if(!allValidReg){
        return res.status(400).json({
            message: "Bad request. Only Email and Password are allowed."
        })
    }

    let {email, password} = req.body
    //is email a string
    if(typeof email !== 'string'){
        return res.status(400).json({
            message: "Bad request. Email must be a string."
        })
    }//is it empty?
    email = email.trim()
    if(email.length === 0){
        return res.status(400).json({
            message: "Bad request. Email cannot be empty."
        })
    }

    if(email.length > 255){
        return res.status(400).json({
            message: "Bad request. Email is too long."
        })
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if(!emailRegex.test(email)){
        return res.status(400).json({
            message: "Bad request. Email invalid."
        })
    }
    req.body.email = email

    //pass validation

    if(typeof password !== 'string'){
        return res.status(400).json({
            message: "Bad request. Password must be a string."
        })
    }//is it empty?
    if(password.length === 0){
        return res.status(400).json({
            message: "Bad request. Password cannot be empty."
        })
    }

    if(password.length > 255){
        return res.status(400).json({
            message: "Bad request. Password is too long."
        })
    }

    req.body.password = password
    next()
}

function validateLogin(req, res, next){
    const fieldsLog = Object.keys(req.body)
    const allValidLogin = fieldsLog.every(field => allowedRegFields.includes(field))

    if(!allValidLogin){
        return res.status(400).json({
            message: "Bad request. Only Email and Password are allowed."
        })
    }

    let {email, password} = req.body
    //is email a string
    if(typeof email !== 'string'){
        return res.status(400).json({
            message: "Bad request. Email must be a string."
        })
    }//is it empty?
    email = email.trim()
    if(email.length === 0){
        return res.status(400).json({
            message: "Bad request. Email cannot be empty."
        })
    }

    if(email.length > 255){
        return res.status(400).json({
            message: "Bad request. Email is too long."
        })
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if(!emailRegex.test(email)){
        return res.status(400).json({
            message: "Bad request. Email invalid."
        })
    }
    req.body.email = email

    //pass validation

    if(typeof password !== 'string'){
        return res.status(400).json({
            message: "Bad request. Password must be a string."
        })
    }//is it empty?
    if(password.length === 0){
        return res.status(400).json({
            message: "Bad request. Password cannot be empty."
        })
    }

    if(password.length > 255){
        return res.status(400).json({
            message: "Bad request. Password is too long."
        })
    }

    req.body.password = password
    next()
}
module.exports = {validateCreateNote, validatePatchNote, validateRegister, validateLogin};