interface SIPParams {
  goalAmount: number;
  timeline: number;
  returnRate: number;
  sipIncrease: number;
  initialLumpsum: number;
}

interface SIPResult {
  monthlyAmount: number;
  yearlyBreakdown: {
    year: number;
    sipAmount: number;
    totalInvestment: number;
    expectedValue: number;
  }[];
}

interface FutureValueParams {
  principal: number;
  monthlyInvestment: number;
  years: number;
  returnRate: number;
  sipIncrease: number;
}

interface CurrentPlan {
  goalAmount: number;
  timeline: number;
  returnRate: number;
  sipIncrease: number;
  currentSIP: number;
  accumulatedAmount: number;
}

export function calculateSIP(params: SIPParams): SIPResult {
  const {
    goalAmount,
    timeline,
    returnRate,
    sipIncrease,
    initialLumpsum = 0,
  } = params;

  const monthlyRate = Number((returnRate / 12 / 100).toFixed(6));
  const totalMonths = timeline * 12;
  
  // Calculate future value needed after accounting for initial lumpsum
  const lumpsumFutureValue = Number((initialLumpsum * Math.pow(1 + returnRate / 100, timeline)).toFixed(2));
  const remainingGoalAmount = Number(Math.max(0, goalAmount - lumpsumFutureValue).toFixed(2));

  // Calculate base monthly SIP without annual increase
  let baseSipAmount = remainingGoalAmount === 0 ? 0 : 
    Number((
      (remainingGoalAmount * monthlyRate) / 
      (Math.pow(1 + monthlyRate, totalMonths) - 1)
    ).toFixed(2));

  // Adjust for annual SIP increase
  if (sipIncrease > 0 && baseSipAmount > 0) {
    let totalValue = initialLumpsum;
    let currentSip = baseSipAmount;
    const yearlyBreakdown: SIPResult['yearlyBreakdown'] = [];

    // First pass to calculate initial breakdown
    for (let year = 1; year <= timeline; year++) {
      const yearlyInvestment = Number((currentSip * 12).toFixed(2));
      let yearEndValue = Number((totalValue * (1 + returnRate / 100)).toFixed(2));
      
      // Calculate monthly growth
      const monthlyGrowthFactor = 1 + monthlyRate;
      let sipGrowth = 0;
      for (let month = 0; month < 12; month++) {
        sipGrowth += Math.pow(monthlyGrowthFactor, 11 - month);
      }
      yearEndValue = Number((yearEndValue + currentSip * sipGrowth).toFixed(2));

      yearlyBreakdown.push({
        year,
        sipAmount: Number(currentSip.toFixed(2)),
        totalInvestment: Number((yearlyInvestment + (year === 1 ? initialLumpsum : 0)).toFixed(2)),
        expectedValue: yearEndValue,
      });

      totalValue = yearEndValue;
      currentSip = Number((currentSip * (1 + sipIncrease / 100)).toFixed(2));
    }

    // Calculate adjustment factor with higher precision
    const finalValue = yearlyBreakdown[yearlyBreakdown.length - 1].expectedValue;
    const adjustmentFactor = goalAmount / finalValue;
    baseSipAmount = Number((baseSipAmount * adjustmentFactor).toFixed(2));

    // Recalculate with adjusted base SIP
    totalValue = initialLumpsum;
    currentSip = baseSipAmount;
    
    for (let i = 0; i < yearlyBreakdown.length; i++) {
      const yearlyInvestment = Number((currentSip * 12).toFixed(2));
      let yearEndValue = Number((totalValue * (1 + returnRate / 100)).toFixed(2));
      
      const monthlyGrowthFactor = 1 + monthlyRate;
      let sipGrowth = 0;
      for (let month = 0; month < 12; month++) {
        sipGrowth += Math.pow(monthlyGrowthFactor, 11 - month);
      }
      yearEndValue = Number((yearEndValue + currentSip * sipGrowth).toFixed(2));

      // For the last year, ensure we hit exactly the goal amount
      if (i === yearlyBreakdown.length - 1) {
        yearEndValue = goalAmount;
      }

      yearlyBreakdown[i] = {
        year: i + 1,
        sipAmount: Number(currentSip.toFixed(2)),
        totalInvestment: Number((yearlyInvestment + (i === 0 ? initialLumpsum : 0)).toFixed(2)),
        expectedValue: yearEndValue,
      };

      totalValue = yearEndValue;
      currentSip = Number((currentSip * (1 + sipIncrease / 100)).toFixed(2));
    }

    return {
      monthlyAmount: baseSipAmount,
      yearlyBreakdown,
    };
  }

  // For cases without SIP increase
  return {
    monthlyAmount: baseSipAmount,
    yearlyBreakdown: Array.from({ length: timeline }, (_, i) => {
      const yearEndValue = i === timeline - 1 ? goalAmount : calculateFutureValueHelper(baseSipAmount, returnRate, i + 1, initialLumpsum);
      return {
        year: i + 1,
        sipAmount: baseSipAmount,
        totalInvestment: Number((i === 0 ? baseSipAmount * 12 + initialLumpsum : baseSipAmount * 12).toFixed(2)),
        expectedValue: yearEndValue,
      };
    }),
  };
}

