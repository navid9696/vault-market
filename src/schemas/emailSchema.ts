import { z } from "zod";

export const emailSchema = z.object({
	email: z
		.string()
		.min(1, { message: 'Your email address cannot be empty.' })
		.email({ message: 'Please enter a valid email address.' }),
})