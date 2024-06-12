import { ExchangeInputProps } from '@/lib/types'
import { FormControl, InputAdornment, InputLabel, OutlinedInput } from '@mui/material'

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
