import { Avatar, Badge, Button, Typography } from '@mui/material'
import { AiTwotoneEdit as EditIcon } from 'react-icons/ai'
import { FaLongArrowAltRight as ArrowRight } from 'react-icons/fa'

const ProfileSettings = () => {
	return (
		<div className='text-center'>
			<Typography variant={'h4'}>Wastelander Profile</Typography>
			<Badge
				className='my-5'
				overlap='circular'
				anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
				badgeContent={<EditIcon fontSize={48} />}>
				<Avatar className='h-48 w-48 border-4 bg-slate-200' alt='Remy Sharp' src='/imgs/logo.png' />
			</Badge>
			<div className='flex flex-col'>
				<Typography variant='h5' gutterBottom>
					Modify Your Data
				</Typography>
				<Button className='my-1' endIcon={<ArrowRight />} variant='outlined'>
					Nickname
				</Button>
				<Button className='my-1' endIcon={<ArrowRight />} variant='outlined'>
					Email
				</Button>
				<Button className='my-1' endIcon={<ArrowRight />} variant='outlined'>
					Password
				</Button>
				<Button className='my-1' endIcon={<ArrowRight />} variant='outlined'>
					Address
				</Button>
			</div>
		</div>
	)
}

export default ProfileSettings