// Helper function for calculating future value
function calculateFutureValueHelper(
  monthlySip: number,
  annualRate: number,
  years: number,
  initialAmount: number
): number {
  const monthlyRate = Number((annualRate / 12 / 100).toFixed(6));
  const months = years * 12;
  
  // Future value of monthly SIP with improved precision
  const monthlyGrowthFactor = 1 + monthlyRate;
  let sipGrowth = 0;
  for (let month = 0; month < months; month++) {
    sipGrowth += Math.pow(monthlyGrowthFactor, months - 1 - month);
  }
  const sipFutureValue = Number((monthlySip * sipGrowth).toFixed(2));
  
  // Future value of initial lumpsum
  const lumpsumFutureValue = Number((initialAmount * Math.pow(1 + annualRate / 100, years)).toFixed(2));
  
  return Number((sipFutureValue + lumpsumFutureValue).toFixed(2));
}

export function calculateProgress(
  currentAmount: number,
  targetAmount: number
): number {
  if (targetAmount <= 0) return 100;
  return Math.min(100, Math.round((currentAmount / targetAmount) * 100));
}

export function formatCurrency(amount: number): string {
  // Format first, then remove decimal places
  const formatted = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(Math.floor(amount));
  
  return formatted;
}

export function calculateFutureValue(params: FutureValueParams) {
  const { principal, monthlyInvestment, years, returnRate, sipIncrease } = params;
  const monthlyRate = returnRate / 12 / 100;
  const months = years * 12;

  let futureValue = principal * Math.pow(1 + monthlyRate, months);
  let currentMonthlyInvestment = monthlyInvestment;

  // Calculate future value with increasing SIP
  for (let i = 1; i <= months; i++) {
    // Increase SIP annually
    if (i % 12 === 1 && i > 1) {
      currentMonthlyInvestment *= (1 + sipIncrease / 100);
    }

    futureValue += currentMonthlyInvestment * Math.pow(1 + monthlyRate, months - i);
  }

  return {
    futureValue: Number(futureValue.toFixed(2))
  };
}

export function recalculateSIPAfterLumpsum(currentPlan: CurrentPlan, lumpsumAmount: number) {
  const {
    goalAmount,
    timeline,
    returnRate,
    sipIncrease,
    accumulatedAmount
  } = currentPlan;

  // Calculate new SIP with updated accumulated amount
  const newSIP = calculateSIP({
    goalAmount,
    timeline,
    returnRate,
    sipIncrease,
    initialLumpsum: accumulatedAmount + lumpsumAmount
  });

  return {
    newSIPAmount: newSIP.monthlyAmount,
    updatedAccumulatedAmount: accumulatedAmount + lumpsumAmount
  };
} 