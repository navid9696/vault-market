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
			className={`mx-4 min-w-fit text-lg font-extrabold z-30 ${isActive && ' text-text'} `}
			variant='text'>
			{text}
		</Button>
	) : (
		<span className='relative z-20'>
			<span
				className={` mx-2 border-b-[3px] border-r-2 border-l-2 border-transparent ${
					isActive && 'border-l-border border-r-border border-b-bg border-solid'
				} `}>
				<Button
					disableElevation
					disableFocusRipple
					disableRipple
					onClick={onClick}
					sx={{
						margin: '0px -10px 19px',
						fontSize: '18px',
						fontWeight: 'bold',
						'&:hover': {
							backgroundColor: 'transparent',
							boxShadow: 'none',
						},
					}}
					className={`hover:text-primary before:mr-2 before:w-3 before:h-[2px] after:ml-2 after:w-3 after:h-[2px] ${
						isActive && 'before:bg-text after:bg-text text-text'
					} `}
					variant='text'>
					{text}
				</Button>
			</span>
		</span>
	)
}

export default CategoryBtn
