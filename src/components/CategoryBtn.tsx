import { CategoryBtnProps } from '@/lib/types'
import { Button } from '@mui/material'

const CategoryBtn = ({ onClick, text, isActive }: CategoryBtnProps) => {
	return (
		<span className='border-b-2 border-b-green-500 border-solid'>
			<span
				className={`mx-3 border-b-2 border-r-2  border-l-2 border-transparent ${
					isActive && ' border-l-green-500 border-r-green-500 border-b-zinc-950  border-solid'
				} `}>
				<Button
					onClick={onClick}
					className={`before:w-3 before:h-[2px] after:w-3 after:h-[2px] -mx-[10px] mb-5 text-lg font-extrabold ${
						isActive && 'before:bg-green-500  after:bg-green-500 text-green-500'
					} `}
					color='success'
					variant='text'>
					{text}
				</Button>
			</span>
		</span>
	)
}

export default CategoryBtn
