'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Progress } from "./ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { Shield, TrendingUp, AlertTriangle, Activity, Lock, Key } from 'lucide-react'
import { ResponsiveBar } from '@nivo/bar'
import { ResponsivePie } from '@nivo/pie'
import { PasswordStrengthDistribution } from './password-strength-distribution'
import { RecentActivity } from './recent-activity'
import { usePasswords } from '@/hooks/use-passwords'

export function Dashboard() {
  const { passwords, loading, findReusedPasswords } = usePasswords()
  const [animationComplete, setAnimationComplete] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setAnimationComplete(true), 600)
    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return <div>Loading...</div>
  }

  const totalPasswords = passwords.length
  const weakPasswords = passwords.filter(pw => pw.strength < 60).length
  const reusedPasswords = findReusedPasswords()
  const averageStrength = passwords.reduce((sum, pw) => sum + pw.strength, 0) / totalPasswords

  const strengthDistribution = [
    { id: 'Weak', value: weakPasswords },
    { id: 'Medium', value: passwords.filter(pw => pw.strength >= 60 && pw.strength < 80).length },
    { id: 'Strong', value: passwords.filter(pw => pw.strength >= 80).length },
  ]

  const categoryDistribution = passwords.reduce((acc, pw) => {
    acc[pw.category] = (acc[pw.category] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const categoryData = Object.entries(categoryDistribution).map(([category, count]) => ({
    category,
    count,
  }))

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Passwords"
          value={totalPasswords}
          icon={<Key className="h-4 w-4" />}
          color="blue"
        />
        <StatCard
          title="Weak Passwords"
          value={weakPasswords}
          icon={<AlertTriangle className="h-4 w-4" />}
          color="yellow"
        />
        <StatCard
          title="Reused Passwords"
          value={reusedPasswords.length}
          icon={<Lock className="h-4 w-4" />}
          color="red"
        />
        <StatCard
          title="Average Strength"
          value={`${averageStrength.toFixed(0)}%`}
          icon={<Shield className="h-4 w-4" />}
          color="green"
          progress={averageStrength}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Password Strength Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              {animationComplete && (
                <ResponsivePie
                  data={strengthDistribution}
                  margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
                  innerRadius={0.5}
                  padAngle={0.7}
                  cornerRadius={3}
                  activeOuterRadiusOffset={8}
                  colors={{ scheme: 'set3' }}
                  borderWidth={1}
                  borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
                  arcLinkLabelsSkipAngle={10}
                  arcLinkLabelsTextColor={{ from: 'color', modifiers: [] }}
                  arcLinkLabelsThickness={2}
                  arcLinkLabelsColor={{ from: 'color' }}
                  arcLabelsSkipAngle={10}
                  arcLabelsTextColor={{ from: 'color', modifiers: [['darker', 2]] }}
                  legends={[
                    {
                      anchor: 'bottom',
                      direction: 'row',
                      justify: false,
                      translateX: 0,
                      translateY: 56,
                      itemsSpacing: 0,
                      itemWidth: 100,
                      itemHeight: 18,
                      itemTextColor: '#999',
                      itemDirection: 'left-to-right',
                      itemOpacity: 1,
                      symbolSize: 18,
                      symbolShape: 'circle',
                    }
                  ]}
                />
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Password Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              {animationComplete && (
                <ResponsiveBar
                  data={categoryData}
                  keys={['count']}
                  indexBy="category"
                  margin={{ top: 50, right: 60, bottom: 50, left: 60 }}
                  padding={0.3}
                  valueScale={{ type: 'linear' }}
                  indexScale={{ type: 'band', round: true }}
                  colors={{ scheme: 'nivo' }}
                  borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
                  axisTop={null}
                  axisRight={null}
                  axisBottom={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: 'Category',
                    legendPosition: 'middle',
                    legendOffset: 32
                  }}
                  axisLeft={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: 'Count',
                    legendPosition: 'middle',
                    legendOffset: -40
                  }}
                  labelSkipWidth={12}
                  labelSkipHeight={12}
                  labelTextColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
                  animate={true}
                  motionStiffness={90}
                  motionDamping={15}
                />
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="activity" className="w-full">
        <TabsList>
          <TabsTrigger value="activity">Recent Activity</TabsTrigger>
        </TabsList>
        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <RecentActivity />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  )
}

function StatCard({ title, value, icon, color, progress }: { title: string; value: string | number; icon: React.ReactNode; color: string; progress?: number }) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
          <span className={`text-2xl font-bold text-${color}-500`}>{value}</span>
        </div>
        <div className="flex items-center justify-between">
          {icon}
          {progress !== undefined && (
            <Progress value={progress} className="w-2/3" indicatorColor={color} />
          )}
        </div>
      </CardContent>
    </Card>
  )
}

