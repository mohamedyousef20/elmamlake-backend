// app/api/admin/login/route.js

import expressAsyncHandler from "express-async-handler";
import  jwt  from "jsonwebtoken";

const checkAdminCredentials = expressAsyncHandler(async (req, res, next) => {

    const { username, password } = req.body;
    console.log(username)
    console.log(password)

    if (
        username === process.env.ADMIN_USERNAME &&
        password === process.env.ADMIN_PASSWORD
    ) {

        const token = jwt.sign(
            {
                username: username
            },
            process.env.JWT_SECRET_KEY
        ); res.status(200).json({ msg: 'success', token: token })

    } else {
        res.status(404).json({ msg: 'fail' })

    }


}

)

export default checkAdminCredentials