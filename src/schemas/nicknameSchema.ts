import { z } from "zod";

export const nicknameSchema = z.object({
	nickname: z
		.string()
		.min(1, { message: 'Your nickname cannot be empty.' })
		.regex(/^[a-zA-Z]/, { message: 'Start your name with a letter.' })
		.min(5, { message: 'Make sure your name is at least 5 characters long.' })
		.max(15, { message: 'Keep your name within 15 characters.' }),
})