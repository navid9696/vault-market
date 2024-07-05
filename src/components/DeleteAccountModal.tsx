import { Button, Typography } from '@mui/material'

interface DeleteAccountModalProps {
	handleClose: () => void
}

const DeleteAccountModal = ({ handleClose }: DeleteAccountModalProps) => {
	return (
		<>
			<Typography gutterBottom variant={'h4'}>
				Are you sure you want to delete your account?
			</Typography>
			<div className='flex gap-20'>
				<Button variant='outlined' size='large' onClick={handleClose}>
					Delete
				</Button>
				<Button variant='contained' size='large' onClick={handleClose}>
					Cancel
				</Button>
			</div>
		</>
	)
}

export default DeleteAccountModal
