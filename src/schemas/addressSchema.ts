import { z } from "zod";

export const addressSchema = z.object({
	address: z.string().min(1, { message: 'Address cannot be empty.' }),
	addressOptional: z.string().optional(),
	city: z.string().min(1, { message: 'City cannot be empty.' }),
	state: z.string().min(1, { message: 'State cannot be empty.' }),
	zipCode: z.string().min(1, { message: 'Zip code cannot be empty.' }),
})