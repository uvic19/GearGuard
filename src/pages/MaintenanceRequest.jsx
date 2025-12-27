import React, { useState } from 'react'
import { X, ChevronDown, Calendar, Star, MessageSquare, Plus, Trash2, CheckSquare } from 'lucide-react'
import { useMaintenanceContext } from '../context/MaintenanceContext'
import { toast } from 'react-toastify'

const MaintenanceRequest = ({ onClose, initialData = null }) => {
  const { equipment, teams, workCenters, addRequest, updateRequest, deleteRequest } = useMaintenanceContext()
  const [formData, setFormData] = useState({
    subject: initialData?.subject || '',
    created_by: 'Mitchell Admin',
    maintenance_for: initialData?.maintenance_for || 'Equipment',
    equipment: initialData?.equipment || '',
    work_center: initialData?.work_center || '',
    equipment_id: initialData?.equipment_id || null,
    category: initialData?.category || '',
    request_date: initialData?.request_date || new Date().toISOString().split('T')[0],
    created_date: initialData?.created_date || new Date().toISOString().split('T')[0],
    maintenance_type: initialData?.maintenance_type || 'Corrective',
    team: initialData?.team || '',
    technician: initialData?.technician || '',
    scheduled_date: initialData?.scheduled_date || '',
    scheduled_time: initialData?.scheduled_time || '',
    duration: initialData?.duration || '00:00',
    priority: initialData?.priority || 2,
    company: initialData?.company || '',
    stage: initialData?.stage || 'New',
    notes: initialData?.notes || '',
    instructions: initialData?.instructions || '',
    worksheet: initialData?.worksheet || []
  })

  const [activeTab, setActiveTab] = useState('notes')
  const [loading, setLoading] = useState(false)
  const [showWorksheet, setShowWorksheet] = useState(false)

  // Auto-fill logic when equipment is selected
  const handleEquipmentChange = (equipmentName) => {
    const selected = equipment.find(eq => eq.name === equipmentName)
    if (selected) {
      setFormData(prev => ({
        ...prev,
        equipment: equipmentName,
        equipment_id: selected.id,
        category: selected.category,
        team: selected.team
      }))
    }
  }


  const handleTeamChange = (teamName) => {
    const selectedTeam = teams.find(t => t.name === teamName)
    setFormData(prev => ({
      ...prev,
      team: teamName,
      technician: selectedTeam && selectedTeam.members.length > 0 ? selectedTeam.members[0] : ''
    }))
  }

  // Worksheet Handlers
  const handleAddWorksheetItem = () => {
    setFormData(prev => ({
      ...prev,
      worksheet: [...prev.worksheet, { id: Date.now(), title: '', isDone: false }]
    }))
  }

  const handleUpdateWorksheetItem = (id, title) => {
    setFormData(prev => ({
      ...prev,
      worksheet: prev.worksheet.map(item => item.id === id ? { ...item, title } : item)
    }))
  }

  const handleToggleWorksheetItem = (id) => {
    setFormData(prev => ({
      ...prev,
      worksheet: prev.worksheet.map(item => item.id === id ? { ...item, isDone: !item.isDone } : item)
    }))
  }

  const handleDeleteWorksheetItem = (id) => {
    setFormData(prev => ({
      ...prev,
      worksheet: prev.worksheet.filter(item => item.id !== id)
    }))
  }

  const completedSteps = formData.worksheet.filter(i => i.isDone).length
  const totalSteps = formData.worksheet.length

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      let result
      if (initialData && initialData.id) {
        result = await updateRequest(initialData.id, formData)
      } else {
        result = await addRequest(formData)
      }
      
      if (result.error) {
        toast.error(result.error.message || 'Failed to save request')
        setLoading(false)
        return
      }
      
      toast.success(initialData && initialData.id ? 'Request updated successfully' : 'Request created successfully')
      if (onClose) onClose()
    } catch (err) {
      toast.error(err.message || 'An error occurred')
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this maintenance request?')) return
    
    try {
      await deleteRequest(initialData.id)
      toast.success('Request deleted successfully')
      if (onClose) onClose()
    } catch (error) {
      toast.error('Failed to delete request')
      console.error(error)
    }
  }

  const stages = ['New', 'In Progress', 'Repaired', 'Scrap']
  const currentStageIndex = stages.indexOf(formData.stage)

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-surface rounded-lg shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col relative">
        
        {/* Worksheet Modal Overlay */}
        {showWorksheet && (
          <div className="absolute inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
             <div className="bg-white w-full max-w-lg rounded-lg shadow-xl flex flex-col max-h-[80vh]">
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50 rounded-t-lg">
                   <div>
                     <h3 className="text-lg font-semibold text-gray-800">Quality Check / Worksheet</h3>
                     <p className="text-sm text-gray-500">Checklist for {formData.equipment || 'Equipment'}</p>
                   </div>
                   <button onClick={() => setShowWorksheet(false)} className="text-gray-400 hover:text-gray-600">
                     <X size={20} />
                   </button>
                </div>
                
                <div className="p-6 overflow-y-auto flex-1 space-y-3">
                   {formData.worksheet.length === 0 && (
                     <div className="text-center py-8 text-gray-400 italic">
                        No checklist items added yet.
                     </div>
                   )}
                   
                   {formData.worksheet.map((item) => (
                     <div key={item.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100 group">
                        <button 
                          onClick={() => handleToggleWorksheetItem(item.id)}
                          className={`flex-shrink-0 w-6 h-6 rounded border flex items-center justify-center transition-colors ${item.isDone ? 'bg-green-500 border-green-500 text-white' : 'bg-white border-gray-300 text-transparent hover:border-green-500'}`}
                        >
                           <CheckSquare size={14} fill={item.isDone ? "currentColor" : "none"} />
                        </button>
                        <input 
                           type="text" 
                           value={item.title}
                           onChange={(e) => handleUpdateWorksheetItem(item.id, e.target.value)}
                           className={`flex-1 bg-transparent border-none focus:ring-0 text-sm ${item.isDone ? 'text-gray-400 line-through' : 'text-gray-800 font-medium'}`}
                           placeholder="Describe task (e.g. Check Oil Level)"
                           autoFocus={!item.title}
                        />
                        <button 
                           onClick={() => handleDeleteWorksheetItem(item.id)}
                           className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                           <Trash2 size={16} />
                        </button>
                     </div>
                   ))}

                   <button 
                     type="button"
                     onClick={handleAddWorksheetItem}
                     className="w-full py-2.5 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 font-medium hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-2 mt-4"
                   >
                      <Plus size={18} />
                      Add Checklist Item
                   </button>
                </div>

                <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 rounded-b-lg flex justify-end">
                   <button 
                     onClick={() => setShowWorksheet(false)}
                     className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-hover font-medium shadow-sm"
                   >
                     Done
                   </button>
                </div>
             </div>
          </div>
        )}

        {/* Header */}
        <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-gray-50/50">
          <div className="flex items-center gap-4 flex-1">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-text-sub text-sm">Maintenance Requests</span>
                <span className="bg-status-new-bg text-status-new-text px-2 py-0.5 rounded text-xs font-medium border border-status-new-text/20">
                  {formData.stage}
                </span>
              </div>
              <h2 className="text-xl font-semibold text-text-main mt-1">
                {formData.subject || 'New Maintenance Request'}
              </h2>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
             {/* Smart Button */}
             <button 
                type="button"
                onClick={() => setShowWorksheet(true)}
                className="hidden md:flex flex-col items-center justify-center w-32 h-12 bg-surface hover:bg-gray-50 border border-border rounded shadow-sm transition-colors text-primary overflow-hidden relative"
             >
                <div className="flex items-center gap-2 font-medium">
                   <MessageSquare size={16} />
                   <span>Worksheet</span>
                </div>
                {totalSteps > 0 && (
                   <span className="text-xs text-text-sub">{completedSteps}/{totalSteps} Completed</span>
                )}
             </button>

            <button 
              onClick={onClose}
              className="text-text-sub hover:text-text-main transition-colors ml-4"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Stage Progress */}
        <div className="px-6 py-3 border-b border-border bg-surface">
          <div className="flex items-center justify-between max-w-2xl">
            {stages.map((stage, index) => (
              <React.Fragment key={stage}>
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-colors ${
                    index <= currentStageIndex 
                      ? 'bg-primary text-white' 
                      : 'bg-gray-200 text-text-sub'
                  }`}>
                    {index + 1}
                  </div>
                  <span className={`text-sm font-medium ${
                    index <= currentStageIndex ? 'text-primary' : 'text-text-sub'
                  }`}>
                    {stage}
                  </span>
                </div>
                {index < stages.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-2 ${
                    index < currentStageIndex ? 'bg-primary' : 'bg-gray-200'
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Left Column */}
            <div className="space-y-4">
              
              {/* Subject */}
              <div>
                <label className="block text-sm font-medium text-text-main mb-1">
                  Subject? <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                  className="w-full px-3 py-2 border border-border rounded bg-surface focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="Enter subject"
                  required
                />
              </div>

              {/* Created By */}
              <div>
                <label className="block text-sm font-medium text-text-main mb-1">
                  Created By
                </label>
                <input
                  type="text"
                  value={formData.createdBy}
                  disabled
                  className="w-full px-3 py-2 border border-border rounded bg-gray-50 text-text-sub cursor-not-allowed"
                />
              </div>

              {/* Maintenance For */}
              <div>
                <label className="block text-sm font-medium text-text-main mb-1">
                  Maintenance For
                </label>
                <div className="relative">
                  <select
                    value={formData.maintenance_for}
                    onChange={(e) => setFormData(prev => ({ ...prev, maintenance_for: e.target.value, equipment: '', work_center: '' }))}
                    className="w-full px-3 py-2 border border-border rounded bg-surface focus:outline-none focus:ring-1 focus:ring-primary appearance-none"
                  >
                    <option value="Equipment">Equipment</option>
                    <option value="Work Center">Work Center</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-text-sub pointer-events-none" size={16} />
                </div>
              </div>

              {/* Equipment or Work Center Selection */}
              {formData.maintenance_for === 'Equipment' ? (
                <div>
                  <label className="block text-sm font-medium text-text-main mb-1">
                    Equipment <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={formData.equipment}
                      onChange={(e) => handleEquipmentChange(e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded bg-surface focus:outline-none focus:ring-1 focus:ring-primary appearance-none"
                      required
                    >
                      <option value="">Select equipment...</option>
                      {equipment.map(eq => (
                        <option key={eq.id} value={eq.name}>
                          {eq.name} / {eq.serialNumber}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-text-sub pointer-events-none" size={16} />
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-text-main mb-1">
                    Work Center <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={formData.work_center}
                      onChange={(e) => setFormData(prev => ({ ...prev, work_center: e.target.value }))}
                      className="w-full px-3 py-2 border border-border rounded bg-surface focus:outline-none focus:ring-1 focus:ring-primary appearance-none"
                      required
                    >
                      <option value="">Select work center...</option>
                      {workCenters.map(wc => (
                        <option key={wc.id} value={wc.name}>{wc.name}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-text-sub pointer-events-none" size={16} />
                  </div>
                </div>
              )}

              {/* Category (Auto-filled) */}
              <div>
                <label className="block text-sm font-medium text-text-main mb-1">
                  Category
                </label>
                <input
                  type="text"
                  value={formData.category}
                  disabled
                  className="w-full px-3 py-2 border border-border rounded bg-gray-50 text-text-sub cursor-not-allowed"
                  placeholder="Auto-filled from equipment"
                />
              </div>

              {/* Request Date */}
              <div>
                <label className="block text-sm font-medium text-text-main mb-1">
                  Request Date?
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={formData.request_date}
                    onChange={(e) => setFormData(prev => ({ ...prev, request_date: e.target.value }))}
                    className="w-full px-3 py-2 border border-border rounded bg-surface focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-text-sub pointer-events-none" size={16} />
                </div>
              </div>

              {/* Maintenance Type */}
              <div>
                <label className="block text-sm font-medium text-text-main mb-2">
                  Maintenance Type
                </label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="maintenance_type"
                      value="Corrective"
                      checked={formData.maintenance_type === 'Corrective'}
                      onChange={(e) => setFormData(prev => ({ ...prev, maintenance_type: e.target.value }))}
                      className="w-4 h-4 text-primary"
                    />
                    <span className="text-sm text-text-main">Corrective</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="maintenance_type"
                      value="Preventive"
                      checked={formData.maintenance_type === 'Preventive'}
                      onChange={(e) => setFormData(prev => ({ ...prev, maintenance_type: e.target.value }))}
                      className="w-4 h-4 text-primary"
                    />
                    <span className="text-sm text-text-main">Preventive</span>
                  </label>
                </div>
              </div>

            </div>

            {/* Right Column */}
            <div className="space-y-4">
              
              {/* Team (Auto-filled) */}
              <div>
                <label className="block text-sm font-medium text-text-main mb-1">
                  Team
                </label>
                <div className="relative">
                  <select
                    value={formData.team}
                    onChange={(e) => handleTeamChange(e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded bg-surface focus:outline-none focus:ring-1 focus:ring-primary appearance-none"
                  >
                    <option value="">Select team...</option>
                    {teams.map(team => (
                      <option key={team.id} value={team.name}>{team.name}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-text-sub pointer-events-none" size={16} />
                </div>
              </div>

              {/* Technician */}
              <div>
                <label className="block text-sm font-medium text-text-main mb-1">
                  Technician
                </label>
                <div className="relative">
                  <select
                    value={formData.technician}
                    onChange={(e) => setFormData(prev => ({ ...prev, technician: e.target.value }))}
                    className="w-full px-3 py-2 border border-border rounded bg-surface focus:outline-none focus:ring-1 focus:ring-primary appearance-none"
                  >
                    <option value="">Select technician...</option>
                    {formData.team && teams.find(t => t.name === formData.team)?.members.map(tech => (
                      <option key={tech} value={tech}>{tech}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-text-sub pointer-events-none" size={16} />
                </div>
              </div>

              {/* Scheduled Date */}
              <div>
                <label className="block text-sm font-medium text-text-main mb-1">
                  Scheduled Date?
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="date"
                      value={formData.scheduled_date}
                      onChange={(e) => setFormData(prev => ({ ...prev, scheduled_date: e.target.value }))}
                      className="w-full px-3 py-2 border border-border rounded bg-surface focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <input
                    type="time"
                    value={formData.scheduled_time}
                    onChange={(e) => setFormData(prev => ({ ...prev, scheduled_time: e.target.value }))}
                    className="w-32 px-3 py-2 border border-border rounded bg-surface focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              {/* Duration */}
              <div>
                <label className="block text-sm font-medium text-text-main mb-1">
                  Duration
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={formData.duration}
                    onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                    className="w-24 px-3 py-2 border border-border rounded bg-surface focus:outline-none focus:ring-1 focus:ring-primary text-center"
                    placeholder="00:00"
                  />
                  <span className="text-sm text-text-sub">hours</span>
                </div>
              </div>

              {/* Priority */}
              <div>
                <label className="block text-sm font-medium text-text-main mb-2">
                  Priority
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3].map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, priority: level }))}
                      className={`p-2 rounded border transition-colors ${
                        formData.priority >= level
                          ? 'bg-primary/10 border-primary text-primary'
                          : 'bg-gray-100 border-border text-text-sub'
                      }`}
                    >
                      <Star size={20} fill={formData.priority >= level ? 'currentColor' : 'none'} />
                    </button>
                  ))}
                </div>
              </div>

              {/* Company */}
              <div>
                <label className="block text-sm font-medium text-text-main mb-1">
                  Company
                </label>
                <input
                  type="text"
                  value={formData.company}
                  disabled
                  className="w-full px-3 py-2 border border-border rounded bg-gray-50 text-text-sub cursor-not-allowed"
                />
              </div>

            </div>
          </div>

          {/* Notes/Instructions Tabs */}
          <div className="px-6 pb-6">
            <div className="border border-border rounded-lg overflow-hidden">
              <div className="flex border-b border-border bg-gray-50/50">
                <button
                  type="button"
                  onClick={() => setActiveTab('notes')}
                  className={`px-4 py-2 text-sm font-medium transition-colors ${
                    activeTab === 'notes'
                      ? 'bg-surface text-primary border-b-2 border-primary'
                      : 'text-text-sub hover:text-text-main'
                  }`}
                >
                  Notes
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('instructions')}
                  className={`px-4 py-2 text-sm font-medium transition-colors ${
                    activeTab === 'instructions'
                      ? 'bg-surface text-primary border-b-2 border-primary'
                      : 'text-text-sub hover:text-text-main'
                  }`}
                >
                  Instructions
                </button>
              </div>
              <div className="p-4 bg-surface">
                {activeTab === 'notes' ? (
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                    className="w-full px-3 py-2 border border-border rounded bg-surface focus:outline-none focus:ring-1 focus:ring-primary min-h-32 resize-y"
                    placeholder="Add notes about this maintenance request..."
                  />
                ) : (
                  <textarea
                    value={formData.instructions}
                    onChange={(e) => setFormData(prev => ({ ...prev, instructions: e.target.value }))}
                    className="w-full px-3 py-2 border border-border rounded bg-surface focus:outline-none focus:ring-1 focus:ring-primary min-h-32 resize-y"
                    placeholder="Add specific instructions for the technician..."
                  />
                )}
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="px-6 py-4 border-t border-border bg-gray-50/50 flex justify-between gap-3">
             <div className="flex items-center">
              {initialData && initialData.id && (
                <button
                  type="button"
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded hover:bg-red-100 transition-colors flex items-center gap-2"
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              )}
             </div>
             <div className="flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-border rounded bg-surface text-text-main hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-hover transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Saving...' : 'Save Request'}
                </button>
             </div>
          </div>
        </form>

      </div>
    </div>
  )
}

export default MaintenanceRequest
