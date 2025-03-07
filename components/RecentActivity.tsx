'use client'

import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Activity, Key, Lock, Trash2, Edit2, FileText, Shield } from 'lucide-react'

export interface ActivityItem {
  id: number
  action: 'add' | 'update' | 'delete' | 'generate' | 'edit' | 'create_note' | 'edit_note' | 'delete_note' | 'security_check'
  target: string
  date: string
}

export function RecentActivity() {
  const [activities, setActivities] = useState<ActivityItem[]>([])

  useEffect(() => {
    const fetchActivities = () => {
      const currentUser = localStorage.getItem('currentUser') || 'default'
      const storedActivities = JSON.parse(localStorage.getItem(`${currentUser}_recentActivities`) || '[]')
      setActivities(storedActivities)
    }

    fetchActivities()
    
    const intervalId = setInterval(fetchActivities, 5000)

    return () => clearInterval(intervalId)
  }, [])

  return (
    <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
      <AnimatePresence initial={false}>
        {activities.length > 0 ? (
          activities.map((activity, index) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="flex items-center space-x-3 p-3 bg-secondary/10 rounded-lg hover:bg-secondary/20 transition-colors duration-200"
            >
              {getActivityIcon(activity.action)}
              <div>
                <motion.p
                  className="text-sm font-medium"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.2 + index * 0.1 }}
                >
                  {getActivityMessage(activity)}
                </motion.p>
                <motion.p
                  className="text-xs text-muted-foreground"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
                >
                  {activity.date}
                </motion.p>
              </div>
            </motion.div>
          ))
        ) : (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm text-muted-foreground"
          >
            No recent activities
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}

function getActivityIcon(action: ActivityItem['action']) {
  const iconProps = { className: "w-4 h-4" }
  switch (action) {
    case 'add':
    case 'generate':
      return <Key {...iconProps} className="text-green-500" />
    case 'update':
    case 'edit':
      return <Edit2 {...iconProps} className="text-blue-500" />
    case 'delete':
      return <Trash2 {...iconProps} className="text-red-500" />
    case 'create_note':
    case 'edit_note':
    case 'delete_note':
      return <FileText {...iconProps} className="text-yellow-500" />
    case 'security_check':
      return <Shield {...iconProps} className="text-purple-500" />
    default:
      return <Activity {...iconProps} className="text-muted-foreground" />
  }
}

function getActivityMessage(activity: ActivityItem): string {
  switch (activity.action) {
    case 'add':
      return `Added new password for ${activity.target}`
    case 'update':
      return `Updated password for ${activity.target}`
    case 'edit':
      return `Edited password details for ${activity.target}`
    case 'delete':
      return `Deleted password for ${activity.target}`
    case 'generate':
      return `Generated new password for ${activity.target}`
    case 'create_note':
      return `Created new note: ${activity.target}`
    case 'edit_note':
      return `Edited note: ${activity.target}`
    case 'delete_note':
      return `Deleted note: ${activity.target}`
    case 'security_check':
      return `Ran security check`
    default:
      return `Action performed on ${activity.target}`
  }
}

export function logActivity(action: ActivityItem['action'], target: string) {
  const newActivity: ActivityItem = {
    id: Date.now(),
    action,
    target,
    date: new Date().toLocaleString(),
  }

  const currentUser = localStorage.getItem('currentUser') || 'default'
  const storedActivities = JSON.parse(localStorage.getItem(`${currentUser}_recentActivities`) || '[]')
  const updatedActivities = [newActivity, ...storedActivities.slice(0, 9)]
  localStorage.setItem(`${currentUser}_recentActivities`, JSON.stringify(updatedActivities))
}

