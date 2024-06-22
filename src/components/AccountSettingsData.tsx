import { Dispatch, SetStateAction, useState } from 'react'
import { Alert, Button, Snackbar, SnackbarOrigin } from '@mui/material'
import { useCallback } from 'react'
import NicknameChange from './NicknameChange'
import PasswordChange from './PasswordChange'
import EmailChange from './EmailChange'
import AddressChange from './AddressChange'
import AccountSettings from './AccountSettings'

interface State extends SnackbarOrigin {
	open: boolean
}

interface AccountSettingsProps {
	setIsDetailsVisible: Dispatch<SetStateAction<boolean>>
	contentId: string | null
}

const AccountSettingsData = ({ setIsDetailsVisible, contentId }: AccountSettingsProps) => {
	const [formSubmit, setFormSubmit] = useState(false)

	const [state, setState] = useState<State>({
		open: false,
		vertical: 'top',
		horizontal: 'center',
	})
	const { vertical, horizontal, open } = state

	const handleFormSubmit = (newState: SnackbarOrigin) => {
		setFormSubmit(true)
		// setState({ ...newState, open: true })
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
			<Button onClick={() => handleFormSubmit({ vertical: 'top', horizontal: 'center' })} type='submit'>
				Submit
			</Button>

			<Snackbar
				className='fixed -top-10'
				anchorOrigin={{ vertical, horizontal }}
				open={formSubmit}
				autoHideDuration={30000}>
				<Alert onClose={() => setFormSubmit(false)} severity='success' variant='filled' sx={{ width: '100%' }}>
					Profile data saved!
				</Alert>
			</Snackbar>
		</div>
	)
}

export default AccountSettingsData
