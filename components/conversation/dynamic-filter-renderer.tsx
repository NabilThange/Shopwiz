"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { FollowUpQuestion } from "@/lib/groq-integration"
import { AlertCircle } from "lucide-react"

interface DynamicFilterRendererProps {
  question: FollowUpQuestion
  onResponse: (facet: string, value: any) => void
}

export function DynamicFilterRenderer({ question, onResponse }: DynamicFilterRendererProps) {
  // Comprehensive type mapping and fallback
  const normalizeQuestionType = (type: string): FollowUpQuestion['type'] => {
    const typeMap: Record<string, FollowUpQuestion['type']> = {
      'slider': 'range',
      'select': 'dropdown',
      'multi-select': 'checkbox',
      'choice': 'radio'
    }
    return typeMap[type] || type as FollowUpQuestion['type']
  }

  // Safety check for undefined or malformed question
  if (!question || !question.type) {
    return (
      <div className="text-center text-red-500 p-4 bg-red-50 rounded-lg">
        <AlertCircle className="mx-auto mb-2" />
        <p>Oops! Something went wrong with generating questions.</p>
        <Button 
          onClick={() => onResponse('fallback', 'skip')} 
          className="mt-2 bg-purple-400 hover:bg-purple-500"
        >
          Continue Anyway
        </Button>
      </div>
    )
  }

  // Normalize the question type
  const normalizedType = normalizeQuestionType(question.type)

  // State management
  const [selectedValue, setSelectedValue] = useState<any>(null)
  const [priceRange, setPriceRange] = useState<[number, number]>([
    question.min || 0, 
    question.max || 50000
  ])
  const [selectedOptions, setSelectedOptions] = useState<string[]>([])

  // Ensure options exist with a fallback
  const safeOptions = question.options || []

  const handleSubmit = () => {
    let value = selectedValue

    if (normalizedType === "range") {
      value = { 
        min: priceRange[0], 
        max: priceRange[1] 
      }
    } else if (normalizedType === "checkbox") {
      value = selectedOptions
    }

    if (value !== null && value !== undefined) {
      onResponse(question.facet, value)
    }
  }

  const isValid = () => {
    if (normalizedType === "range") return true
    if (normalizedType === "checkbox") return selectedOptions.length > 0
    return selectedValue !== null && selectedValue !== undefined
  }

  // Render different question types
  switch (normalizedType) {
    case "range":
      return (
        <div className="space-y-4">
          <h4 className="font-bold text-lg">{question.question}</h4>

          <div className="space-y-4">
            <div className="px-4">
              <Slider
                value={priceRange}
                onValueChange={(value) => setPriceRange(value as [number, number])}
                max={question.max || 100000}
                min={question.min || 0}
                step={500}
                className="w-full"
              />
            </div>

            <div className="flex justify-between text-sm font-medium">
              <span>₹{priceRange[0].toLocaleString()}</span>
              <span>₹{priceRange[1].toLocaleString()}</span>
            </div>

            {/* Quick price options */}
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPriceRange([0, 2000])}
                className="border-2 border-black hover:bg-yellow-100"
              >
                Under ₹2k
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPriceRange([2000, 5000])}
                className="border-2 border-black hover:bg-yellow-100"
              >
                ₹2k - ₹5k
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPriceRange([5000, 10000])}
                className="border-2 border-black hover:bg-yellow-100"
              >
                ₹5k - ₹10k
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPriceRange([10000, 50000])}
                className="border-2 border-black hover:bg-yellow-100"
              >
                Above ₹10k
              </Button>
            </div>
          </div>

          <Button
            onClick={handleSubmit}
            className="w-full bg-purple-400 hover:bg-purple-500 border-2 border-black font-bold"
          >
            Set Budget Range
          </Button>
        </div>
      )

    case "checkbox":
      return (
        <div className="space-y-4">
          <h4 className="font-bold text-lg">{question.question}</h4>

          <div className="space-y-3">
            {safeOptions.map((option) => (
              <div key={option} className="flex items-center space-x-2">
                <Checkbox
                  id={option}
                  checked={selectedOptions.includes(option)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedOptions([...selectedOptions, option])
                    } else {
                      setSelectedOptions(selectedOptions.filter((o) => o !== option))
                    }
                  }}
                  className="border-2 border-black"
                />
                <Label htmlFor={option} className="font-medium cursor-pointer">
                  {option}
                </Label>
              </div>
            ))}
          </div>

          <Button
            onClick={handleSubmit}
            disabled={!isValid()}
            className="w-full bg-purple-400 hover:bg-purple-500 border-2 border-black font-bold disabled:opacity-50"
          >
            Continue ({selectedOptions.length} selected)
          </Button>
        </div>
      )

    case "radio":
      return (
        <div className="space-y-4">
          <h4 className="font-bold text-lg">{question.question}</h4>

          <RadioGroup value={selectedValue} onValueChange={setSelectedValue}>
            <div className="space-y-3">
              {safeOptions.map((option) => (
                <div key={option} className="flex items-center space-x-2">
                  <RadioGroupItem value={option} id={option} className="border-2 border-black" />
                  <Label htmlFor={option} className="font-medium cursor-pointer">
                    {option}
                  </Label>
                </div>
              ))}
            </div>
          </RadioGroup>

          <Button
            onClick={handleSubmit}
            disabled={!isValid()}
            className="w-full bg-purple-400 hover:bg-purple-500 border-2 border-black font-bold disabled:opacity-50"
          >
            Continue
          </Button>
        </div>
      )

    case "dropdown":
      return (
        <div className="space-y-4">
          <h4 className="font-bold text-lg">{question.question}</h4>

          <Select 
            value={selectedValue} 
            onValueChange={setSelectedValue}
          >
            <SelectTrigger className="w-full border-2 border-black">
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent>
              {safeOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            onClick={handleSubmit}
            disabled={!isValid()}
            className="w-full bg-purple-400 hover:bg-purple-500 border-2 border-black font-bold disabled:opacity-50"
          >
            Continue
          </Button>
        </div>
      )

    case "swatch":
      const colorMap: Record<string, string> = {
        Black: "bg-black",
        White: "bg-white border-gray-300",
        Silver: "bg-gray-300",
        Gold: "bg-yellow-400",
        Blue: "bg-blue-500",
        Brown: "bg-amber-700",
        Red: "bg-red-500",
        Green: "bg-green-500",
        "No preference": "bg-gradient-to-r from-red-500 via-yellow-500 to-blue-500",
      }

      return (
        <div className="space-y-4">
          <h4 className="font-bold text-lg">{question.question}</h4>

          <div className="grid grid-cols-4 gap-3">
            {safeOptions.map((color) => (
              <button
                key={color}
                onClick={() => setSelectedValue(color)}
                className={`w-12 h-12 rounded-full border-2 border-black ${colorMap[color] || "bg-gray-200"} ${
                  selectedValue === color ? "ring-4 ring-purple-400" : ""
                } hover:scale-110 transition-transform`}
                title={color}
              />
            ))}
          </div>

          <div className="text-center text-sm font-medium">
            {selectedValue ? `Selected: ${selectedValue}` : "Choose an option"}
          </div>

          <Button
            onClick={handleSubmit}
            disabled={!isValid()}
            className="w-full bg-purple-400 hover:bg-purple-500 border-2 border-black font-bold disabled:opacity-50"
          >
            Continue
          </Button>
        </div>
      )

    default:
      return (
        <div className="text-center text-red-500 p-4 bg-red-50 rounded-lg">
          <AlertCircle className="mx-auto mb-2" />
          <p>Unsupported question type: {question.type}</p>
          <pre className="text-xs mt-2">
            {JSON.stringify(question, null, 2)}
          </pre>
          <Button 
            onClick={() => onResponse('fallback', 'skip')} 
            className="mt-2 bg-purple-400 hover:bg-purple-500"
          >
            Skip Question
          </Button>
        </div>
      )
  }
}
