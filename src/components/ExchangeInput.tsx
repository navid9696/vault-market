import { ChangeEventHandler } from 'react'
import { FormControl, InputAdornment, InputBaseComponentProps, InputLabel, OutlinedInput } from '@mui/material'

interface ExchangeInputProps {
	icon: React.ReactNode
	inputProps?: InputBaseComponentProps
	onChange?: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>
	value?: number | string
}

const ExchangeInput = ({ icon, inputProps, onChange, value }: ExchangeInputProps) => {
	const handleChange: ChangeEventHandler<HTMLInputElement> = e => {
		const newValue = e.target.value
		if (newValue.length > 4) {
			e.preventDefault()
			return
		}
		if (onChange) {
			onChange(e)
		}
	}

	return (
		<FormControl sx={{ m: 1, width: '35%' }}>
			<InputLabel htmlFor='outlined-adornment-amount'>Amount</InputLabel>
			<OutlinedInput
				type='number'
				id='outlined-adornment-amount'
				startAdornment={<InputAdornment position='start'>{icon}</InputAdornment>}
				onChange={handleChange}
				label='Amount'
				value={value}
				onKeyDown={e => {
					if (['-', '+', '.', 'e'].includes(e.key)) {
						e.preventDefault()
					}
				}}
				inputProps={{ min: '0', max: '9999', ...inputProps }}
			/>
		</FormControl>
	)
}

export default ExchangeInput
