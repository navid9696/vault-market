import { useCallback, useReducer } from 'react'
import { ProductCardProps } from '~/components/ProductCard'
import { initialState, productsReducer } from '~/reducers/productsReducer'

const useProducts = () => {
	const [state, dispatch] = useReducer(productsReducer, initialState)

	const updateProducts = useCallback((products: ProductCardProps[]) => {
		dispatch({ type: 'SET_PRODUCTS', payload: products })
	}, [])

	const updateSearchTerm = useCallback((term: string) => {
		dispatch({ type: 'SET_SEARCH_TERM', payload: term })
	}, [])

	const updateFilteredProducts = useCallback((filtered: ProductCardProps[]) => {
		dispatch({ type: 'SET_FILTERED_PRODUCTS', payload: filtered })
	}, [])

	return {
		products: state.products,
		searchTerm: state.searchTerm,
		filteredProducts: state.filteredProducts,
		updateProducts,
		updateSearchTerm,
		updateFilteredProducts,
	}
}

export default useProducts
