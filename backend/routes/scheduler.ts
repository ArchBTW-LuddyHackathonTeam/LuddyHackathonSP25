import Router from "express"
import OpenAI from "openai"
import internalRequest from "../graphql/internal"
import { Class } from "../graphql/db-types"

const client = (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY != "") ? new OpenAI() : null
const router = Router()

router.post("/prompt", (req, res) => {
    if (!client) {
        res.status(503).json({ message: "This service has been disabled" })
        return
    }
    if (req.body.input) {
        internalRequest(`
            query Courses {
                courses {
                    course_code
                    credits
                    description
                    instruction_mode
                    attributes {
                        name
                    }
                    terms_offered
                    sections {
                        days_of_week
                        time_of_day
                    }
                    instructor {
                        name
                        reviews {
                            quality_score
                        }
                    }
                }
            }`)
            .then(data => {
                if (data && data.courses) return data.courses as any[]
                else throw new Error()
            })
            .then(data => {
                return data.map(data => {
                    return {
                        code: data.course_code,
                        credits: data.credits,
                        description: data.description,
                        instructionMode: data.instruction_mode,
                        attributes: data.attributes.map((a: any) => a.name),
                        terms: data.terms_offered,
                        days: data.sections.length > 0
                            ? data.sections[0].days_of_week
                            : null,
                        time: data.sections.length > 0
                            ? data.sections[0].time_of_day
                            : null,
                        instructor: data.instructor ? data.instructor.name : null,
                        instructorAvg: (data.instructor && data.instructor.reviews.length > 0)
                            ? data.instructor.reviews.map((r: any) => r.quality_score).reduce((left: number, right: number) => left + right, 0) / data.instructor.reviews.length
                            : NaN
                    } as Class
                })
            })
            .then(classes => client.responses.create({
                model: "gpt-4o",
                instructions: `You are an academic advisor. Use the following array of JSON objects as references of the course directory.\n${JSON.stringify(classes)}`,
                input: req.body.input
            }))
            .then(response => {
                if (response.error) res.status(403).json({ message: "An unknown error occurred" })
                else res.json({ message: response.output_text })
            })
    } else res.status(403).json({ message: "An unknown error occurred" })
})

export default router
