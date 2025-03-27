import React from 'react'
import { Button } from '@mui/material'

interface ConfirmationModalProps {
	onConfirm: () => void
	onCancel: () => void
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ onConfirm, onCancel }) => {
	return (
		<div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50'>
			<div className='bg-white p-6 rounded-lg w-11/12 max-w-md'>
				<h2 className='text-xl font-bold mb-4'>Confirm Update</h2>
				<p className='mb-6'>Your address has been modified. Do you want to update your address?</p>
				<div className='flex justify-end gap-4'>
					<Button color='secondary' onClick={onCancel}>
						Cancel
					</Button>
					<Button color='primary' onClick={onConfirm}>
						Confirm
					</Button>
				</div>
			</div>
		</div>
	)
}

export default ConfirmationModal
