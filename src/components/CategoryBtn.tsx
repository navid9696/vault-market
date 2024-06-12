import { CategoryBtnProps } from '@/lib/types'
import { Button } from '@mui/material'

const CategoryBtn = ({ onClick, text, isActive }: CategoryBtnProps) => {
	return (
		<span
			className={`pb-3 ${
				isActive &&
				' border-l-green-500 border-r-green-500 border-b-zinc-950 border-b-2 border-r-2 border-l-2 rounded-t-xl border-solid'
			} `}>
			<Button
				onClick={onClick}
				className={`text-lg mx-1 inline font-extrabold z-20 ${isActive && 'text-green-500'} `}
				color='success'
				variant='text'>
				{text}
			</Button>
		</span>
	)
}

export default CategoryBtn
