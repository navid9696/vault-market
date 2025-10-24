export class StringUtils {
	static reverse = (input: string): string => {
		if (input == null) throw new Error('IllegalArgumentException')
		return [...input].reverse().join('')
	}

	static isPalindrome = (input: string): boolean => {
		if (input == null) throw new Error('IllegalArgumentException')
		const s = input.toLowerCase()
		return s === [...s].reverse().join('')
	}

	static toUpperCase = (input: string): string => input.toUpperCase()

	static concat = (str1: string, str2: string): string => str1 + str2
}
