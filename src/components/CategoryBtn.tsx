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
			disableRipple
			onClick={onClick}
			className={`mx-4 min-w-fit text-lg font-extrabold z-30 ${isActive && ' text-green-500'} `}
			color='success'
			variant='text'>
			{text}
		</Button>
	) : (
		<span className='relative z-20'>
			<span className='border-b-2 border-b-green-500 border-solid'>
				<span
					className={`mx-2 border-b-[3px] border-r-2 border-l-2 border-transparent ${
						isActive && 'border-l-green-500 border-r-green-500 border-b-zinc-900 border-solid'
					} `}>
					<Button
						disableRipple
						onClick={onClick}
						sx={{ margin: '0px -10px 19px', fontSize: '18px', fontWeight: 'bold' }}
						className={` before:mr-2 before:w-3 before:h-[2px] after:ml-2 after:w-3 after:h-[2px] ${
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
