import OpenAI from "openai"

const client = new OpenAI()

export function queryPrompt(instructions: string, input: string): Promise<string> {
    return new Promise((resolve, reject) => {
        client.responses.create({ model: "gpt-3.5-turbo", instructions, input }).then(response => {
            if (response.error) reject(response.error)
            else resolve(response.output_text)
        })
    })
}
