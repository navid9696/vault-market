import { FormControl, IconButton, InputLabel, OutlinedInput, styled } from '@mui/material'
import { useState } from 'react'
import { FaPlus as Plus } from 'react-icons/fa'
import { FaMinus as Minus } from 'react-icons/fa'

const QuantitySelector = () => {
	const [productQuantity, setProductQuantity] = useState(1)

	const handleIncrement = () => {
		productQuantity >= 1 && setProductQuantity(prevQuantity => prevQuantity + 1)
	}

	const handleDecrement = () => {
		productQuantity > 1 && setProductQuantity(prevQuantity => prevQuantity - 1)
	}

	return (
		<div className='flex  '>
			<IconButton
				disabled={productQuantity <= 1}
				onClick={handleDecrement}
				className='text-green-950 rounded-none rounded-tl-md rounded-bl-md shadow-inset-1'>
				<Minus />
			</IconButton>

			<FormControl className='w-16 ' size='small'>
				<InputLabel className='font-semibold' htmlFor='i-adornment-amount'>
					Amount
				</InputLabel>
				<OutlinedInput
					className='rounded-none hover:border-red-400 font-semibold'
					value={productQuantity}
					id='input-adornment-amount'
					type='number'
					readOnly
					disabled
					label='Amount'
					inputProps={{
						min: '1',
						disabledunderline: 'true',
						style: { WebkitTextFillColor: 'rgba(0, 0, 0, 1.0)', textAlign: 'center' },
					}}
				/>
			</FormControl>

			<IconButton
				onClick={handleIncrement}
				className='text-green-950 rounded-none rounded-tr-md rounded-br-md   shadow-inset-1'>
				<Plus />
			</IconButton>
		</div>
	)
}

export default QuantitySelector
