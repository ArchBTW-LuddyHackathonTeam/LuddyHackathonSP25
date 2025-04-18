import Router from "express"
import internalRequest from "../graphql/internal"
import { Class } from "../graphql/db-types"

const router = Router()

router.get("/", (_req, res) => {
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
        .then(data => res.json(data))
        .catch(_ => res.status(404).json({ message: "An unknown error occurred" }))
})

router.get("/id/:id", (req, res) => {
    internalRequest(`
        query Courses($courseId: ID!) {
            course(id: $courseId) {
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
        }`, { courseId: req.params.id })
        .then(data => {
            if (data && data.course) return data.course as any
            else throw new Error()
        })
        .then(data => {
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
        .then(data => res.json(data))
        .catch(_ => res.status(404).json({ message: "Unknown Class ID" }))
})

router.post("/ids", (req, res) => {
    if (req.body.ids) {
        internalRequest(`
            query Courses($ids: [ID!]) {
                courses_ids(ids: $ids) {
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
            }`, { ids: req.body.ids })
            .then(data => {
                if (data && data.courses_ids) return data.courses_ids as any[]
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
            .then(data => res.json(data))
            .catch(_ => res.status(404).json({ message: "Invalid form of IDs" }))
    } else res.status(404).json({ message: "Invalid form of IDs" })
})

router.get("/attributeID/:attribute", (req, res) => {
    internalRequest(`
        query Courses($courseAttributeId: ID!) {
            course_attribute(id: $courseAttributeId) {
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
            }
        }`, { courseAttributeId: req.params.attribute })
        .then(data => {
            if (data && data.course_attribute) return (data.course_attribute as any).courses as any[]
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
                    instructor: data.instructor.name,
                    instructorAvg: (data.instructor && data.instructor.reviews.length > 0)
                        ? data.instructor.reviews.map((r: any) => r.quality_score).reduce((left: number, right: number) => left + right, 0) / data.instructor.reviews.length
                        : NaN
                } as Class
            })
        })
        .then(data => res.json(data))
        .catch(_ => res.status(404).json({ message: "Unknown Attribute" }))
})

router.get("/attribute/:attribute", (req, res) => {
    internalRequest(`
        query Course_attribute($abbrev: String!) {
            course_attributes_abbrev(abbrev: $abbrev) {
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
            }
        }`, { abbrev: req.params.attribute })
        .then(data => {
            if (data && data.course_attributes_abbrev) return data.course_attributes_abbrev as any[]
            else throw new Error()
        })
        .then(data => {
            return data.flatMap(data => {
                return data.courses.map((data: any) => {
                    return {
                        code: data.course_code,
                        credits: data.credits,
                        description: data.description ? data.description : null,
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
                        instructorAvg: data.instructor
                            ? (data.instructor.reviews.length > 0
                                ? data.instructor.reviews
                                    .map((r: any) => r.quality_score)
                                    .reduce((left: number, right: number) => left + right, 0)
                                        / data.instructor.reviews.length
                                : NaN)
                            : null
                    } as Class
                })
            })
        })
        .then(data => res.json(data))
        .catch(_ => res.status(404).json({ message: "Unknown Attribute" }))
})

router.get("/department/:abbrev", (req, res) => {
    internalRequest(`
        query Courses($abbrev: String!) {
            department_abbrev(abbrev: $abbrev) {
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
            }
        }`, { abbrev: req.params.abbrev })
        .then(data => {
            if (data && data.department_abbrev) return (data.department_abbrev as any).map((obj: any) => obj.courses) as any[]
            else throw new Error()
        })
        .then(data => {
            return data.flatMap(data => {
                return data.map((data: any) => {
                    return {
                        code: data.course_code,
                        credits: data.credits,
                        description: data.description ? data.description : null,
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
                        instructorAvg: data.instructor
                            ? (data.instructor.reviews.length > 0
                                ? data.instructor.reviews
                                    .map((r: any) => r.quality_score)
                                    .reduce((left: number, right: number) => left + right, 0)
                                        / data.instructor.reviews.length
                                : NaN)
                            : null
                    } as Class
                })
            })
        })
        .then(data => res.json(data))
        .catch(_ => res.status(404).json({ message: "Unknown Department" }))
})

export default router
