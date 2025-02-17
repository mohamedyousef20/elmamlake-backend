
// import notFound from '../utils/notFound.js'
import companyRoute from './companyRoute.js'

import articleRoute from './articleRoute.js'

import serviceRoute from './serviceRoute.js'

import contactRoute from './contactRoute.js'
import loginRoute from './loginRoute.js'


const mountRoutes = (app) => {

    // app.use("/api/v1/auth", authRouter);
    // app.use("/api/v1/user", userRouter);
    // app.use("/api/v1/post", postRouter);
    app.use("/api/v1/company", companyRoute);
    app.use("/api/v1/articles", articleRoute);
    app.use("/api/v1/service", serviceRoute);
    app.use("/api/v1/contact", contactRoute);
    app.use("/api/v1/login", loginRoute);

    // app.use("*", notFound);
}

export default mountRoutes;