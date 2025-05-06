import { Button, Typography } from '@mui/material'
import { useCallback } from 'react'
import { toast } from 'react-toastify'
import { trpc } from '~/server/client'
import { SettingFormsProps } from '~/lib/types'
import { useRouter } from 'next/navigation'
import { signOut } from 'next-auth/react'

interface DeleteAccountModalProps {
	handleClose: () => void
}

const DeleteAccountModal = ({ handleClose }: DeleteAccountModalProps) => {
	const deleteAccount = trpc.user.deleteAccount.useMutation({
		onSuccess: () => {
			toast.success('Account deleted successfully')
			handleClose()
			signOut({ callbackUrl: '/login' })
		},
		onError: err => {
			toast.error(err.message)
		},
	})

	const handleDelete = useCallback(() => {
		deleteAccount.mutate()
	}, [deleteAccount])

	return (
		<>
			<Typography gutterBottom variant='h4'>
				Are you sure you want to delete your account?
			</Typography>
			<div className='flex justify-center gap-20'>
				<Button variant='outlined' size='large' onClick={handleDelete} disabled={deleteAccount.status === 'pending'}>
					{deleteAccount.status === 'pending' ? 'Deleting...' : 'Delete'}
				</Button>
				<Button variant='contained' size='large' onClick={handleClose}>
					Cancel
				</Button>
			</div>
		</>
	)
}

export default DeleteAccountModal
