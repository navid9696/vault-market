import * as React from 'react'
import Backdrop from '@mui/material/Backdrop'
import Box from '@mui/material/Box'
import Modal from '@mui/material/Modal'
import Fade from '@mui/material/Fade'
import CloseIcon from '@mui/icons-material/CloseTwoTone'

const baseStyle = {
	position: 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	minWidth: 300,
	maxHeight: '90vh',
	bgcolor: 'background.paper',
	boxShadow: 24,
	overflowY: 'auto',
	overflowX: 'hidden',
	p: 5,
	mt: 1,
	textAlign: 'center',
}

interface TransitionsModalProps {
	open: boolean
	handleClose: () => void
	children: React.ReactNode
	border?: string
}

export default function TransitionsModal({
	open,
	handleClose,
	children,
	border = '2px solid var(--border)',
}: TransitionsModalProps) {
	return (
		<Modal
			aria-labelledby='transition-modal-title'
			aria-describedby='transition-modal-description'
			open={open}
			onClose={handleClose}
			closeAfterTransition
			slots={{ backdrop: Backdrop }}
			slotProps={{
				backdrop: { timeout: 500 },
			}}>
			<Fade in={open}>
				<Box sx={{ ...baseStyle, border }}>
					<div onClick={handleClose} className='absolute top-0 right-0 p-2 cursor-pointer z-10'>
						<CloseIcon fontSize='large' />
					</div>
					<div>{children}</div>
				</Box>
			</Fade>
		</Modal>
	)
}
