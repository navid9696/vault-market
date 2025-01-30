import { Autocomplete, CircularProgress, TextField } from '@mui/material'
import { useState } from 'react'
import { ProductCardProps } from './ProductCard'

export interface ProductSearchProps {
	products: ProductCardProps[]
	isLoading: boolean
	inputValue: string
	setInputValue: (value: string) => void
}

const ProductSearch = ({ products, isLoading, inputValue, setInputValue }: ProductSearchProps) => {
	const [open, setOpen] = useState(false)

	const handleOpenOptions = () => setOpen(true)
	const handleCloseOptions = () => setOpen(false)

	return (
		<Autocomplete
			sx={{ width: 300 }}
			open={open}
			onOpen={handleOpenOptions}
			onClose={handleCloseOptions}
			inputValue={inputValue}
			onInputChange={(e, newInputValue) => setInputValue(newInputValue)}
			options={products || []}
			isOptionEqualToValue={(option, value) => option.id === value.id}
			getOptionLabel={option => option.name}
			loading={isLoading}
			noOptionsText='No products found'
			renderInput={params => (
				<TextField
					{...params}
					label='Search Products'
					InputProps={{
						...params.InputProps,
						endAdornment: (
							<>
								{isLoading ? <CircularProgress color='inherit' size={20} /> : null}
								{params.InputProps.endAdornment}
							</>
						),
					}}
				/>
			)}
		/>
	)
}

export default ProductSearch
