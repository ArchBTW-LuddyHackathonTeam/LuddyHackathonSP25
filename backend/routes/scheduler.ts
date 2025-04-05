import Router from "express"
import { queryPrompt } from "../utils/openai"

const router = Router()

router.post("/prompt", (req, res) => {
    if (req.body.prompt) queryPrompt("", req.body.prompt).then(message => res.json({ message }))
    else res.status(403).json({ message: "An unknown error occurred" })
})

export default router
