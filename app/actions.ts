'use server'

import { z } from 'zod'

const ContactSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    message: z.string().min(10, "Message must be at least 10 characters"),
})

export async function sendContactEmail(prevState: any, formData: FormData) {
    const validatedFields = ContactSchema.safeParse({
        name: formData.get('name'),
        email: formData.get('email'),
        message: formData.get('message'),
    })

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Missing Fields. Failed to send message.",
        }
    }

    // Here you would typically use Nodemailer or an email service
    // For now, we simulate a delay and log the data
    await new Promise((resolve) => setTimeout(resolve, 1000))

    console.log("Email sent:", validatedFields.data)

    return {
        message: "Message sent! I'll get back to you as soon as possible.",
        success: true
    }
}
