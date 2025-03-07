'use client'

import React, { useEffect, useState } from 'react'
import { Activity, Key, Lock, Trash2, Edit2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export interface ActivityItem {
  id: number
  action: 'add' | 'update' | 'delete'
  target: string
  date: string
}

export function RecentActivity() {
  const [activities, setActivities] = useState<ActivityItem[]>([])

  useEffect(() => {
    const storedActivities = JSON.parse(localStorage.getItem('recentActivities') || '[]')
    setActivities(storedActivities)
  }, [])

  return (
    <div className="space-y-4">
      <AnimatePresence>
        {activities.length > 0 ? (
          activities.map((activity) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="flex items-center space-x-3 p-3 bg-secondary/10 rounded-lg"
            >
              {getActivityIcon(activity.action)}
              <div>
                <p className="text-sm font-medium">{getActivityMessage(activity)}</p>
                <p className="text-xs text-muted-foreground">{activity.date}</p>
              </div>
            </motion.div>
          ))
        ) : (
          <p className="text-sm text-muted-foreground">No recent activities</p>
        )}
      </AnimatePresence>
    </div>
  )
}

function getActivityIcon(action: ActivityItem['action']) {
  switch (action) {
    case 'add':
      return <Key className="w-4 h-4 text-green-500" />
    case 'update':
      return <Edit2 className="w-4 h-4 text-blue-500" />
    case 'delete':
      return <Trash2 className="w-4 h-4 text-red-500" />
    default:
      return <Activity className="w-4 h-4 text-muted-foreground" />
  }
}

function getActivityMessage(activity: ActivityItem): string {
  switch (activity.action) {
    case 'add':
      return `Added new password for ${activity.target}`
    case 'update':
      return `Updated password for ${activity.target}`
    case 'delete':
      return `Deleted password for ${activity.target}`
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

  const storedActivities = JSON.parse(localStorage.getItem('recentActivities') || '[]')
  const updatedActivities = [newActivity, ...storedActivities.slice(0, 9)]
  localStorage.setItem('recentActivities', JSON.stringify(updatedActivities))
}

