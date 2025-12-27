import React, { useState } from 'react'
import { X, ChevronDown, Save, UserPlus, Trash2 } from 'lucide-react'
import { useMaintenanceContext } from '../context/MaintenanceContext'
import { toast } from 'react-toastify'

const TeamDetail = ({ onClose, initialData = null }) => {
  const { addTeam, updateTeam, deleteTeam } = useMaintenanceContext()
  
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    members: initialData?.members || [],
    company: initialData?.company || '',
    specialization: initialData?.specialization || '',
    notes: initialData?.notes || ''
  })

  const [newMember, setNewMember] = useState('')

  const specializations = [
    'General Maintenance',
    'Mechanical',
    'Electrical',
    'IT Support',
    'Precision Equipment',
    'External Services',
    'Other'
  ]

  const handleAddMember = () => {
    if (newMember.trim() && !formData.members.includes(newMember.trim())) {
      setFormData(prev => ({
        ...prev,
        members: [...prev.members, newMember.trim()]
      }))
      setNewMember('')
    }
  }

  const handleRemoveMember = (memberToRemove) => {
    setFormData(prev => ({
      ...prev,
      members: prev.members.filter(m => m !== memberToRemove)
    }))
  }

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this team?')) return
    
    try {
      await deleteTeam(initialData.id)
      toast.success('Team deleted successfully')
      onClose()
    } catch (error) {
      toast.error('Failed to delete team')
      console.error(error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      if (initialData && initialData.id) {
        await updateTeam(initialData.id, formData)
        toast.success('Team updated successfully')
      } else {
        await addTeam(formData)
        toast.success('Team added successfully')
      }
      onClose()
    } catch (error) {
       toast.error('Failed to save team')
       console.error(error)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-surface rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-gray-50/50">
          <h2 className="text-xl font-semibold text-text-main">
            {initialData ? 'Edit Team' : 'New Team'}
          </h2>
          <button 
            onClick={onClose}
            className="text-text-sub hover:text-text-main transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-6">
            
            {/* Team Name */}
            <div>
              <label className="block text-sm font-medium text-text-main mb-1">
                Team Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-border rounded bg-surface focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="Enter team name"
                required
              />
            </div>

            {/* Specialization */}
            <div>
              <label className="block text-sm font-medium text-text-main mb-1">
                Specialization
              </label>
              <div className="relative">
                <select
                  value={formData.specialization}
                  onChange={(e) => setFormData(prev => ({ ...prev, specialization: e.target.value }))}
                  className="w-full px-3 py-2 border border-border rounded bg-surface focus:outline-none focus:ring-1 focus:ring-primary appearance-none"
                >
                  <option value="">Select specialization...</option>
                  {specializations.map(spec => (
                    <option key={spec} value={spec}>{spec}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-text-sub pointer-events-none" size={16} />
              </div>
            </div>

            {/* Team Members */}
            <div>
              <label className="block text-sm font-medium text-text-main mb-2">
                Team Members
              </label>
              
              {/* Add Member Input */}
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={newMember}
                  onChange={(e) => setNewMember(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddMember())}
                  className="flex-1 px-3 py-2 border border-border rounded bg-surface focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="Enter member name"
                />
                <button
                  type="button"
                  onClick={handleAddMember}
                  className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-hover transition-colors flex items-center gap-2"
                >
                  <UserPlus size={16} />
                  Add
                </button>
              </div>

              {/* Members List */}
              {formData.members.length > 0 ? (
                <div className="border border-border rounded-lg divide-y divide-border">
                  {formData.members.map((member, index) => (
                    <div key={index} className="px-4 py-3 flex items-center justify-between hover:bg-gray-50">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-semibold">
                          {member.charAt(0)}
                        </div>
                        <span className="text-text-main font-medium">{member}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveMember(member)}
                        className="text-status-danger-text hover:bg-status-danger-bg p-1.5 rounded transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-text-sub text-sm border border-border rounded-lg border-dashed">
                  No members added yet. Add members using the input above.
                </div>
              )}
            </div>

            {/* Company */}
            <div>
              <label className="block text-sm font-medium text-text-main mb-1">
                Company
              </label>
              <input
                type="text"
                value={formData.company}
                onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                className="w-full px-3 py-2 border border-border rounded bg-surface focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="Company name"
              />
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-text-main mb-1">
                Notes
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                className="w-full px-3 py-2 border border-border rounded bg-surface focus:outline-none focus:ring-1 focus:ring-primary min-h-24 resize-y"
                placeholder="Additional notes about this team..."
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="px-6 py-4 border-t border-border bg-gray-50/50 flex justify-between gap-3">
             <div>
               {initialData && (
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
                  className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-hover transition-colors shadow-sm flex items-center gap-2"
                >
                  <Save size={16} />
                  Save Team
                </button>
             </div>
          </div>
        </form>

      </div>
    </div>
  )
}

export default TeamDetail
