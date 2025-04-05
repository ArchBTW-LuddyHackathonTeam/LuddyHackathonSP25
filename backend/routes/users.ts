import Router from "express"
import internalRequest from "../graphql/internal"
import { hashPassword, signToken } from "../utils/auth"
import { User } from "../graphql/db-types"

const router = Router()

router.post("/verify", (req, res) => {
    if (req.body.username && req.body.password) {
        internalRequest(`
            query Query($username: String!) {
                user_username(username: $username) {
                  id
                  salt
                  username
                  password
                }
            }`, { "username": req.body.username })
            .then(userData => {
                if (userData && userData.user_username) return userData.user_username as User
                else throw new Error()
            })
            .then((user: User) => Promise.all([user, hashPassword(req.body.password, user.salt)]))
            .then(([user, hashedPassword]) => {
                if (user.password == hashedPassword) return signToken(user)
                else throw new Error()
            })
            .then(token => res.status(200).cookie("token", token, { maxAge: 7*24*60*60*1000, httpOnly: true }).json({}))
            .catch(_ => {
                res.sendStatus(401)
            })
    }
})

export default router
