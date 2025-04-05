import Router from "express"
import internalRequest from "../graphql/internal"
import { createSalt, hashPassword, signToken } from "../utils/auth"
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
            }`, { username: req.body.username })
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

router.post("/", (req, res) => {
    if (req.body.username && req.body.password) {
        const salt = createSalt(32)
        hashPassword(req.body.password, salt)
            .then(password => internalRequest(`
                mutation AddUser($user: AddUserInput!) {
                    addUser(user: $user) {
                        id
                        password
                        salt
                        username
                    }
                }`, { user: { username: req.body.username, salt, password } }))
            .then(user => {
                if (user && user.addUser) return user.addUser as User
                else throw new Error()
            })
            .then(signToken)
            .then(token => res.status(200).cookie("token", token, { maxAge: 7*24*60*60*1000, httpOnly: true }).json({}))
            .catch(_ => {
                res.sendStatus(401)
            })
    }
})

export default router
