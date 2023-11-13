import connectDB from "../DB/connection.js"
import authRouter from './module/auth/auth.router.js'
import userRouter from './module/User/user.router.js'
import postRouter from './module/post/post.router.js'
import commentRouter from './module/comment/comment.router.js'
import ReplyRouter from './module/reply/reply.router.js'
import { globalErrorHandling } from "./utils/errorHandling.js"
import { fileURLToPath } from "url" //dh bardo 3l4an ysa3dny fy 7war al path
import path from 'path'
const __dirname=path.dirname(fileURLToPath(import.meta.url)) 
const initApp = (app, express) => {
    app.use(express.json())
    app.use(`/auth`,authRouter)
    app.use(`/user`,userRouter)
    app.use(`/post`,postRouter)
    app.use(`/comment`,commentRouter)
    app.use(`/reply`,ReplyRouter)

    app.all('*', (req, res, next) => {
        res.send("In-valid Routing Plz check url  or  method")
    })
    app.use(globalErrorHandling)
    app.use("/uploads",express.static(path.join(__dirname,'../uploads')))
    connectDB()

}

export default initApp