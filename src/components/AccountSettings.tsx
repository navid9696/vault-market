import { Avatar, Badge, Button, Typography, styled } from '@mui/material'
import { useCallback, useState } from 'react'
import { AiTwotoneEdit as EditIcon } from 'react-icons/ai'
import { FaLongArrowAltRight as ArrowRight } from 'react-icons/fa'
import NicknameForm from './NicknameForm'
// import PasswordForm from './PasswordForm'
// import EmailForm from './EmailForm'
// import AddressForm from './AddressForm'

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

const AccountSettings = () => {
	const [file, setFile] = useState<string | undefined>(undefined)
	const [isFormVisible, setIsFormVisible] = useState(false)
	const [contentId, setContentId] = useState<string | null>(null)

	const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files) {
			const file = e.target.files[0]
			setFile(URL.createObjectURL(file))
		}
	}

	const handleOpenSettings = useCallback((id: string) => {
		setContentId(id)
		setIsFormVisible(true)
	}, [])

	const renderForm = () => {
		switch (contentId) {
			case 'nickname':
				return <NicknameForm setIsDetailsVisible={setIsFormVisible} />
			case 'email':
				return
			case 'password':
				return
			case 'address':
				return
			default:
				return null
		}
	}

	return (
		<>
			<div
				className={`top-0 left-0 transition-transform duration-500 ${
					isFormVisible ? '-translate-x-[450px]' : 'translate-x-0'
				}`}>
				<div className='text-center'>
					<Typography variant={'h4'}>Wastelander Profile</Typography>

					<Badge
						component={'label'}
						className='my-5 cursor-pointer'
						overlap='circular'
						anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
						badgeContent={<EditIcon className='mt-3 ml-3' fontSize={32} />}>
						<Avatar className='h-36 w-36 border-4 border-black bg-slate-200' alt='Remy Sharp' src={file} />
						<VisuallyHiddenInput type='file' accept='image/*' onChange={handleAvatarChange}></VisuallyHiddenInput>
					</Badge>
					<div>
						<Typography variant='h5' gutterBottom>
							Modify Your Data
						</Typography>
						<div className='mt-6 flex flex-col items-center gap-5'>
							<Button
								size='large'
								onClick={() => handleOpenSettings('nickname')}
								className='md:w-1/2 w-3/4 justify-between  font-semibold'
								endIcon={<ArrowRight />}
								variant='outlined'>
								Nickname
							</Button>
							<Button
								size='large'
								onClick={() => handleOpenSettings('email')}
								className='md:w-1/2 w-3/4 justify-between  font-semibold'
								endIcon={<ArrowRight />}
								variant='outlined'>
								Email
							</Button>
							<Button
								size='large'
								onClick={() => handleOpenSettings('password')}
								className='md:w-1/2 w-3/4 justify-between  font-semibold'
								endIcon={<ArrowRight />}
								variant='outlined'>
								Password
							</Button>
							<Button
								size='large'
								onClick={() => handleOpenSettings('address')}
								className='md:w-1/2 w-3/4 justify-between  font-semibold'
								endIcon={<ArrowRight />}
								variant='outlined'>
								Address
							</Button>
						</div>
					</div>
				</div>
			</div>
			<div
				className={`text-center absolute p-10 top-0 left-full w-full h-full transition-transform duration-500 ${
					isFormVisible ? '-translate-x-full' : 'translate-x-0'
				}`}>
				{renderForm()}
			</div>
		</>
	)
}

export default AccountSettings
