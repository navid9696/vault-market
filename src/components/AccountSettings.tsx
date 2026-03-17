import { Avatar, Badge, Button, Typography, styled } from '@mui/material'
import { ChangeEvent, Dispatch, SetStateAction, useCallback, useEffect, useState } from 'react'
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

const renderForm = (contentId: string | null, onBack: () => void): React.ReactNode => {
	const setIsDetailsVisible: Dispatch<SetStateAction<boolean>> = val => {
		const next = typeof val === 'function' ? val(true) : val
		if (!next) onBack()
	}
	switch (contentId) {
		case 'nickname':
			return <NicknameForm setIsDetailsVisible={setIsDetailsVisible} />
		case 'email':
			return <EmailForm setIsDetailsVisible={setIsDetailsVisible} />
		case 'password':
			return <PasswordForm setIsDetailsVisible={setIsDetailsVisible} />
		case 'address':
			return <AddressForm setIsDetailsVisible={setIsDetailsVisible} />
		default:
			return null
	}
}

const AccountSettings = () => {
	const [avatar, setAvatar] = useState<string>()
	const [isFormVisible, setIsFormVisible] = useState(false)
	const [contentId, setContentId] = useState<string | null>(null)
	const [modalOpen, setModalOpen] = useState(false)
	const [enterDir, setEnterDir] = useState<'right' | 'left' | null>(null)
	const utils = trpc.useUtils()
	const { data: profile } = trpc.user.getProfile.useQuery()
	const { data: session } = useSession()
	const provider = session?.user.provider

	const handleModalClose = () => {
		setModalOpen(false)
	}

	const handleOpenSettings = (id: string) => {
		setContentId(id)
		setEnterDir('right')
		setIsFormVisible(true)
	}

	const handleBack = useCallback(() => {
		setEnterDir('left')
		setIsFormVisible(false)
	}, [])

	const updateAvatar = trpc.user.updateAvatar.useMutation()

	const handleAvatarChange = useCallback(
		async (e: ChangeEvent<HTMLInputElement>) => {
			const file = e.target.files?.[0]
			if (!file) return
			if (!file.type.startsWith('image/')) {
				toast.error(
					<>
						⚠️ UNSUPPORTED DATA TYPE
						<br />
						ACCEPTED FORMAT: IMAGE FILES ONLY
					</>,
				)
				e.target.value = ''
				return
			}

			if (file.size > 5 * 1024 * 1024) {
				toast.error(
					<>
						⚠️ PAYLOAD LIMIT EXCEEDED
						<br />
						MAXIMUM TRANSMISSION SIZE: 5MB
					</>,
				)
				e.target.value = ''
				return
			}

			const form = new FormData()
			form.append('avatar', file)

			const toastId = toast.loading(
				<div>
					☢️ INITIALIZING UPLINK
					<br />
					TRANSMITTING AVATAR DATA...
				</div>,
			)

			try {
				const res = await fetch('/api/uploadAvatar', {
					method: 'POST',
					body: form,
				})

				if (!res.ok) {
					const data = await res.json().catch(() => null)
					throw new Error(data?.error ?? 'UPLOAD FAILED')
				}

				const { url } = await res.json()
				setAvatar(url)

				await updateAvatar.mutateAsync({ avatarUrl: url })
				await utils.user.getProfile.invalidate()

				toast.update(toastId, {
					render: (
						<div>
							☢️ AVATAR UPDATE CONFIRMED
							<br />
							VISUAL IDENTITY SYNCHRONIZED
						</div>
					),
					type: 'success',
					isLoading: false,
					autoClose: 1800,
				})
			} catch (err: any) {
				toast.update(toastId, {
					render: (
						<div>
							⚠️ TRANSMISSION ERROR
							<br />
							{typeof err?.message === 'string' ? err.message : 'UPLOAD FAILED'}
						</div>
					),
					type: 'error',
					isLoading: false,
					autoClose: 3000,
				})
			} finally {
				e.target.value = ''
			}
		},
		[updateAvatar, utils.user.getProfile],
	)

	useEffect(() => {
		if (profile?.image) {
			const raw = profile.image
			const url = raw.startsWith('http') ? raw : window.location.origin + raw
			setAvatar(url)
		}
	}, [profile?.image])

	return (
		<>
			<div className='overflow-hidden'>
				{!isFormVisible ? (
					<div className={`p-8 mt-2 ${enterDir === 'left' ? 'slide-in-left' : ''}`}>
						<Typography variant={'h4'}>Wastelander Profile</Typography>

						<Badge
							component={'label'}
							className='my-5 cursor-pointer'
							overlap='circular'
							anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
							badgeContent={<EditIcon className='text-2xl' fontSize={32} />}>
							<Avatar className='h-32 w-32 border-4 border-bg ' src={avatar} />
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
				) : (
					<div className={`text-center p-10 ${enterDir === 'right' ? 'slide-in-right' : ''}`}>
						{renderForm(contentId, handleBack)}
					</div>
				)}
			</div>
			<TransitionsModal open={modalOpen} handleClose={handleModalClose}>
				<DeleteAccountModal handleClose={handleModalClose} />
			</TransitionsModal>
		</>
	)
}

export default AccountSettings
