import { type Opportunity } from '../types.tsx'

interface OpportunitiesTableProps {
  opportunities: Opportunity[]
}

const OpportunitiesTable = ({ opportunities }: OpportunitiesTableProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'Prospecting':
        return 'bg-blue-100 text-blue-800'
      case 'Qualification':
        return 'bg-yellow-100 text-yellow-800'
      case 'Proposal':
        return 'bg-purple-100 text-purple-800'
      case 'Negotiation':
        return 'bg-orange-100 text-orange-800'
      case 'Closed Won':
        return 'bg-green-100 text-green-800'
      case 'Closed Lost':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (opportunities.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Opportunities</h2>
        </div>
        <div className="p-6 text-center">
          <div className="text-gray-400 text-4xl mb-4">💼</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Opportunities Yet</h3>
          <p className="text-gray-500">Convert leads to create opportunities.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">
          Opportunities ({opportunities.length})
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Account
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stage
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {opportunities.map((opportunity) => (
              <tr key={opportunity.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {opportunity.name}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {opportunity.accountName}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStageColor(opportunity.stage)}`}>
                    {opportunity.stage}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {opportunity.amount ? formatCurrency(opportunity.amount) : 'N/A'}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary */}
      {opportunities.length > 0 && (
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700">Total Value:</span>
            <span className="text-sm font-semibold text-gray-900">
              {formatCurrency(
                opportunities.reduce((sum, opp) => sum + (opp.amount || 0), 0)
              )}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

export default OpportunitiesTable
