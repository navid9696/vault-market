import { describe, it, expect } from 'vitest'
import { slugify } from '../lib/slugify'

describe('slugify', () => {
	it('creates slug from ascii words', () => {
		expect(slugify('Vault Market Bottle')).toBe('vault-market-bottle')
	})

	it('removes diacritics', () => {
		expect(slugify('Półka Łąka Żółć ĄĘćńóśźż')).toBe('polka-laka-zolc-aecnoszz')
	})

	it('collapses separators and trims edges', () => {
		expect(slugify('  Vault___Market---Pro  ')).toBe('vault-market-pro')
		expect(slugify('--Vault   Market--')).toBe('vault-market')
	})

	it('preserves numbers and order', () => {
		expect(slugify('Model X 2025 Limited')).toBe('model-x-2025-limited')
	})

	it('handles emoji and symbols', () => {
		expect(slugify('⭐ Best 🔥 Deal !!!')).toBe('best-deal')
	})

	it('is idempotent for already-slugged input', () => {
		expect(slugify('vault-market-bottle')).toBe('vault-market-bottle')
	})

	it('returns empty string for only symbols/spaces', () => {
		expect(slugify('---___   !!')).toBe('')
		expect(slugify('   ')).toBe('')
	})

	it('throws on null or undefined', () => {
		expect(() => slugify(null as unknown as string)).toThrow('InvalidInput')
		expect(() => slugify(undefined as unknown as string)).toThrow('InvalidInput')
	})
})
