import React, { useState } from 'react'
import { Search, ChevronDown, Plus, Wrench } from 'lucide-react'
import { useMaintenanceContext } from '../context/MaintenanceContext'
import EquipmentDetail from './EquipmentDetail'

const Equipment = () => {
  const { equipment, getOpenRequestsCount } = useMaintenanceContext()
  const [searchTerm, setSearchTerm] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [selectedEquipment, setSelectedEquipment] = useState(null)

  const filteredEquipment = equipment.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' })

  const handleSort = (key) => {
    let direction = 'asc'
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc'
    }
    setSortConfig({ key, direction })
  }

  const sortedEquipment = [...filteredEquipment].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? -1 : 1
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? 1 : -1
    }
    return 0
  })

  const handleNewEquipment = () => {
    setSelectedEquipment(null)
    setShowForm(true)
  }

  const handleEditEquipment = (item) => {
    setSelectedEquipment(item)
    setShowForm(true)
  }



  return (
    <div className="w-full min-h-screen flex flex-col font-sans text-text-main bg-background">
      


      {/* Main Content */}
      <div className="flex-1 px-6 pt-6 pb-6">
        <div className="bg-surface border border-border rounded-lg shadow-sm overflow-hidden">
          
          {/* Action Bar */}
          <div className="px-4 py-3 border-b border-border flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gray-50/50">
            <button 
              onClick={handleNewEquipment}
              className="bg-primary hover:bg-primary-hover text-white px-4 py-1.5 rounded flex items-center gap-2 font-medium transition-colors cursor-pointer shadow-sm"
            >
              <Plus size={16} />
              <span>New</span>
            </button>
            
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-sub" size={18} />
              <input 
                type="text" 
                placeholder="Search..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-10 py-1.5 border border-border rounded bg-surface focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 text-text-sub hover:text-text-main">
                <ChevronDown size={16} />
              </button>
            </div>
          </div>

          {/* Equipment Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-100 text-text-sub font-medium border-b border-border">
                <tr>
                  {[
                    { key: 'name', label: 'Equipment Name' },
                    { key: 'employee', label: 'Employee' },
                    { key: 'department', label: 'Department' },
                    { key: 'serialNumber', label: 'Serial Number' },
                    { key: 'technician', label: 'Technician' },
                    { key: 'category', label: 'Category' },
                    { key: 'company', label: 'Company' }
                  ].map(({ key, label }) => (
                    <th 
                      key={key} 
                      className="px-4 py-3 cursor-pointer hover:bg-gray-200 transition-colors select-none"
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
                {sortedEquipment.map((item) => (
                  <EquipmentRow 
                    key={item.id} 
                    {...item} 
                    requestCount={getOpenRequestsCount(item.id)}
                    onClick={() => handleEditEquipment(item)}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Equipment Detail Form Modal */}
      {showForm && (
        <EquipmentDetail 
          onClose={() => {
            setShowForm(false)
            setSelectedEquipment(null)
          }}
          initialData={selectedEquipment}
        />
      )}
    </div>
  )
}

function EquipmentRow({ name, employee, department, serialNumber, technician, category, company, requestCount, onClick }) {
  return (
    <tr className="hover:bg-gray-50 transition-colors cursor-pointer" onClick={onClick}>
      <td className="px-4 py-3 text-text-main font-medium">
        <div className="flex items-center gap-2">
          {name}
          {requestCount > 0 && (
            <button className="flex items-center gap-1 bg-primary-subtle text-primary px-2 py-0.5 rounded-full text-xs font-medium border border-primary/20 hover:bg-primary/10 transition-colors">
              <Wrench size={12} />
              {requestCount}
            </button>
          )}
        </div>
      </td>
      <td className="px-4 py-3 text-text-sub">{employee || '-'}</td>
      <td className="px-4 py-3 text-text-sub">{department}</td>
      <td className="px-4 py-3 text-text-main font-mono text-xs">{serialNumber}</td>
      <td className="px-4 py-3 text-text-sub">{technician}</td>
      <td className="px-4 py-3 text-text-sub">{category}</td>
      <td className="px-4 py-3 text-text-sub">{company}</td>
    </tr>
  )
}

export default Equipment