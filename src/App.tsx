import { useState, useEffect } from 'react'
import { type Lead, type Opportunity } from './types.tsx'
import LeadsList from './components/LeadsList.tsx'
import LeadDetailPanel from './components/LeadDetailPanel.tsx'
import OpportunitiesTable from './components/OpportunitiesTable.tsx'

function App() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [opportunities, setOpportunities] = useState<Opportunity[]>([])
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isModalLoading, setIsModalLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // NEW: controle da aba ativa (estilo pill tabs)
  const [activeTab, setActiveTab] = useState<'leads' | 'opps'>('leads')

  useEffect(() => {
    loadLeads()
  }, [])

  const loadLeads = async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000))

      const response = await fetch('/leads.json')
      if (!response.ok) {
        throw new Error('Failed to load leads')
      }
      const data = await response.json()
      setLeads(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const handleLeadSelect = async (lead: Lead) => {
    setIsModalLoading(true)
    // Simulate loading delay for modal opening
    await new Promise(resolve => setTimeout(resolve, 200))
    setSelectedLead(lead)
    // Keep loading state true initially, modal will handle it
  }

  const handleLeadUpdate = (updatedLead: Lead) => {
    setLeads(prevLeads =>
      prevLeads.map(lead =>
        lead.id === updatedLead.id ? updatedLead : lead
      )
    )
    setSelectedLead(updatedLead)
  }

  const handleConvertToOpportunity = (lead: Lead) => {
    const newOpportunity: Opportunity = {
      id: opportunities.length + 1,
      name: lead.name,
      stage: 'Prospecting',
      amount: Math.floor(Math.random() * 100000) + 10000, // Random amount between 10k-110k
      accountName: lead.company,
      // se seu tipo de Opportunity tiver leadId, mantenha; se não, remova
      // @ts-ignore
      leadId: lead.id
    }

    setOpportunities(prev => [...prev, newOpportunity])

    // Update lead status to Qualified
    const updatedLead = { ...lead, status: 'Qualified' as const }
    handleLeadUpdate(updatedLead)

    // Close the detail panel
    setSelectedLead(null)

    // opcional: trocar para a aba de oportunidades para destacar o resultado
    setActiveTab('opps')
  }

  const handleClosePanel = () => {
    setSelectedLead(null)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading leads...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Data</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={loadLeads}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Mini Seller Console</h1>
          <p className="mt-2 text-gray-600">Manage leads and convert them to opportunities</p>
        </div>

        {/* Tabs Header (estilo “pill” parecido com o print) */}
        <div className="mb-6 w-full">
          <div className="flex w-full rounded-lg bg-gray-100 p-1">
            <button
              type="button"
              onClick={() => setActiveTab('leads')}
              aria-pressed={activeTab === 'leads'}
              className={[
                "flex-1 rounded-md px-3 py-2 text-sm text-center transition",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",
                activeTab === 'leads'
                  ? "bg-white text-gray-900 shadow-sm ring-1 ring-black/5"
                  : "text-gray-700 hover:text-gray-900"
              ].join(" ")}
            >
              <span className="font-medium">Leads</span>
              <span className="ml-1">({leads.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('opps')}
              aria-pressed={activeTab === 'opps'}
              className={[
                "flex-1 rounded-md px-3 py-2 text-sm text-center transition",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",
                activeTab === 'opps'
                  ? "bg-white text-gray-900 shadow-sm ring-1 ring-black/5"
                  : "text-gray-700 hover:text-gray-900"
              ].join(" ")}
            >
              <span className="font-medium">Opportunities</span>
              <span className="ml-1">({opportunities.length})</span>
            </button>
          </div>
        </div>

        {/* Painéis das abas */}
        {activeTab === 'leads' && (
          <div className="mb-8">
            <LeadsList
              leads={leads}
              onLeadSelect={handleLeadSelect}
            />
          </div>
        )}

        {activeTab === 'opps' && (
          <div className="mb-8">
            <OpportunitiesTable opportunities={opportunities} />
          </div>
        )}

        {/* Lead Detail Modal */}
        {selectedLead && (
          <LeadDetailPanel
            lead={selectedLead}
            onUpdate={handleLeadUpdate}
            onConvert={handleConvertToOpportunity}
            onClose={handleClosePanel}
            isLoading={isModalLoading}
          />
        )}
      </div>
    </div>
  )
}

export default App
