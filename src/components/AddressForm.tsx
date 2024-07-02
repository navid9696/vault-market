import { SettingFormsProps } from '@/lib/types'
import { Button, TextField } from '@mui/material'
import { useCallback, useState } from 'react'
import { toast } from 'react-toastify'

const AddressForm = ({ setIsDetailsVisible }: SettingFormsProps) => {
	const [formIsSubmit, setFormIsSubmit] = useState(false)

	const handleFormSubmit = () => {
		toast.success('hello')
		setFormIsSubmit(true)
	}

	const handleReturn = useCallback(() => {
		setIsDetailsVisible(false)
		setFormIsSubmit(false)
	}, [setIsDetailsVisible])

	return (
		<form action=''>
			<div></div>
			<div>
				<TextField error={false} id='filled-basic' label='Nickname' variant='filled' helperText='' />
			</div>

			<Button onClick={handleReturn}>back</Button>
			<Button onClick={handleFormSubmit} type='submit'>
				Submit
			</Button>
		</form>
	)
}

export default AddressForm
