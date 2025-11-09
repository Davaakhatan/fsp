import React, { useState } from 'react';
import { DollarSign, Calculator, TrendingUp, Award, ExternalLink, Info, CheckCircle2 } from 'lucide-react';

export const FinancingHub: React.FC = () => {
  // Calculator state
  const [totalCost, setTotalCost] = useState(15000);
  const [downPayment, setDownPayment] = useState(0);
  const [loanTerm, setLoanTerm] = useState(36); // months
  const [interestRate, setInterestRate] = useState(8.5);
  const [trainingPace, setTrainingPace] = useState('standard'); // fast_track, standard, flexible

  // Calculate monthly payment
  const loanAmount = totalCost - downPayment;
  const monthlyRate = interestRate / 100 / 12;
  const monthlyPayment = loanAmount > 0
    ? (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, loanTerm)) /
      (Math.pow(1 + monthlyRate, loanTerm) - 1)
    : 0;
  const totalPayment = monthlyPayment * loanTerm + downPayment;
  const totalInterest = totalPayment - totalCost;

  // Estimated training duration based on pace
  const trainingDuration = {
    fast_track: 3,
    standard: 6,
    flexible: 12,
  }[trainingPace] || 6; // Default to 6 months if undefined

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <DollarSign className="h-16 w-16 text-blue-600 mx-auto mb-4" />
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Financing Hub</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Explore financing options, calculate affordability, and find funding opportunities for your flight training
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Left Column - Calculator */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="flex items-center space-x-3 mb-6">
                <Calculator className="h-8 w-8 text-blue-600" />
                <h2 className="text-3xl font-bold text-gray-900">Affordability Calculator</h2>
              </div>
              <p className="text-gray-600 mb-8">
                Estimate your monthly payments and see what you'll actually pay based on your training pace and financing terms.
              </p>

              {/* Calculator Inputs */}
              <div className="space-y-6">
                {/* Total Cost */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Total Training Cost
                  </label>
                  <div className="flex items-center space-x-4">
                    <input
                      type="range"
                      min="5000"
                      max="100000"
                      step="1000"
                      value={totalCost}
                      onChange={(e) => setTotalCost(Number(e.target.value))}
                      className="flex-1 h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <input
                      type="number"
                      value={totalCost}
                      onChange={(e) => setTotalCost(Number(e.target.value))}
                      className="w-32 px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-600 focus:ring-4 focus:ring-blue-100 outline-none"
                    />
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>$5k</span>
                    <span className="text-lg font-bold text-blue-600">${(totalCost / 1000).toFixed(0)}k</span>
                    <span>$100k</span>
                  </div>
                </div>

                {/* Down Payment */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Down Payment (Optional)
                  </label>
                  <div className="flex items-center space-x-4">
                    <input
                      type="range"
                      min="0"
                      max={totalCost}
                      step="500"
                      value={downPayment}
                      onChange={(e) => setDownPayment(Number(e.target.value))}
                      className="flex-1 h-2 bg-green-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <input
                      type="number"
                      value={downPayment}
                      onChange={(e) => setDownPayment(Math.min(Number(e.target.value), totalCost))}
                      className="w-32 px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-600 focus:ring-4 focus:ring-blue-100 outline-none"
                    />
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>$0</span>
                    <span className="text-lg font-bold text-green-600">${(downPayment / 1000).toFixed(1)}k ({((downPayment / totalCost) * 100).toFixed(0)}%)</span>
                    <span>${(totalCost / 1000).toFixed(0)}k</span>
                  </div>
                </div>

                {/* Loan Term */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Loan Term (Months)
                  </label>
                  <div className="grid grid-cols-4 gap-3">
                    {[24, 36, 48, 60].map((term) => (
                      <button
                        key={term}
                        onClick={() => setLoanTerm(term)}
                        className={`px-4 py-3 rounded-lg font-semibold transition-all ${
                          loanTerm === term
                            ? 'bg-blue-600 text-white shadow-lg'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {term}mo
                      </button>
                    ))}
                  </div>
                </div>

                {/* Interest Rate */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estimated Interest Rate (APR)
                  </label>
                  <div className="flex items-center space-x-4">
                    <input
                      type="range"
                      min="5"
                      max="20"
                      step="0.5"
                      value={interestRate}
                      onChange={(e) => setInterestRate(Number(e.target.value))}
                      className="flex-1 h-2 bg-yellow-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <input
                      type="number"
                      value={interestRate}
                      onChange={(e) => setInterestRate(Number(e.target.value))}
                      step="0.1"
                      className="w-32 px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-600 focus:ring-4 focus:ring-blue-100 outline-none"
                    />
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>5%</span>
                    <span className="text-lg font-bold text-yellow-600">{interestRate.toFixed(1)}% APR</span>
                    <span>20%</span>
                  </div>
                </div>

                {/* Training Pace */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Training Pace
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      onClick={() => setTrainingPace('fast_track')}
                      className={`px-4 py-3 rounded-lg font-semibold transition-all ${
                        trainingPace === 'fast_track'
                          ? 'bg-blue-600 text-white shadow-lg'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Fast Track<br /><span className="text-xs">3 months</span>
                    </button>
                    <button
                      onClick={() => setTrainingPace('standard')}
                      className={`px-4 py-3 rounded-lg font-semibold transition-all ${
                        trainingPace === 'standard'
                          ? 'bg-blue-600 text-white shadow-lg'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Standard<br /><span className="text-xs">6 months</span>
                    </button>
                    <button
                      onClick={() => setTrainingPace('flexible')}
                      className={`px-4 py-3 rounded-lg font-semibold transition-all ${
                        trainingPace === 'flexible'
                          ? 'bg-blue-600 text-white shadow-lg'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Flexible<br /><span className="text-xs">12 months</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Results */}
              <div className="mt-8 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Your Estimated Payment</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Monthly Payment</p>
                    <p className="text-4xl font-bold text-blue-600">${monthlyPayment.toFixed(0)}</p>
                    <p className="text-xs text-gray-500 mt-1">for {loanTerm} months</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Loan Amount</p>
                    <p className="text-4xl font-bold text-gray-900">${(loanAmount / 1000).toFixed(1)}k</p>
                    <p className="text-xs text-gray-500 mt-1">after down payment</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Total Interest</p>
                    <p className="text-2xl font-bold text-yellow-600">${totalInterest.toFixed(0)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Total Paid</p>
                    <p className="text-2xl font-bold text-gray-900">${(totalPayment / 1000).toFixed(1)}k</p>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-white rounded-lg border border-blue-200">
                  <div className="flex items-start space-x-3">
                    <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-gray-700">
                      <p className="font-semibold mb-1">Training Timeline</p>
                      <p>
                        With a {trainingPace.replace('_', ' ')} pace, you'll complete training in approximately{' '}
                        <span className="font-bold text-blue-600">{trainingDuration} months</span>.
                        {loanTerm > trainingDuration && (
                          <> You'll be making payments for {loanTerm - trainingDuration} months after completion.</>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Quick Tips */}
          <div className="space-y-6">
            {/* Financing Tips */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <div className="flex items-center space-x-2 mb-4">
                <TrendingUp className="h-6 w-6 text-green-600" />
                <h3 className="text-xl font-bold text-gray-900">Financing Tips</h3>
              </div>
              <ul className="space-y-3">
                {[
                  'Start with a larger down payment to reduce monthly costs',
                  'Compare rates from multiple lenders',
                  'Check if you qualify for VA benefits',
                  'Look for schools offering payment plans',
                  'Factor in living expenses during training',
                ].map((tip, idx) => (
                  <li key={idx} className="flex items-start space-x-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-700">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Scholarships CTA */}
            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl shadow-xl p-6 border-2 border-yellow-200">
              <Award className="h-12 w-12 text-yellow-600 mb-3" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Scholarships Available</h3>
              <p className="text-sm text-gray-700 mb-4">
                Thousands in scholarships are available for aspiring pilots. Don't miss out!
              </p>
              <button className="w-full px-4 py-3 bg-yellow-600 text-white font-semibold rounded-lg hover:bg-yellow-700 transition-colors">
                Browse Scholarships
              </button>
            </div>
          </div>
        </div>

        {/* Financing Partners */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Financing Partners</h2>
          <p className="text-gray-600 mb-8">
            These lenders specialize in aviation training loans and offer competitive rates for qualified borrowers.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: 'Aviation Finance Corp',
                apr: '6.99% - 14.99%',
                term: 'Up to 84 months',
                minCredit: 650,
                description: 'Specialized flight training loans with competitive rates',
              },
              {
                name: 'Pilot Path Lending',
                apr: '7.99% - 16.99%',
                term: 'Up to 60 months',
                minCredit: 580,
                description: 'Flexible options including cosigner programs',
              },
              {
                name: 'Stratus Financial',
                apr: '6.49% - 13.99%',
                term: 'Up to 120 months',
                minCredit: 680,
                description: 'Industry leader with fast approvals',
              },
            ].map((partner, idx) => (
              <div
                key={idx}
                className="p-6 border-2 border-gray-200 rounded-xl hover:border-blue-600 hover:shadow-lg transition-all"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-2">{partner.name}</h3>
                <p className="text-sm text-gray-600 mb-4">{partner.description}</p>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">APR Range:</span>
                    <span className="font-semibold text-gray-900">{partner.apr}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Loan Term:</span>
                    <span className="font-semibold text-gray-900">{partner.term}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Min. Credit:</span>
                    <span className="font-semibold text-gray-900">{partner.minCredit}</span>
                  </div>
                </div>
                <button className="w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2">
                  <span>Learn More</span>
                  <ExternalLink className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
