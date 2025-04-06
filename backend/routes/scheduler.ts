import Router from "express"
import OpenAI from "openai"

const client = new OpenAI()
const router = Router()

router.post("/prompt", (req, res) => {
    if (req.body.prompt && req.body.input) client.responses.create({ model: "gpt-3.5-turbo", instructions: "", input: req.body.input })
        .then(response => {
            if (response.error) res.status(403).json({ message: "An unknown error occurred" })
            else res.json({ message: response.output_text })
        })
    else res.status(403).json({ message: "An unknown error occurred" })
})

export default router
