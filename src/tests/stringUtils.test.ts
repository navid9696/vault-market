import { describe, it, expect } from 'vitest'
import { StringUtils } from '../lib/StringUtils'

describe('StringUtils', () => {
	it('reverse() returns reversed string', () => {
		expect(StringUtils.reverse('Vault')).toBe('tluaV')
		expect(StringUtils.reverse('ąę')).toBe('ęą')
	})

	it('reverse() throws on null', () => {
		expect(() => StringUtils.reverse(null as unknown as string)).toThrow('IllegalArgumentException')
	})

	it('isPalindrome() detects palindromes correctly', () => {
		expect(StringUtils.isPalindrome('level')).toBe(true)
		expect(StringUtils.isPalindrome('Vault')).toBe(false)
		expect(StringUtils.isPalindrome('KayAk')).toBe(true)
	})

	it('isPalindrome() throws on null', () => {
		expect(() => StringUtils.isPalindrome(null as unknown as string)).toThrow('IllegalArgumentException')
	})

	it('toUpperCase() converts to uppercase', () => {
		expect(StringUtils.toUpperCase('vault')).toBe('VAULT')
	})

	it('concat() joins two strings', () => {
		expect(StringUtils.concat('Vault', 'Market')).toBe('VaultMarket')
	})
})
