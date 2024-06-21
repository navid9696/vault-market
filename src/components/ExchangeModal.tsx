import { Button, Divider, Typography } from '@mui/material'
import { FaEquals as Equals } from 'react-icons/fa'
import { GiBottleCap } from 'react-icons/gi'
import ExchangeInput from './ExchangeInput'
import Image from 'next/image'
import { ChangeEvent, useState } from 'react'

const ExchangeModal = () => {
	const [inputValue, setInputValue] = useState<number | string>('')

	const convertCurrency = (e: ChangeEvent<HTMLInputElement>) => {
		const value = parseFloat(e.target.value)
		if (!isNaN(value)) {
			setInputValue(parseFloat((value * 0.05).toFixed(2)))
		} else {
			setInputValue('')
		}
	}

	return (
		<div className='text-center'>
			<Typography component={'h3'} variant='h3' gutterBottom>
				Caps&Cash Exchange
			</Typography>
			<Typography component={'h4'} variant='h6' gutterBottom>
				How many caps are you looking to acquire?
			</Typography>
			<div className='flex items-center justify-between'>
				<Typography className='m-auto' paragraph variant='h4'>
					Caps
				</Typography>
				<ExchangeInput onChange={convertCurrency} icon={<GiBottleCap />} inputProps={{ required: true }} />
			</div>
			<div>
				<Typography className='flex items-center justify-center' paragraph variant='body1' gutterBottom>
					<Image
						className='mr-1'
						src={'/icons/nuka-cap-alt.png'}
						width={15}
						height={15}
						alt='nuka cola bottle cap'
						loading='lazy'
					/>
					1
				</Typography>
				<Divider className='my-4'>
					<Equals className='rotate-90 scale-150' />
				</Divider>
				<Typography paragraph variant='body1'>
					0.05$
				</Typography>
			</div>
			<div className='flex items-center justify-between'>
				<Typography className='m-auto' paragraph variant='h4'>
					$USD
				</Typography>
				<ExchangeInput icon={'$'} value={inputValue} inputProps={{ readOnly: true }} />
			</div>
			{/* add integration with database */}
			<Button className='mt-5 font-extrabold' variant='outlined' size='large' endIcon={<GiBottleCap />}>
				BUY
			</Button>
		</div>
	)
}

export default ExchangeModal
