// import { Dispatch, SetStateAction, useState } from 'react'
// import { Button } from '@mui/material'
// import { useCallback } from 'react'
// import NicknameForm from './NicknameForm'
// import PasswordForm from './PasswordForm'
// import EmailForm from './EmailForm'
// import AddressForm from './AddressForm'
// import { toast } from 'react-toastify'
// import 'react-toastify/dist/ReactToastify.css'

// interface AccountSettingsProps {
// 	setIsDetailsVisible: Dispatch<SetStateAction<boolean>>
// 	contentId: string | null
// }

// const AccountSettingsData = ({ setIsDetailsVisible, contentId }: AccountSettingsProps) => {
// 	const [formIsSubmit, setFormIsSubmit] = useState(false)

// 	const handleFormSubmit = () => {
// 		toast.success('hello')
// 		setFormIsSubmit(true)
// 	}

// 	const handleClose = useCallback(() => {
// 		setIsDetailsVisible(prev => !prev)
// 		setFormIsSubmit(false)
// 	}, [setIsDetailsVisible])

// 	const renderFormContent = () => {
// 		switch (contentId) {
// 			case 'nickname':
// 				return <NicknameForm />
// 			case 'email':
// 				return <EmailForm />
// 			case 'password':
// 				return <PasswordForm />
// 			case 'address':
// 				return <AddressForm />
// 			default:
// 				return null
// 		}
// 	}
// 	return (
// 		<form className=''>
// 			<div>{renderFormContent()}</div>
// 			<Button onClick={handleClose}>back</Button>
// 			<Button onClick={handleFormSubmit} type='submit'>
// 				Submit
// 			</Button>
// 		</form>
// 	)
// }

// export default AccountSettingsData
