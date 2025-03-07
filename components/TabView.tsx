import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface TabViewProps {
  tabs: {
    label: string
    content: React.ReactNode
  }[]
}

export function TabView({ tabs }: TabViewProps) {
  return (
    <Tabs defaultValue={tabs[0].label} className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        {tabs.map((tab) => (
          <TabsTrigger key={tab.label} value={tab.label}>
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {tabs.map((tab) => (
        <TabsContent key={tab.label} value={tab.label}>
          {tab.content}
        </TabsContent>
      ))}
    </Tabs>
  )
}

