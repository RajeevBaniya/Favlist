import * as React from "react"
import { Input } from "./input"
import { Label } from "./label"

export interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
}

const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, error, className, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        <Label htmlFor={props.id || props.name}>
          {label}
          {props.required && <span className="text-destructive ml-1">*</span>}
        </Label>
        <Input
          ref={ref}
          className={error ? "border-destructive" : ""}
          {...props}
        />
        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>
    )
  }
)

FormInput.displayName = "FormInput"

export { FormInput }

