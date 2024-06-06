import { FormControl, InputAdornment, InputLabel, OutlinedInput } from '@mui/material'
import React from 'react'
import { GiBottleCap } from 'react-icons/gi'

interface ExchangeInputProps {
	icon: React.ReactNode
}

const ExchangeInput: React.FC<ExchangeInputProps> = ({ icon }) => {
	return (
		<FormControl sx={{ m: 1, width: '35%' }}>
			<InputLabel htmlFor='outlined-adornment-amount'>Amount</InputLabel>
			<OutlinedInput
				id='outlined-adornment-amount'
				startAdornment={<InputAdornment position='start'>{icon}</InputAdornment>}
				label='Amount'
			/>
		</FormControl>
	)
}

export default ExchangeInput
