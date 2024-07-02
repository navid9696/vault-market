import { zodResolver } from '@hookform/resolvers/zod'
import FormBase from './FormBase'
import { z } from 'zod'
import { Dispatch, SetStateAction } from 'react'
import { toast } from 'react-toastify'

const nicknameSchema = z.object({
	nickname: z
		.string()
		.min(1, { message: 'Name cannot be empty!' })
		.regex(/^[a-zA-Z]/, { message: 'Must start with a letter' })
		.min(5, { message: 'Must be 5 or more characters long' })
		.max(15, { message: 'Must be 15 or fewer characters long' }),
})

interface NicknameFormInput {
	nickname: string
}

interface NicknameFormProps {
	setIsDetailsVisible: Dispatch<SetStateAction<boolean>>
}

const NicknameForm = ({ setIsDetailsVisible }: NicknameFormProps) => {
	return (
		<FormBase
			title='Identity Update'
			subtitle='Choose a New Identity for the Wasteland'
			label='Nickname'
			fieldName='nickname'
			resolver={zodResolver(nicknameSchema)}
			onSubmitSuccess={(data: NicknameFormInput) => {
				toast.success('Success')
				console.log(data)
			}}
			setIsDetailsVisible={setIsDetailsVisible}
		/>
	)
}

export default NicknameForm
