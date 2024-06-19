import { ChangeEventHandler } from 'react'
import { FormControl, InputAdornment, InputLabel, OutlinedInput } from '@mui/material'

interface ExchangeInputProps {
	icon: React.ReactNode
	inputProp?: { [key: string]: string | number | boolean | null }
	onChange?: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>
}

const ExchangeInput = ({ icon, inputProp, onChange }: ExchangeInputProps) => {
	return (
		<FormControl sx={{ m: 1, width: '35%' }}>
			<InputLabel htmlFor='outlined-adornment-amount'>Amount</InputLabel>
			<OutlinedInput
				type='number'
				id='outlined-adornment-amount'
				startAdornment={<InputAdornment position='start'>{icon}</InputAdornment>}
				onChange={onChange}
				label='Amount'
				onKeyDown={e => (e.key === '-' || e.key === '+' || e.key === '.' ? e.preventDefault() : false)}
				inputProps={{ min: '0', ...inputProp }}
			/>
		</FormControl>
	)
}

export default ExchangeInput
