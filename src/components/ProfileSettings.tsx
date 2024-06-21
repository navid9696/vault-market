import { Avatar, Badge, Button, Typography } from '@mui/material'
import { AiTwotoneEdit } from 'react-icons/ai'

const ProfileSettings = () => {
	return (
		<div className='text-center'>
      <Typography variant={'h4'}>Wastelander Profile</Typography>
			<Badge
      className='my-5'
				overlap='circular'
				anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
				badgeContent={<AiTwotoneEdit fontSize={48} />}>
				<Avatar className='h-48 w-48 border-4 bg-slate-200' alt='Remy Sharp' src='/imgs/logo.png' />
			</Badge>
			<div className='flex flex-col'>
        <Typography variant='h5' gutterBottom>Edit</Typography>
				<Button >Nickname</Button>
				<Button >Email</Button>
				<Button >Password</Button>
				<Button >Address</Button>
			</div>
		</div>
	)
}

export default ProfileSettings
