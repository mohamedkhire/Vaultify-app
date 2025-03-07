import { useState } from 'react'
import { Plus, X } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface CategoryManagerProps {
  categories: string[]
  selectedCategory: string | null
  onSelectCategory: (category: string | null) => void
  onAddCategory: (category: string) => void
  onRemoveCategory: (category: string) => void
}

export function CategoryManager({ 
  categories, 
  selectedCategory, 
  onSelectCategory, 
  onAddCategory, 
  onRemoveCategory 
}: CategoryManagerProps) {
  const [newCategory, setNewCategory] = useState('')

  const handleAddCategory = () => {
    if (newCategory.trim() && !categories.includes(newCategory.trim())) {
      onAddCategory(newCategory.trim())
      setNewCategory('')
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex space-x-2">
        <Input
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          placeholder="New category"
          className="flex-grow"
        />
        <Button onClick={handleAddCategory} size="icon">
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <Badge 
            key={category} 
            variant={selectedCategory === category ? "secondary" : "outline"}
            className="cursor-pointer flex items-center"
          >
            <span onClick={() => onSelectCategory(category === selectedCategory ? null : category)}>{category}</span>
            {category !== 'All' && category !== 'Uncategorized' && (
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 ml-1 hover:bg-transparent"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveCategory(category);
                }}
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </Badge>
        ))}
      </div>
    </div>
  )
}

