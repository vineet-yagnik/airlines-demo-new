import { describe, it, expect } from 'vitest'
import { validators, validationSchemas } from './validation'

describe('Validation Utilities', () => {
  describe('Required Validator', () => {
    it('validates required fields correctly', () => {
      const result1 = validators.required('test')
      expect(result1.isValid).toBe(true)
      expect(result1.errors).toHaveLength(0)

      const result2 = validators.required('')
      expect(result2.isValid).toBe(false)
      expect(result2.errors).toHaveLength(1)

      const result3 = validators.required(null)
      expect(result3.isValid).toBe(false)
      expect(result3.errors).toHaveLength(1)
    })
  })

  describe('Pattern Validator', () => {
    it('validates airport codes correctly', () => {
      const result1 = validators.pattern('JFK', validationSchemas.airportCode.pattern, validationSchemas.airportCode.message)
      expect(result1.isValid).toBe(true)
      expect(result1.errors).toHaveLength(0)

      const result2 = validators.pattern('invalid', validationSchemas.airportCode.pattern, validationSchemas.airportCode.message)
      expect(result2.isValid).toBe(false)
      expect(result2.errors).toHaveLength(1)
    })

    it('validates email addresses correctly', () => {
      const result1 = validators.pattern('test@example.com', validationSchemas.email.pattern, validationSchemas.email.message)
      expect(result1.isValid).toBe(true)
      expect(result1.errors).toHaveLength(0)

      const result2 = validators.pattern('invalid-email', validationSchemas.email.pattern, validationSchemas.email.message)
      expect(result2.isValid).toBe(false)
      expect(result2.errors).toHaveLength(1)
    })
  })

  describe('Range Validator', () => {
    it('validates passenger counts correctly', () => {
      const result1 = validators.range(5, validationSchemas.passengers.min, validationSchemas.passengers.max, validationSchemas.passengers.message)
      expect(result1.isValid).toBe(true)
      expect(result1.errors).toHaveLength(0)

      const result2 = validators.range(0, validationSchemas.passengers.min, validationSchemas.passengers.max, validationSchemas.passengers.message)
      expect(result2.isValid).toBe(false)
      expect(result2.errors).toHaveLength(1)

      const result3 = validators.range(10, validationSchemas.passengers.min, validationSchemas.passengers.max, validationSchemas.passengers.message)
      expect(result3.isValid).toBe(false)
      expect(result3.errors).toHaveLength(1)
    })
  })

  describe('Validation Schemas', () => {
    it('contains expected schemas', () => {
      expect(validationSchemas.airportCode).toBeDefined()
      expect(validationSchemas.email).toBeDefined()
      expect(validationSchemas.phone).toBeDefined()
      expect(validationSchemas.flightNumber).toBeDefined()
      expect(validationSchemas.passengers).toBeDefined()
    })

    it('has correct patterns', () => {
      expect(validationSchemas.airportCode.pattern.test('JFK')).toBe(true)
      expect(validationSchemas.airportCode.pattern.test('invalid')).toBe(false)
      
      expect(validationSchemas.email.pattern.test('test@example.com')).toBe(true)
      expect(validationSchemas.email.pattern.test('invalid')).toBe(false)
    })
  })
})