import * as React from 'react'
import Backdrop from '@mui/material/Backdrop'
import Box from '@mui/material/Box'
import Modal from '@mui/material/Modal'
import Fade from '@mui/material/Fade'
import CloseIcon from '@mui/icons-material/CloseTwoTone'

const style = {
	position: 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',

	minWidth: 300,
	height: 'fit-content',
	bgcolor: 'background.paper',
	border: '2px solid #000',
	boxShadow: 24,
}

interface TransitionsModalProps {
	open: boolean
	handleClose: () => void
	children: React.ReactNode
}

export default function TransitionsModal({ open, handleClose, children }: TransitionsModalProps) {
	return (
		<Modal
			aria-labelledby='transition-modal-title'
			aria-describedby='transition-modal-description'
			open={open}
			onClose={handleClose}
			closeAfterTransition
			slots={{ backdrop: Backdrop }}
			slotProps={{
				backdrop: {
					timeout: 500,
				},
			}}>
			<Fade in={open}>
				<Box sx={style}>
					<div onClick={handleClose} className='absolute top-0 right-0 p-2 cursor-pointer z-10'>
						<CloseIcon fontSize='large' />
					</div>
					<div className='relative overflow-hidden p-10 mt-2'>{children}</div>
				</Box>
			</Fade>
		</Modal>
	)
}
