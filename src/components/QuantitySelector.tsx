import { FormControl, IconButton, InputLabel, OutlinedInput, styled } from '@mui/material'
import { FaPlus as Plus } from 'react-icons/fa'
import { FaMinus as Minus } from 'react-icons/fa'

interface QuantitySelectorProps {
	selectedQuantity: number
	setSelectedQuantity: (value: number) => void
	availability: number
	strictLimit?: boolean
}

const BorderedIconButton = styled(IconButton)(({ theme }) => ({
	border: '1px solid var(--border)',
	color: 'var(--secondary)',
	padding: theme.spacing(0.5),
	'&.Mui-disabled': {
		opacity: 1,
		color: 'gray',
		borderColor: 'var(--border)',
	},
}))

const StyledOutlinedInput = styled(OutlinedInput)(({ theme }) => ({
	'& .MuiOutlinedInput-notchedOutline': {
		border: '1px solid var(--focus) !important',
	},

	'&.Mui-focused, &:hover, &:focus-visible': {
		boxShadow: 'none !important',
	},

	'&:hover .MuiOutlinedInput-notchedOutline, &.Mui-focused .MuiOutlinedInput-notchedOutline': {
		border: '1px solid var(--focus) !important',
	},

	backgroundColor: 'var(--surface) !important',
	'&:hover, &.Mui-focused': {
		backgroundColor: 'var(--surface) !important',
	},
	'& .MuiOutlinedInput-input': {
		textAlign: 'center',
	},
	'&.Mui-disabled .MuiOutlinedInput-input': {
		opacity: 1,
	},
}))

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
			<BorderedIconButton
				disabled={selectedQuantity <= 1}
				onClick={() => handleChange(-1)}
				sx={{
					borderTopRightRadius: 0,
					borderBottomRightRadius: 0,
				}}>
				<Minus />
			</BorderedIconButton>

			<FormControl className='w-16' size='small'>
				<InputLabel className='font-semibold' htmlFor='input-adornment-amount'>
					Amount
				</InputLabel>
				<StyledOutlinedInput
					className='rounded-none font-semibold'
					value={selectedQuantity}
					id='input-adornment-amount'
					type='number'
					readOnly
					label='Amount'
					inputProps={{ min: '1' }}
				/>
			</FormControl>

			<BorderedIconButton
				onClick={() => handleChange(+1)}
				disabled={strictLimit ? selectedQuantity >= availability : availability <= 0}
				sx={{
					borderTopLeftRadius: 0,
					borderBottomLeftRadius: 0,
				}}>
				<Plus />
			</BorderedIconButton>
		</div>
	)
}

export default QuantitySelector
