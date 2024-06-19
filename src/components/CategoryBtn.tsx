import { MouseEventHandler } from 'react'
import { Button } from '@mui/material'

interface CategoryBtnProps {
	text: string
	onClick?: MouseEventHandler<HTMLButtonElement> | (() => void)
	isActive?: boolean
	isSubCategory?: boolean
}

const CategoryBtn = ({ onClick, text, isActive, isSubCategory = false }: CategoryBtnProps) => {
	return isSubCategory ? (
		<Button
			onClick={onClick}
			className={`text-lg mx-3 font-extrabold ${isActive && ' text-green-500'} `}
			color='success'
			variant='text'>
			{text}
		</Button>
	) : (
		<span>
			<span className='border-b-2 border-b-green-500 border-solid'>
				<span
					className={`mx-2 border-b-2 border-r-2 border-l-2 border-transparent ${
						isActive && 'border-l-green-500 border-r-green-500 border-b-zinc-950 border-solid'
					} `}>
					<Button
						onClick={onClick}
						sx={{ margin: '0px -10px 20px', fontSize: '18px', fontWeight: 'bold' }}
						className={`before:w-3 before:h-[2px] after:w-3 after:h-[2px] ${
							isActive && 'before:bg-green-500 after:bg-green-500 text-green-500'
						} `}
						color='success'
						variant='text'>
						{text}
					</Button>
				</span>
			</span>
		</span>
	)
}

export default CategoryBtn
