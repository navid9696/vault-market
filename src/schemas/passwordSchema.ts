import { z } from "zod"

export const passwordSchema = z
	.string()
	.min(8, { message: 'Ensure your password has at least 8 characters.' })
	.max(20, { message: 'Keep your password under 20 characters.' })
	.refine(password => /[A-Z]/.test(password), {
		message: 'Add at least one uppercase letter.',
	})
	.refine(password => /[a-z]/.test(password), {
		message: 'Add at least one lowercase letter.',
	})
	.refine(password => /[0-9]/.test(password), {
		message: 'Add at least one digit.',
	})
	.refine(password => /[!@#$%^&*]/.test(password), {
		message: 'Add at least one special character (!@#$%^&*).',
	})

export const updatePasswordSchema = z
	.object({
		currentPassword: z.string().min(1, { message: 'Current password is required' }),
		password: passwordSchema,
		confirmPassword: z.string(),
	})
	.refine(data => data.password === data.confirmPassword, {
		message: "The passwords you entered don't match. Please verify and try again.",
		path: ['confirmPassword'],
	})
