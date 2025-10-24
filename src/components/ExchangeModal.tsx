import { Button, Divider, Typography, CircularProgress } from '@mui/material'
import { FaEquals as Equals } from 'react-icons/fa'
import { GiBottleCap as Caps } from 'react-icons/gi'
import ExchangeInput from './ExchangeInput'
import Image from 'next/image'
import { useState, type ChangeEvent } from 'react'
import { trpc } from '~/server/client'
import { toast } from 'react-toastify'

interface ExchangeModalProps {
	onClose: () => void
	onSuccess?: () => void
}

const rate = 0.05
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

const ExchangeModal = ({ onClose }: ExchangeModalProps) => {
	const [capsAmount, setCapsAmount] = useState<number | string>('')
	const [usdValue, setUsdValue] = useState<number | string>('')
	const utils = trpc.useUtils()

	const createOrderMutation = trpc.exchange.createCapsOrder.useMutation()
	const isPending = createOrderMutation.status === 'pending'
	const isReady = capsAmount !== '' && Number(capsAmount) > 0

	const handleCapsChange = (e: ChangeEvent<HTMLInputElement>) => {
		const raw = e.target.value
		if (raw === '') {
			setCapsAmount('')
			setUsdValue('')
			return
		}
		const value = Number(raw)
		if (Number.isFinite(value)) {
			setCapsAmount(value)
			setUsdValue((value * rate).toFixed(2))
		}
	}

	const handleBuy = async () => {
		const quantity = Number(capsAmount)
		const usd = Number(usdValue)
		if (!quantity || quantity <= 0) {
			toast.error(
				<div>
					⚠️ INVALID INPUT
					<br />
					ENTER A POSITIVE AMOUNT
				</div>
			)
			return
		}

		const toastId = toast.loading(
			<div>
				☢️ INITIALIZING SECURE UPLINK
				<br />
				CONTACTING VAULT-TEC MAINFRAME...
			</div>
		)

		try {
			await createOrderMutation.mutateAsync({ quantity, usd })
			toast.update(toastId, {
				render: (
					<div>
						☢️ EXCHANGE APPROVED
						<br />
						CREDIT: {quantity} CAPS
						<br />
						DEBIT: ${usd.toFixed(2)}
						<br />
						STATUS: CONFIRMED
					</div>
				),
				type: 'success',
				isLoading: false,
				autoClose: 2000,
			})
			await sleep(2000)
			await utils.exchange.getCapsBalance.invalidate()
			setCapsAmount('')
			setUsdValue('')
			onClose()
		} catch (err: any) {
			const msg = typeof err?.message === 'string' && err.message.trim() ? err.message : 'TRANSACTION FAILED'
			toast.update(toastId, {
				render: (
					<div>
						⚠️ OPERATION ERROR
						<br />
						{msg}
					</div>
				),
				type: 'error',
				isLoading: false,
				autoClose: 2000,
			})
		}
	}

	return (
		<>
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
					{rate.toFixed(2)}$
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
				disabled={!isReady || isPending}
				variant='contained'
				size='large'
				className='mt-5 font-extrabold'
				endIcon={isPending ? <CircularProgress size={20} /> : <Caps />}
				sx={{
					'&.Mui-disabled': {
						opacity: 0.9,
						backgroundColor: 'primary.main',
						color: 'primary.contrastText',
					},
				}}>
				{isPending ? 'Processing...' : 'BUY'}
			</Button>
		</>
	)
}

export default ExchangeModal
