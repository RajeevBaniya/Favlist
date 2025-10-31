import * as React from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select"
import { Label } from "./label"

export interface FormSelectProps {
  label: string
  error?: string
  options: { value: string; label: string }[]
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void
  name?: string
  required?: boolean
  disabled?: boolean
}

const FormSelect = React.forwardRef<HTMLButtonElement, FormSelectProps>(
  ({ label, error, options, value, onChange, name, required, disabled }, ref) => {
    const handleValueChange = (newValue: string) => {
      if (onChange && name) {
        const syntheticEvent = {
          target: { name, value: newValue },
        } as React.ChangeEvent<HTMLSelectElement>
        onChange(syntheticEvent)
      }
    }

    return (
      <div className="flex flex-col gap-1.5">
        <Label>
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </Label>
        <Select value={value} onValueChange={handleValueChange} disabled={disabled}>
          <SelectTrigger ref={ref} className={error ? "border-destructive" : ""}>
            <SelectValue placeholder={`Select ${label}`} />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>
    )
  }
)

FormSelect.displayName = "FormSelect"

export { FormSelect }

