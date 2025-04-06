import Router from "express"
import { queryPrompt } from "../utils/openai"

const router = Router()

router.post("/prompt", (req, res) => {
    if (req.body.prompt && req.body.input) queryPrompt("", req.body.prompt).then(message => res.json({ input: req.body.input, message }))
    else res.status(403).json({ message: "An unknown error occurred" })
})

export default router
