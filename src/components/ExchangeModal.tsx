import { Button, Divider, Typography } from '@mui/material'
import React from 'react'
import { FaEquals as Equals } from 'react-icons/fa'
import { GiBottleCap } from 'react-icons/gi'
import ExchangeInput from './ExchangeInput'

const ExchangeModal = () => {
	return (
		<div className='text-center'>
			<Typography component={'h3'} variant='h3' gutterBottom>
				Caps&Cash Exchange
			</Typography>
			<Typography component={'h4'} variant='h5' gutterBottom>
				How many caps are you looking to acquire?
			</Typography>
			<div className='flex items-center justify-between'>
				<Typography className='mx-auto' paragraph variant='h4' gutterBottom>
					Caps
				</Typography>
				<ExchangeInput icon={<GiBottleCap />} />
			</div>
			<Divider className='my-4'>
				<Equals className='rotate-90 scale-125' />
			</Divider>

			<div className='flex items-center justify-between'>
				<Typography className='mx-auto' paragraph variant='h4' gutterBottom>
					$USD
				</Typography>
				<ExchangeInput icon={'$'} />
			</div>
			<Button className='mt-5 font-extrabold' variant='outlined' size='large' endIcon={<GiBottleCap />}>
				BUY
			</Button>
		</div>
	)
}

export default ExchangeModal
