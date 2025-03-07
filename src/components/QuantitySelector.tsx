import { FormControl, IconButton, InputLabel, OutlinedInput } from '@mui/material'
import { useState } from 'react'
import { FaPlus as Plus } from 'react-icons/fa'
import { FaMinus as Minus } from 'react-icons/fa'
import useStore from '~/store/useStore'

const QuantitySelector = () => {
	const [selectedQuantity, setSelectedQuantity] = useState(1)
	const availability = useStore(state => state.product?.available) ?? 0

	const handleIncrement = () => {
		if (selectedQuantity < availability) {
			setSelectedQuantity(prev => prev + 1)
		}
	}

	const handleDecrement = () => {
		if (selectedQuantity > 1) {
			setSelectedQuantity(prev => prev - 1)
		}
	}

	return (
		<div className='flex sm:scale-100 scale-75'>
			<IconButton
				disabled={selectedQuantity <= 1}
				onClick={handleDecrement}
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
					inputProps={{
						min: '1',
						style: { WebkitTextFillColor: 'rgba(0, 0, 0, 1.0)', textAlign: 'center' },
					}}
				/>
			</FormControl>

			<IconButton
				onClick={handleIncrement}
				disabled={selectedQuantity >= availability}
				className='text-green-950 rounded-none rounded-tr-md rounded-br-md shadow-inset-1'>
				<Plus />
			</IconButton>
		</div>
	)
}

export default QuantitySelector
