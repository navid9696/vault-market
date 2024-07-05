import { Button, Typography } from '@mui/material'

interface DeleteAccountModalProps {
	handleClose: () => void
}

const DeleteAccountModal = ({ handleClose }: DeleteAccountModalProps) => {
	return (
		<>
			<Typography variant={'h4'}>Are you sure you want to delete your account?</Typography>
			<Button onClick={handleClose}>Cancel</Button>
		</>
	)
}

export default DeleteAccountModal
