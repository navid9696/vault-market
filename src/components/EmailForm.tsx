import { zodResolver } from '@hookform/resolvers/zod'
import FormBase from './FormBase'
import { z } from 'zod'
import { Dispatch, SetStateAction } from 'react'
import { toast } from 'react-toastify'

const emailSchema = z.object({
	email: z
		.string()
		.min(1, { message: 'Name cannot be empty!' })
		.regex(/^[a-zA-Z]/, { message: 'Must start with a letter' })
		.min(5, { message: 'Must be 5 or more characters long' })
		.max(15, { message: 'Must be 15 or fewer characters long' }),
})

interface EmailFormInput {
	email: string
}

interface EmailFormProps {
	setIsDetailsVisible: Dispatch<SetStateAction<boolean>>
}

const EmailForm = ({ setIsDetailsVisible }: EmailFormProps) => {
	return (
		<FormBase
			title='Email Update'
			subtitle='Choose a New Identity for the Wasteland'
			label='Nickname'
			fieldName='email'
			resolver={zodResolver(emailSchema)}
			onSubmitSuccess={(data: EmailFormInput) => {
				toast.success('Success')
				console.log(data)
			}}
			setIsDetailsVisible={setIsDetailsVisible}
		/>
	)
}

export default EmailForm
