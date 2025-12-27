import React, { useMemo } from 'react'
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area
} from 'recharts'
import { 
  TrendingUp, 
  Filter, 
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react'
import { useMaintenanceContext } from '../context/MaintenanceContext'

const Reporting = () => {
  const { requests, getReportingMetrics, isOverdue } = useMaintenanceContext()
  const metrics = getReportingMetrics()
  
  // Get recent requests for process tracker
  const trackerRequests = requests.slice(0, 10)

  // --- Chart Data Preparation ---
  const chartData = useMemo(() => {
    // 1. Status Distribution (Bar Chart)
    const statusData = ['New', 'In Progress', 'Repaired', 'Scrap'].map(stage => ({
        name: stage,
        count: requests.filter(r => r.stage === stage).length
    }))

    // 2. Technician Workload (Pie Chart)
    const techData = requests.reduce((acc, curr) => {
        if (!curr.technician) return acc
        const existing = acc.find(item => item.name === curr.technician)
        if (existing) {
          existing.value += 1
        } else {
          acc.push({ name: curr.technician, value: 1 })
        }
        return acc
    }, [])

    // 3. Trends (Area Chart) - Group by Request Date
    const trendMap = requests.reduce((acc, curr) => {
        const date = curr.request_date 
        // Simple aggregation
        acc[date] = (acc[date] || 0) + 1
        return acc
    }, {})
    
    const trendData = Object.keys(trendMap)
        .sort((a, b) => new Date(a) - new Date(b))
        .map(date => ({
            date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            requests: trendMap[date]
        }))

    // 4. Priority Breakdown (Bar Chart)
    const priorityData = [
        { name: 'Low (1)', value: requests.filter(r => r.priority === 1).length, color: '#4ade80' },
        { name: 'Medium (2)', value: requests.filter(r => r.priority === 2).length, color: '#facc15' },
        { name: 'High (3)', value: requests.filter(r => r.priority === 3).length, color: '#f87171' }
    ]

    return { statusData, techData, trendData, priorityData }
  }, [requests])

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  return (
    <div className="w-full min-h-screen flex flex-col font-sans text-text-main bg-background">
      
      {/* Main Content */}
      <div className="flex-1 px-6 pt-6 pb-6 space-y-6 bg-background">
        
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <ReportCard 
            title="Total Requests" 
            value={metrics.totalRequests.toString()} 
            trend="+12%" 
            icon={<FileTextIcon />}
            color="blue"
          />
          <ReportCard 
            title="Avg Resolution Time" 
            value={`${metrics.avgResolutionTime} Days`} 
            trend="-8%" 
            trendPositive={true}
            icon={<Clock size={20} />} 
            color="orange"
          />
          <ReportCard 
            title="Compliance Rate" 
            value={`${metrics.complianceRate}%`} 
            trend="+2%" 
            icon={<CheckCircle size={20} />} 
            color="green"
          />
          <ReportCard 
            title="Critical Pending" 
            value={metrics.criticalPending.toString()} 
            subtext="Needs Attention"
            icon={<AlertCircle size={20} />} 
            color="red"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 h-80">
            {/* 1. Request Volume Trend */}
            <div className="bg-surface border border-border rounded-lg shadow-sm p-4 flex flex-col xl:col-span-2">
                <h3 className="font-semibold text-text-main mb-4">Request Volume Trends</h3>
                <div className="flex-1 w-full min-h-0">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData.trendData}>
                            <defs>
                                <linearGradient id="colorRequests" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                            <XAxis dataKey="date" tick={{fontSize: 12}} />
                            <YAxis allowDecimals={false} tick={{fontSize: 12}} />
                            <Tooltip 
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                            />
                            <Area type="monotone" dataKey="requests" stroke="#8884d8" fillOpacity={1} fill="url(#colorRequests)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* 2. Requests by Status */}
            <div className="bg-surface border border-border rounded-lg shadow-sm p-4 flex flex-col">
                <h3 className="font-semibold text-text-main mb-4">Requests by Status</h3>
                <div className="flex-1 w-full min-h-0">
                     <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData.statusData} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#eee" />
                            <XAxis type="number" allowDecimals={false} hide />
                            <YAxis dataKey="name" type="category" width={80} tick={{fontSize: 11}} />
                            <Tooltip cursor={{fill: 'transparent'}} />
                            <Bar dataKey="count" fill="#4ade80" radius={[0, 4, 4, 0]} barSize={20} />
                        </BarChart>
                     </ResponsiveContainer>
                </div>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-80">
             {/* 3. Technician Workload */}
             <div className="bg-surface border border-border rounded-lg shadow-sm p-4 flex flex-col">
                <h3 className="font-semibold text-text-main mb-4">Technician Workload</h3>
                <div className="flex-1 w-full min-h-0">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={chartData.techData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {chartData.techData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend verticalAlign="bottom" height={36}/>
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
            
            {/* 4. Request Priority Breakdown */}
            <div className="bg-surface border border-border rounded-lg shadow-sm p-4 flex flex-col lg:col-span-2">
                <h3 className="font-semibold text-text-main mb-4">Requests by Priority</h3>
                <div className="flex-1 w-full min-h-0">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData.priorityData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                            <XAxis dataKey="name" tick={{fontSize: 12}} />
                            <YAxis allowDecimals={false} tick={{fontSize: 12}} />
                            <Tooltip cursor={{fill: 'transparent'}} />
                            <Bar dataKey="value" name="Requests" radius={[4, 4, 0, 0]} barSize={40}>
                                {chartData.priorityData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>


        {/* Process Tracking Table */}
        <div className="bg-surface border border-border rounded-lg shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-border flex justify-between items-center bg-gray-50/50">
            <h2 className="font-semibold text-base text-text-main">Request Process Tracker</h2>
            <button className="text-text-sub hover:text-primary transition-colors">
              <Filter size={18} />
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-100 text-text-sub font-medium border-b border-border">
                <tr>
                   <th className="px-4 py-3">Request ID</th>
                   <th className="px-4 py-3">Equipment</th>
                   <th className="px-4 py-3">Request Date</th>
                   <th className="px-4 py-3">Assigned To</th>
                   <th className="px-4 py-3">Stage</th>
                   <th className="px-4 py-3">Completion</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border bg-surface">
                 {trackerRequests.map((request) => (
                   <TrackingRow 
                      key={request.id}
                      id={`#REQ-${request.id}`}
                      equipment={request.equipment}
                      date={new Date(request.request_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      assignee={request.technician || 'Unassigned'}
                      stage={request.stage}
                      progress={request.stage === 'Repaired' ? 100 : request.stage === 'In Progress' ? 65 : request.stage === 'New' ? 10 : 0}
                      isOverdue={isOverdue(request)}
                   />
                 ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

function ReportCard({ title, value, trend, trendPositive, color, icon, subtext }) {
    const colorClasses = {
        blue: "text-blue-600 bg-blue-50 border-blue-100",
        orange: "text-orange-600 bg-orange-50 border-orange-100",
        green: "text-green-600 bg-green-50 border-green-100",
        red: "text-red-600 bg-red-50 border-red-100",
    }
    
    // Default trend logic: up is green unless trendPositive is false (e.g. for time, down is good)
    const isGood = trendPositive ?? (!trend?.startsWith('-')); 
    const trendColor = isGood ? 'text-green-600' : 'text-red-600';

    return (
        <div className={`p-4 rounded-lg border bg-surface flex flex-col justify-between h-32 hover:shadow-md transition-shadow`}>
            <div className="flex justify-between items-start">
               <div>
                   <p className="text-text-sub text-sm font-medium">{title}</p>
                   <h3 className="text-xl font-bold mt-1 text-text-main">{value}</h3>
               </div>
               <div className={`p-2 rounded-full ${colorClasses[color]}`}>
                   {icon}
               </div>
            </div>
            <div className="flex items-center gap-2 text-sm mt-2">
                {trend && (
                    <span className={`flex items-center ${trendColor} bg-gray-50 px-1.5 py-0.5 rounded text-xs font-semibold`}>
                        {trend.startsWith('+') ? <TrendingUp size={12} className="mr-1"/> : <TrendingUp size={12} className="mr-1 rotate-180"/>}
                        {trend}
                    </span>
                )}
                {subtext && <span className="text-text-sub text-xs">{subtext}</span>}
                {!subtext && !trend && <span className="text-text-sub text-xs">No change</span>}
            </div>
        </div>
    )
}

function TrackingRow({ id, equipment, date, assignee, stage, progress, isOverdue }) {
    const stageColors = {
        'New': 'bg-status-new-bg text-status-new-text border-status-new-text/20',
        'In Progress': 'bg-blue-100 text-blue-700 border-blue-200',
        'Repaired': 'bg-status-repaired-bg text-status-repaired-text border-status-repaired-text/20',
        'Critical': 'bg-status-danger-bg text-status-danger-text border-status-danger-text/20',
    }

    return (
        <tr className="hover:bg-gray-50 transition-colors">
            <td className="px-4 py-3 font-medium text-primary">{id}</td>
            <td className="px-4 py-3 text-text-main">{equipment}</td>
            <td className="px-4 py-3 text-text-sub">
                {date}
                {isOverdue && <span className="block text-[10px] font-bold text-red-600 uppercase">Overdue</span>}
            </td>
            <td className="px-4 py-3 text-text-main flex items-center gap-2">
                {assignee !== 'Unassigned' && <div className="w-6 h-6 rounded-full bg-gray-200 text-xs flex items-center justify-center font-bold text-gray-600">{assignee.charAt(0)}</div>}
                {assignee}
            </td>
            <td className="px-4 py-3">
                 <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${stageColors[stage] || 'bg-gray-100 text-gray-600'}`}>
                   {stage}
                 </span>
            </td>
            <td className="px-4 py-3 w-48">
                <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                        <div 
                            className={`h-full rounded-full ${progress === 100 ? 'bg-green-500' : progress > 50 ? 'bg-blue-500' : progress > 0 ? 'bg-orange-400' : 'bg-gray-300'}`} 
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                    <span className="text-xs text-text-sub w-8 text-right">{progress}%</span>
                </div>
            </td>
        </tr>
    )
}

function FileTextIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
    )
}

export default Reporting
