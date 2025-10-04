import React from 'react'
import { Button } from '@mui/material'

interface ConfirmationModalProps {
	onConfirm: () => void
	onCancel: () => void
}

const ConfirmationModal = ({ onConfirm, onCancel }: ConfirmationModalProps) => {
	return (
		<div className='bg-opacity-50 flex justify-center items-center z-50'>
			<div className='bg-bg max-w-md'>
				<h2 className='text-xl font-bold mb-4'>Confirm Update</h2>
				<p className='mb-6'>Your address has been modified. Do you want to update your address?</p>
				<div className='flex justify-center gap-4'>
					<Button size='large' color='secondary' onClick={onCancel}>
						Cancel
					</Button>
					<Button size='large' color='primary' onClick={onConfirm}>
						Confirm
					</Button>
				</div>
			</div>
		</div>
	)
}

export default ConfirmationModal
