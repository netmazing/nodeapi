exports.createPostValidator = (req, res, next) => {
    req.check('title', 'Write a title of post').notEmpty();
    req.check('title', "Title must be between 3 and 200 characters").isLength({
        min: 3,
        max: 200
    });
    req.check('body', 'Write a body of post').notEmpty();
    req.check('body', 'Body of post must be between 10 and 2000 characters').isLength({
        min: 10,
        max: 2000
    });

    const errors = req.validationErrors();

    if (errors) {
        const firstError = errors.map(error => error.msg)[0];
        return res.status(400).json({
            error: firstError
        })
    };

    next();
};

exports.userSignupValidator = (req, res, next) => {
    req.check('name', "Name is required").notEmpty();

    req.check('email', 'Email is required')
    .matches(/.+\@.+\..+/)
    .withMessage('Email must contain @')
    .isLength({
        min: 4,
        max: 100
    })

    req.check('password', 'Password is required').notEmpty();
    req.check('password')
    .isLength({
        min: 6
    })
    .withMessage('Password must contain at least 6 characters')
    .matches(/\d/)
    .withMessage('Password must contain a number')


    const errors = req.validationErrors();

    if (errors) {
        const firstError = errors.map(error => error.msg)[0];
        return res.status(400).json({
            error: firstError
        })
    };

    next();
}

exports.passwordResetValidator = (req, res, next) => {
    // check for password
    req.check("newPassword", "Password is required").notEmpty();
    req.check("newPassword")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 chars long")
        .matches(/\d/)
        .withMessage("must contain a number")
        .withMessage("Password must contain a number");
 
    // check for errors
    const errors = req.validationErrors();
    // if error show the first one as they happen
    if (errors) {
        const firstError = errors.map(error => error.msg)[0];
        return res.status(400).json({ error: firstError });
    }
    // proceed to next middleware or ...
    next();
};