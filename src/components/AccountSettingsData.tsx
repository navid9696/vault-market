import { Dispatch, SetStateAction, useState } from 'react'
import { Button, SnackbarOrigin } from '@mui/material'
import { useCallback } from 'react'
import NicknameChange from './NicknameChange'
import PasswordChange from './PasswordChange'
import EmailChange from './EmailChange'
import AddressChange from './AddressChange'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

interface AccountSettingsProps {
	setIsDetailsVisible: Dispatch<SetStateAction<boolean>>
	contentId: string | null
}

const AccountSettingsData = ({ setIsDetailsVisible, contentId }: AccountSettingsProps) => {
	const [formSubmit, setFormSubmit] = useState(false)

	const handleFormSubmit = () => {
		toast.success('hello')
		setFormSubmit(true)
	}

	const handleClose = useCallback(() => {
		setIsDetailsVisible(prev => !prev)
		setFormSubmit(false)
	}, [setIsDetailsVisible])

	const renderModalContent = () => {
		switch (contentId) {
			case 'nickname':
				return <NicknameChange />
			case 'email':
				return <EmailChange />
			case 'password':
				return <PasswordChange />
			case 'address':
				return <AddressChange />
			default:
				return null
		}
	}
	return (
		<div className=''>
			<div>{renderModalContent()}</div>
			<Button onClick={handleClose}>back</Button>
			<Button onClick={handleFormSubmit} type='submit'>
				Submit
			</Button>
		</div>
	)
}

export default AccountSettingsData
