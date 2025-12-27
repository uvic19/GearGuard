import React, { useState, useEffect } from 'react'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import { useMaintenanceContext } from '../context/MaintenanceContext'
import { Search, ChevronDown, Plus, Filter, Star, AlertCircle, Trash2 } from 'lucide-react'
import MaintenanceRequest from './MaintenanceRequest'
import { useSearchParams } from 'react-router-dom'

const MaintenanceRequests = () => {
  const { requests, teams, moveRequestToStage, isOverdue } = useMaintenanceContext()
  const [showForm, setShowForm] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [searchParams] = useSearchParams()
  
  // Filter state
  const [searchTerm, setSearchTerm] = useState('')
  const [filterTeam, setFilterTeam] = useState('All')
  
  // Initialize filter from URL if present
  useEffect(() => {
    const equipmentFilter = searchParams.get('equipment')
    if (equipmentFilter) {
      setSearchTerm(equipmentFilter)
    }
  }, [searchParams])

  const stages = ['New', 'In Progress', 'Repaired', 'Scrap']

  // Group requests by stage
  const requestsByStage = stages.reduce((acc, stage) => {
    acc[stage] = requests.filter(req => {
      const matchesStage = req.stage === stage
      const matchesSearch = 
        req.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.equipment.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesTeam = filterTeam === 'All' || req.team === filterTeam
      
      return matchesStage && matchesSearch && matchesTeam
    })
    return acc
  }, {})

  const handleDragEnd = (result) => {
    if (!result.destination) return

    const { source, destination, draggableId } = result
    
    if (source.droppableId !== destination.droppableId) {
      const requestId = draggableId.replace('request-', '')
      moveRequestToStage(requestId, destination.droppableId)
    }
  }

  const handleCardClick = (request) => {
    setSelectedRequest(request)
    setShowForm(true)
  }

  const handleNewRequest = () => {
    setSelectedRequest(null)
    setShowForm(true)
  }

  const stageColors = {
    'New': 'bg-status-new-bg border-status-new-text',
    'In Progress': 'bg-status-progress-bg border-status-progress-text',
    'Repaired': 'bg-status-repaired-bg border-status-repaired-text',
    'Scrap': 'bg-status-danger-bg border-status-danger-text'
  }

  return (
    <div className="w-full min-h-screen flex flex-col font-sans text-text-main bg-background">
      
      {/* Action Bar */}
      <div className="px-6 py-4 border-b border-border bg-surface sticky top-0 z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-4">
             <h1 className="text-xl font-semibold text-text-main">Maintenance Requests</h1>
             <button 
                onClick={handleNewRequest}
                className="bg-primary hover:bg-primary-hover text-white px-4 py-1.5 rounded flex items-center gap-2 font-medium transition-colors cursor-pointer shadow-sm"
              >
                <Plus size={16} />
                <span>New</span>
              </button>
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-sub" size={18} />
              <input 
                type="text" 
                placeholder="Search requests..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-1.5 border border-border rounded bg-surface focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            
            <div className="relative">
              <select
                value={filterTeam}
                onChange={(e) => setFilterTeam(e.target.value)}
                className="pl-3 pr-8 py-1.5 border border-border rounded bg-surface focus:outline-none focus:ring-1 focus:ring-primary appearance-none"
              >
                <option value="All">All Teams</option>
                {teams.map(team => (
                  <option key={team.id} value={team.name}>{team.name}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-text-sub pointer-events-none" size={16} />
            </div>
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 p-6 overflow-x-auto">
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="flex gap-4 min-w-max">
            {stages.map(stage => (
              <div key={stage} className="flex-1 min-w-[300px]">
                {/* Column Header */}
                <div className={`px-4 py-3 rounded-t-lg border-t-4 ${stageColors[stage]} flex items-center justify-between bg-surface shadow-sm mb-3`}>
                  <h3 className="font-semibold text-text-main">{stage}</h3>
                  <span className="bg-gray-100 px-2 py-0.5 rounded-full text-xs font-medium text-text-sub">
                    {requestsByStage[stage].length}
                  </span>
                </div>

                {/* Droppable Area */}
                <Droppable droppableId={stage}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`bg-gray-100/50 rounded-lg min-h-[calc(100vh-200px)] p-2 space-y-3 ${
                        snapshot.isDraggingOver ? 'bg-primary/5' : ''
                      }`}
                    >
                      {requestsByStage[stage].map((request, index) => (
                        <Draggable 
                          key={request.id} 
                          draggableId={`request-${request.id}`} 
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              onClick={() => handleCardClick(request)}
                              className={`cursor-pointer transform transition-transform ${snapshot.isDragging ? 'rotate-2 scale-105' : ''}`}
                            >
                              <RequestCard request={request} isOverdue={isOverdue(request)} />
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                      
                      {requestsByStage[stage].length === 0 && (
                        <div className="text-center py-12 text-text-sub text-sm opacity-60">
                          Empty
                        </div>
                      )}
                    </div>
                  )}
                </Droppable>
              </div>
            ))}
          </div>
        </DragDropContext>
      </div>

      {/* Maintenance Request Form Modal */}
      {showForm && (
        <MaintenanceRequest 
          onClose={() => {
            setShowForm(false)
            setSelectedRequest(null)
          }}
          initialData={selectedRequest}
        />
      )}
    </div>
  )
}

// Request Card Component
function RequestCard({ request, isOverdue }) {
  const priorityStars = Array(request.priority || 0).fill(0)

  return (
    <div className="bg-surface border border-border/60 rounded-lg p-4 shadow-sm hover:shadow-md transition-all group">
      {/* Header with Priority and Overdue */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-1">
          {priorityStars.map((_, i) => (
            <Star key={i} size={14} fill="#F59E0B" className="text-yellow-500" />
          ))}
        </div>
        {isOverdue && (
          <div className="flex items-center gap-1 bg-red-50 text-red-600 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border border-red-100">
            <AlertCircle size={10} />
            Overdue
          </div>
        )}
      </div>

      {/* Subject */}
      <h4 className="font-semibold text-text-main mb-1 line-clamp-2 group-hover:text-primary transition-colors">
        {request.subject}
      </h4>

      {/* Equipment */}
      <div className="flex items-center gap-2 mb-3">
         <span className="text-sm text-text-sub truncate">{request.equipment}</span>
      </div>

      {/* Category Tag & Avatar */}
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/50">
        <span className="bg-gray-100 text-text-sub px-2 py-0.5 rounded text-xs font-medium">
          {request.category || 'General'}
        </span>
        
        {request.technician && (
            <div className="flex items-center gap-2" title={`Assigned to ${request.technician}`}>
                <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold uppercase ring-2 ring-white">
                {request.technician.charAt(0)}
                </div>
            </div>
        )}
      </div>
    </div>
  )
}

export default MaintenanceRequests
