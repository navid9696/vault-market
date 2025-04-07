import { FormControl, IconButton, InputLabel, OutlinedInput } from '@mui/material'
import { FaPlus as Plus } from 'react-icons/fa'
import { FaMinus as Minus } from 'react-icons/fa'

interface QuantitySelectorProps {
	selectedQuantity: number
	setSelectedQuantity: (value: number) => void
	availability: number
	strictLimit?: boolean
}

const QuantitySelector = ({
	strictLimit,
	selectedQuantity,
	setSelectedQuantity,
	availability,
}: QuantitySelectorProps) => {
	const handleChange = (step: number) => {
		const newQuantity = selectedQuantity + step
		setSelectedQuantity(newQuantity)
	}

	return (
		<div className='flex'>
			<IconButton
				disabled={selectedQuantity <= 1}
				onClick={() => handleChange(-1)}
				className='text-green-950 rounded-none rounded-tl-md rounded-bl-md shadow-inset-1'>
				<Minus />
			</IconButton>

			<FormControl className='w-16' size='small'>
				<InputLabel className='font-semibold' htmlFor='input-adornment-amount'>
					Amount
				</InputLabel>
				<OutlinedInput
					className='rounded-none hover:border-red-400 font-semibold'
					value={selectedQuantity}
					id='input-adornment-amount'
					type='number'
					readOnly
					disabled
					label='Amount'
					inputProps={{ min: '1', style: { WebkitTextFillColor: 'rgba(0, 0, 0, 1.0)', textAlign: 'center' } }}
				/>
			</FormControl>
			<IconButton
				onClick={() => handleChange(+1)}
				disabled={strictLimit ? selectedQuantity >= availability : availability <= 0}
				className='text-green-950 rounded-none rounded-tr-md rounded-br-md shadow-inset-1'>
				<Plus />
			</IconButton>
		</div>
	)
}

export default QuantitySelector
