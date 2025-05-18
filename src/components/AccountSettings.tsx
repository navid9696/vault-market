import { Avatar, Badge, Button, Typography, styled } from '@mui/material'
import { Dispatch, SetStateAction, useCallback, useEffect, useState } from 'react'
import { AiTwotoneEdit as EditIcon } from 'react-icons/ai'
import { FaLongArrowAltRight as ArrowRight } from 'react-icons/fa'
import { FaTrashAlt as Trash } from 'react-icons/fa'
import NicknameForm from './NicknameForm'
import EmailForm from './EmailForm'
import TransitionsModal from './TransitionModal'
import DeleteAccountModal from './DeleteAccountModal'
import PasswordForm from './PasswordForm'
import AddressForm from './AddressForm'
import { toast } from 'react-toastify'
import { trpc } from '~/server/client'
import { useSession } from 'next-auth/react'

const VisuallyHiddenInput = styled('input')({
	clip: 'rect(0 0 0 0)',
	clipPath: 'inset(50%)',
	height: 1,
	overflow: 'hidden',
	position: 'absolute',
	bottom: 0,
	left: 0,
	whiteSpace: 'nowrap',
	width: 1,
})

const renderForm = (contentId: string | null, setIsFormVisible: Dispatch<SetStateAction<boolean>>): React.ReactNode => {
	switch (contentId) {
		case 'nickname':
			return <NicknameForm setIsDetailsVisible={setIsFormVisible} />
		case 'email':
			return <EmailForm setIsDetailsVisible={setIsFormVisible} />
		case 'password':
			return <PasswordForm setIsDetailsVisible={setIsFormVisible} />
		case 'address':
			return <AddressForm setIsDetailsVisible={setIsFormVisible} />
		default:
			return null
	}
}

const AccountSettings = () => {
	const [avatar, setAvatar] = useState<string>()
	const [isFormVisible, setIsFormVisible] = useState(false)
	const [contentId, setContentId] = useState<string | null>(null)
	const [modalOpen, setModalOpen] = useState(false)
	const utils = trpc.useUtils()
	const { data: profile } = trpc.user.getProfile.useQuery()
	const { data: session } = useSession()
	const provider = session?.user.provider

	const handleModalClose = () => {
		setModalOpen(false)
	}

	const handleOpenSettings = (id: string) => {
		setContentId(id)
		setIsFormVisible(true)
	}

	const updateAvatar = trpc.user.updateAvatar.useMutation({
		onSuccess: async () => {
			toast.success('Avatar updated')
			await utils.user.getProfile.invalidate()
		},
		onError: () => toast.error('Failed to update avatar'),
	})

	useEffect(() => {
		if (profile?.image) {
			const raw = profile.image
			const url = raw.startsWith('http') ? raw : window.location.origin + raw
			setAvatar(url)
		}
	}, [profile?.image])

	const handleAvatarChange = useCallback(
		async (e: React.ChangeEvent<HTMLInputElement>) => {
			const file = e.target.files?.[0]
			if (!file) return
			const form = new FormData()
			form.append('avatar', file)
			const res = await fetch('/api/uploadAvatar', { method: 'POST', body: form })
			if (!res.ok) {
				toast.error('Upload failed')
				return
			}
			const { url } = await res.json()
			const fullUrl = window.location.origin + url
			setAvatar(fullUrl)
			await updateAvatar.mutateAsync({ avatarUrl: fullUrl })
		},
		[updateAvatar]
	)

	return (
		<>
			<div
				className={`top-0 left-0 transition-transform duration-500 ${
					isFormVisible ? '-translate-x-[450px]' : 'translate-x-0'
				}`}>
				<div>
					<Typography variant={'h4'}>Wastelander Profile</Typography>

					<Badge
						component={'label'}
						className='my-5 cursor-pointer'
						overlap='circular'
						anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
						badgeContent={<EditIcon className='mt-3 ml-3' fontSize={32} />}>
						<Avatar className='h-32 w-32 border-4 border-black bg-slate-200' src={avatar} />
						<VisuallyHiddenInput type='file' accept='image/*' onChange={handleAvatarChange}></VisuallyHiddenInput>
					</Badge>
					<div>
						<Typography variant='h5'>Modify Your Data</Typography>
						<div className='mt-6 flex flex-col items-center gap-3'>
							<Button
								onClick={() => handleOpenSettings('nickname')}
								className='md:w-1/2 w-3/4 justify-between  font-semibold'
								endIcon={<ArrowRight />}
								variant='outlined'>
								Nickname
							</Button>
							{provider !== 'google' && (
								<>
									<Button
										onClick={() => handleOpenSettings('email')}
										className='md:w-1/2 w-3/4 justify-between font-semibold'
										endIcon={<ArrowRight />}
										variant='outlined'>
										Email
									</Button>
									<Button
										onClick={() => handleOpenSettings('password')}
										className='md:w-1/2 w-3/4 justify-between font-semibold'
										endIcon={<ArrowRight />}
										variant='outlined'>
										Password
									</Button>
								</>
							)}

							<Button
								onClick={() => handleOpenSettings('address')}
								className='md:w-1/2 w-3/4 justify-between  font-semibold'
								endIcon={<ArrowRight />}
								variant='outlined'>
								Address
							</Button>
						</div>
						<Typography className='my-2 font-semibold' variant='body1'>
							or...
						</Typography>
						<Button
							onClick={() => setModalOpen(true)}
							className='md:w-1/2 w-3/4 justify-between font-semibold'
							startIcon={<Trash />}
							variant='contained'>
							Delete Account
						</Button>
					</div>
				</div>
			</div>
			<div
				className={`text-center absolute p-10 top-0 left-full w-full h-full transition-transform duration-500 ${
					isFormVisible ? '-translate-x-full' : 'translate-x-0'
				}`}>
				{renderForm(contentId, setIsFormVisible)}
			</div>
			<TransitionsModal open={modalOpen} handleClose={handleModalClose}>
				<DeleteAccountModal handleClose={handleModalClose} />
			</TransitionsModal>
		</>
	)
}

export default AccountSettings
