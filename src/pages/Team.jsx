import React, { useState } from 'react'
import { Search, ChevronDown, Plus } from 'lucide-react'
import { useMaintenanceContext } from '../context/MaintenanceContext'
import TeamDetail from './TeamDetail'

const Team = () => {
  const { teams } = useMaintenanceContext()
  const [searchTerm, setSearchTerm] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [selectedTeam, setSelectedTeam] = useState(null)

  const filteredTeams = teams.filter(team =>
    team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    team.members.some(member => member.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' })

  const handleSort = (key) => {
    let direction = 'asc'
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc'
    }
    setSortConfig({ key, direction })
  }

  const sortedTeams = [...filteredTeams].sort((a, b) => {
    // Helper to handle array sorting (like members)
    const valA = Array.isArray(a[sortConfig.key]) ? a[sortConfig.key].length : a[sortConfig.key]
    const valB = Array.isArray(b[sortConfig.key]) ? b[sortConfig.key].length : b[sortConfig.key]

    if (valA < valB) {
      return sortConfig.direction === 'asc' ? -1 : 1
    }
    if (valA > valB) {
      return sortConfig.direction === 'asc' ? 1 : -1
    }
    return 0
  })

  const handleNewTeam = () => {
    setSelectedTeam(null)
    setShowForm(true)
  }

  const handleEditTeam = (team) => {
    setSelectedTeam(team)
    setShowForm(true)
  }


  return (
    <div className="w-full min-h-screen flex flex-col font-sans text-text-main bg-background">
      
      {/* Main Content */}
      <div className="flex-1 px-6 pt-6 pb-6">
        <div className="bg-surface border border-border rounded-lg shadow-sm overflow-hidden">
          
          {/* Action Bar */}
          <div className="px-4 py-3 border-b border-border bg-gray-50/50">
            <button 
              onClick={handleNewTeam}
              className="bg-primary hover:bg-primary-hover text-white px-4 py-1.5 rounded flex items-center gap-2 font-medium transition-colors cursor-pointer shadow-sm"
            >
              <Plus size={16} />
              <span>New</span>
            </button>
          </div>

          {/* Teams Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-100 text-text-sub font-medium border-b border-border">
                <tr>
                  {[
                    { key: 'name', label: 'Team Name', width: 'w-1/3' },
                    { key: 'members', label: 'Team Members', width: 'w-1/3' },
                    { key: 'company', label: 'Company', width: 'w-1/3' }
                  ].map(({ key, label, width }) => (
                    <th 
                      key={key} 
                      className={`px-4 py-3 ${width} cursor-pointer hover:bg-gray-200 transition-colors select-none`}
                      onClick={() => handleSort(key)}
                    >
                      {label}
                      {sortConfig.key === key && (
                        <ChevronDown 
                          size={12} 
                          className={`inline ml-1 transition-transform ${sortConfig.direction === 'asc' ? 'rotate-180' : ''}`} 
                        />
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border bg-surface">
                {sortedTeams.map((team) => (
                  <TeamRow 
                    key={team.id} 
                    {...team} 
                    onClick={() => handleEditTeam(team)}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Team Detail Form Modal */}
      {showForm && (
        <TeamDetail 
          onClose={() => {
            setShowForm(false)
            setSelectedTeam(null)
          }}
          initialData={selectedTeam}
        />
      )}
    </div>
  )
}

function TeamRow({ name, members, company, onClick }) {
  const memberCount = members.length
  const displayMembers = members.slice(0, 3).join(', ') + (memberCount > 3 ? ` +${memberCount - 3} more` : '')
  
  return (
    <tr className="hover:bg-gray-50 transition-colors cursor-pointer" onClick={onClick}>
      <td className="px-4 py-3 text-text-main font-medium">{name}</td>
      <td className="px-4 py-3 text-text-sub">{displayMembers}</td>
      <td className="px-4 py-3 text-text-sub">{company}</td>
    </tr>
  )
}

export default Team