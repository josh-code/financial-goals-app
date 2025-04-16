import { calculateSIP, calculateFutureValue, recalculateSIPAfterLumpsum, calculateProgress, formatCurrency } from '@/utils/financial-calculations';

describe('Financial Calculations', () => {
  describe('calculateSIP', () => {
    it('should calculate correct monthly SIP without annual increase', () => {
      const params = {
        goalAmount: 1000000,
        timeline: 5,
        returnRate: 12,
        sipIncrease: 0,
        initialLumpsum: 0,
      };

      const result = calculateSIP(params);
      expect(result.monthlyAmount).toBeGreaterThan(0);
      expect(result.yearlyBreakdown).toHaveLength(5);
      expect(result.yearlyBreakdown[0].year).toBe(1);
      expect(result.yearlyBreakdown[4].expectedValue).toBeCloseTo(1000000, -4);
    });

    it('should account for initial lumpsum', () => {
      const params = {
        goalAmount: 1000000,
        timeline: 5,
        returnRate: 12,
        sipIncrease: 0,
        initialLumpsum: 200000,
      };

      const result = calculateSIP(params);
      expect(result.monthlyAmount).toBeLessThan(
        calculateSIP({ ...params, initialLumpsum: 0 }).monthlyAmount
      );
    });

    it('should handle annual SIP increases', () => {
      const params = {
        goalAmount: 1000000,
        timeline: 5,
        returnRate: 12,
        sipIncrease: 10,
        initialLumpsum: 0,
      };

      const result = calculateSIP(params);
      const firstYearSIP = result.yearlyBreakdown[0].sipAmount;
      const secondYearSIP = result.yearlyBreakdown[1].sipAmount;
      expect(secondYearSIP).toBeCloseTo(firstYearSIP * 1.1, 0);
    });

    it('should reach goal amount with annual increases', () => {
      const params = {
        goalAmount: 1000000,
        timeline: 5,
        returnRate: 12,
        sipIncrease: 10,
        initialLumpsum: 100000,
      };

      const result = calculateSIP(params);
      const finalValue = result.yearlyBreakdown[4].expectedValue;
      expect(finalValue).toBeCloseTo(1000000, -4);
    });
  });

  describe('calculateProgress', () => {
    it('should calculate correct percentage', () => {
      expect(calculateProgress(50000, 100000)).toBe(50);
      expect(calculateProgress(75000, 100000)).toBe(75);
      expect(calculateProgress(100000, 100000)).toBe(100);
    });

    it('should cap progress at 100%', () => {
      expect(calculateProgress(150000, 100000)).toBe(100);
    });

    it('should handle zero target amount', () => {
      expect(calculateProgress(50000, 0)).toBe(100);
    });
  });

  describe('formatCurrency', () => {
    it('should format currency in Indian format', () => {
      expect(formatCurrency(1000)).toBe('₹1,000');
      expect(formatCurrency(100000)).toBe('₹1,00,000');
      expect(formatCurrency(1000000)).toBe('₹10,00,000');
    });

    it('should not show decimal places', () => {
      expect(formatCurrency(1000.50)).toBe('₹1,000');
    });
  });

  describe('calculateFutureValue', () => {
    test('should calculate future value with compound interest', () => {
      const params = {
        principal: 100000,
        monthlyInvestment: 10000,
        years: 5,
        returnRate: 12,
        sipIncrease: 10
      };

      const result = calculateFutureValue(params);
      expect(result).toBeDefined();
      expect(typeof result.futureValue).toBe('number');
      expect(result.futureValue).toBeGreaterThan(params.principal);
    });
  });

  describe('recalculateSIPAfterLumpsum', () => {
    test('should reduce monthly SIP after lumpsum addition', () => {
      const currentPlan = {
        goalAmount: 1000000,
        timeline: 5,
        returnRate: 12,
        sipIncrease: 10,
        currentSIP: 12000,
        accumulatedAmount: 200000
      };

      const lumpsumAmount = 100000;

      const result = recalculateSIPAfterLumpsum(currentPlan, lumpsumAmount);
      expect(result.newSIPAmount).toBeLessThan(currentPlan.currentSIP);
    });
  });
}); 