import { Button, Typography, CircularProgress } from '@mui/material'
import { useCallback } from 'react'
import { toast } from 'react-toastify'
import { trpc } from '~/server/client'
import { signOut } from 'next-auth/react'

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

interface DeleteAccountModalProps {
	handleClose: () => void
}

const DeleteAccountModal = ({ handleClose }: DeleteAccountModalProps) => {
	const deleteAccount = trpc.user.deleteAccount.useMutation({
		onSuccess: async () => {
			toast.success(
				<div>
					☢️ RECORD PURGE COMPLETE
					<br />
					ACCOUNT: DELETED
					<br />
					STATUS: CONFIRMED
				</div>,
				{ autoClose: 3000 }
			)
			handleClose()
			await sleep(3000)
			signOut({ callbackUrl: '/login' })
		},
		onError: err => {
			toast.error(
				<div>
					⚠️ OPERATION FAILED
					<br />
					{err.message}
				</div>
			)
		},
	})

	const handleDelete = useCallback(() => {
		deleteAccount.mutate()
	}, [deleteAccount])

	const isPending = deleteAccount.status === 'pending'

	return (
		<>
			<Typography gutterBottom variant='h4'>
				Are you sure you want to delete your account?
			</Typography>
			<div className='flex justify-center gap-20'>
				<Button
					variant='outlined'
					size='large'
					onClick={handleDelete}
					disabled={isPending}
					aria-busy={isPending}
					endIcon={isPending ? <CircularProgress size={20} /> : null}
					sx={{
						'&.Mui-disabled': {
							opacity: 0.9,
							backgroundColor: 'primary.main',
							color: 'primary.contrastText',
						},
					}}>
					{isPending ? 'Processing…' : 'Delete'}
				</Button>
				<Button variant='contained' size='large' onClick={handleClose}>
					Cancel
				</Button>
			</div>
		</>
	)
}

export default DeleteAccountModal
