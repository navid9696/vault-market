import { zodResolver } from '@hookform/resolvers/zod'
import FormBase from './FormBase'
import { z } from 'zod'
import { Dispatch, SetStateAction } from 'react'
import { toast } from 'react-toastify'
import { Button } from '@mui/material'

const nicknameSchema = z.object({
	nickname: z
		.string()
		.min(1, { message: 'Name cannot be empty!' })
		.regex(/^[a-zA-Z]/, { message: 'Must start with a letter' })
		.min(5, { message: 'Must be 5 or more characters long' })
		.max(15, { message: 'Must be 15 or fewer characters long' }),
})

interface NicknameFormProps {
	setIsDetailsVisible: Dispatch<SetStateAction<boolean>>
}

const NicknameForm = ({ setIsDetailsVisible }: NicknameFormProps) => {
	return (
		<FormBase
			title='Identity Update'
			subtitle='Choose a New Identity for the Wasteland'
			size='small'
			fields={[
				{ name: 'nickname', label: 'Nickname' },
				{ name: 'nickname', label: 'Nickname' },
				{ name: 'nickname', label: 'Nickname' },
				{ name: 'nickname', label: 'Nickname' },
				{ name: 'nickname', label: 'Nickname' },
			]}
			resolver={zodResolver(nicknameSchema)}
			onSubmitSuccess={(data: any) => {
				toast.success('Success')
			}}>
			<div className='flex justify-center  gap-20 '>
				<Button size='large' onClick={() => setIsDetailsVisible(false)}>
					Return
				</Button>
				<Button size='large' type='submit'>
					Submit
				</Button>
			</div>
		</FormBase>
	)
}

export default NicknameForm
