import { Button, Divider, Typography } from '@mui/material'
import { FaEquals as Equals } from 'react-icons/fa'
import { GiBottleCap as Caps } from 'react-icons/gi'
import ExchangeInput from './ExchangeInput'
import Image from 'next/image'
import { ChangeEvent, useState } from 'react'
import { trpc } from '~/server/client'

const ExchangeModal = () => {
	const [capsAmount, setCapsAmount] = useState<number | string>('')
	const [usdValue, setUsdValue] = useState<number | string>('')
	const utils = trpc.useUtils()

	const createOrderMutation = trpc.exchange.createCapsOrder.useMutation({
		onSuccess: () => {
			setCapsAmount('')
			setUsdValue('')
			utils.exchange.getTotalCaps.invalidate()
		},
		onError: (error: unknown) => {
			console.error('Error creating order:', error)
		},
	})

	const handleCapsChange = (e: ChangeEvent<HTMLInputElement>) => {
		const value = parseFloat(e.target.value)
		if (!isNaN(value)) {
			setCapsAmount(value)
			setUsdValue(parseFloat((value * 0.05).toFixed(2)))
		} else {
			setCapsAmount('')
			setUsdValue('')
		}
	}

	const handleBuy = () => {
		if (capsAmount === '' || isNaN(Number(capsAmount))) {
			console.error('Invalid caps amount')
			return
		}
		createOrderMutation.mutate({ quantity: Number(capsAmount), usd: Number(usdValue) })
	}

	return (
		<div className='text-center'>
			<Typography component='h3' variant='h3' gutterBottom>
				Caps&Cash Exchange
			</Typography>
			<Typography component='h4' variant='h6' gutterBottom>
				How many caps are you looking to acquire?
			</Typography>
			<div className='flex items-center justify-between'>
				<Typography className='m-auto' paragraph variant='h4'>
					Caps
				</Typography>
				<ExchangeInput onChange={handleCapsChange} icon={<Caps />} inputProps={{ required: true }} value={capsAmount} />
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
				<ExchangeInput icon={'$'} value={usdValue} inputProps={{ readOnly: true }} />
			</div>
			<Button
				onClick={handleBuy}
				className='mt-5 font-extrabold text-green-500 hover:bg-[#13FF17] hover:text-slate-950'
				size='large'
				endIcon={<Caps />}>
				BUY
			</Button>
		</div>
	)
}

export default ExchangeModal
