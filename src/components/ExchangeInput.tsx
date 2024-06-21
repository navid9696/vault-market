import { ChangeEventHandler } from 'react'
import { FormControl, InputAdornment, InputLabel, OutlinedInput } from '@mui/material'

interface ExchangeInputProps {
	icon?: React.ReactNode
	inputProps?: { [key: string]: string | number | boolean | null }
	onChange?: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>
	value?: number | string
}

const ExchangeInput = ({ icon, inputProps, onChange, value }: ExchangeInputProps) => {
	return (
		<FormControl sx={{ m: 1, width: '35%' }}>
			<InputLabel htmlFor='outlined-adornment-amount'>Amount</InputLabel>
			<OutlinedInput
				type='number'
				id='outlined-adornment-amount'
				startAdornment={<InputAdornment position='start'>{icon}</InputAdornment>}
				onChange={onChange}
				label='Amount'
				value={value}
				onKeyDown={e => (e.key === '-' || e.key === '+' || e.key === '.' || e.key === 'e' ? e.preventDefault() : false)}
				inputProps={{ min: '0', ...inputProps }}
			/>
		</FormControl>
	)
}

export default ExchangeInput
