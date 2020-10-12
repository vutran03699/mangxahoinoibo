exports.createPostValidator = (req, res, next) => {
    // tiêu đề
    req.check('title', 'Viết một tiêu đề').notEmpty();
    req.check('title', 'Tiêu đề phải có từ 4 đến 150 ký tự').isLength({
        min: 4,
        max: 150
    });
    // nội dung
    req.check('body', 'Viết nội dung').notEmpty();
    req.check('body', 'Nội dung phải có từ 4 đến 2000 kí tự').isLength({
        min: 4,
        max: 2000
    });
    // kiểm tra lỗi
    const errors = req.validationErrors();
    // nếu lỗi hiển thị cái đầu tiên khi chúng xảy ra
    if (errors) {
        const firstError = errors.map(error => error.msg)[0];
        return res.status(400).json({ error: firstError });
    }
    // tiến tới phần mềm trung gian tiếp theo
    next();
};

exports.userSignupValidator = (req, res, next) => {
    // Tên không phải là null và từ 4-10 ký tự
    req.check('name', 'Tên là bắt buộc').notEmpty();
    // email không phải là null, hợp lệ và được chuẩn hóa
    req.check('email', 'Email phải có từ 3 đến 32 ký tự')
        .matches(/.+\@.+\..+/)
        .withMessage('Email phải chứa @')
        .isLength({
            min: 4,
            max: 2000
        });
    // check for password
    req.check('password', 'Mật khẩu là bắt buộc').notEmpty();
    req.check('password')
        .isLength({ min: 6 })
        .withMessage('Mật khẩu phải chứa ít nhất 6 ký tự')
        .matches(/\d/)
        .withMessage('Mật khẩu phải chứa một số');
    // check for errors
    const errors = req.validationErrors();
    // nếu lỗi hiển thị cái đầu tiên khi chúng xảy ra
    if (errors) {
        const firstError = errors.map(error => error.msg)[0];
        return res.status(400).json({ error: firstError });
    }
    // tiến tới phần mềm trung gian tiếp theo
    next();
};

exports.userSigninValidator = (request, response, next) => {
    request
        .check('email', 'Email phải có từ 3 đến 32 ký tự')
        .matches(
            /^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/
        )
        .withMessage('Vui lòng nhập địa chỉ email hợp lệ của bạn')
        .isLength({
            min: 4,
            max: 32
        });
    request.check('password', 'Mã thông báo đăng nhập xã hội không hợp lệ!').notEmpty();
    request
        .check('password')
        .isLength({ min: 6 })
        .withMessage('Mã thông báo đăng nhập xã hội của bạn không hợp lệ!');
    const errors = request.validationErrors();
    if (errors) {
        const firstError = errors.map(error => error.msg)[0];
        return res.status(400).json({ error: firstError });
    }
    next();
};

exports.passwordResetValidator = (req, res, next) => {
    // check for password
    req.check('newPassword', 'Mật khẩu là bắt buộc').notEmpty();
    req.check('newPassword')
        .isLength({ min: 6 })
        .withMessage('Mật khẩu phải dài ít nhất 6 ký tự')
        .matches(
            /^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/
        )
        .withMessage('phải chứa một chữ số')
        .withMessage('Mật khẩu phải chứa một số');

    // kiểm tra lỗi
    const errors = req.validationErrors();
    // nếu lỗi hiển thị cái đầu tiên khi chúng xảy ra
    if (errors) {
        const firstError = errors.map(error => error.msg)[0];
        return res.status(400).json({ error: firstError });
    }
    //tiến tới phần mềm trung gian tiếp theo hoặc ...
    next();
};
