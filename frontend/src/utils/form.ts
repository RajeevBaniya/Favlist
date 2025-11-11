import type { Entry, CreateEntryInput } from '../types';

// Pure form data transformation functions
const createInitialFormData = (entry?: Entry): CreateEntryInput => ({
  title: entry?.title || '',
  type: entry?.type || 'MOVIE',
  director: entry?.director || '',
  budget: entry?.budget || '',
  location: entry?.location || '',
  duration: entry?.duration || '',
  yearTime: entry?.yearTime || '',
  posterUrl: entry?.posterUrl || '',
});

const updateFormField = <T extends Record<string, any>>(
  formData: T,
  fieldName: keyof T,
  value: T[keyof T]
): T => ({
  ...formData,
  [fieldName]: value,
});

const clearFieldError = (
  errors: Record<string, string>,
  fieldName: string
): Record<string, string> => {
  const { [fieldName]: _, ...remainingErrors } = errors;
  return remainingErrors;
};

const resetFormState = <T>(initialData: T) => ({
  data: initialData,
  errors: {} as Record<string, string>,
  loading: false,
  submitError: null as string | null,
});

// Form event handlers (pure functions)
const createFieldChangeHandler = <T extends Record<string, any>>(
  formData: T,
  errors: Record<string, string>,
  setFormData: (data: T) => void,
  setErrors: (errors: Record<string, string>) => void
) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
  const { name, value } = e.target;
  
  // Update form data immutably
  const updatedData = updateFormField(formData, name as keyof T, value);
  setFormData(updatedData);
  
  // Clear field error if it exists
  if (errors[name]) {
    const updatedErrors = clearFieldError(errors, name);
    setErrors(updatedErrors);
  }
};

// Export individual functions
export {
  createInitialFormData,
  updateFormField,
  clearFieldError,
  resetFormState,
  createFieldChangeHandler,
};

// Default export object
const formUtils = {
  createInitialFormData,
  updateFormField,
  clearFieldError,
  resetFormState,
  createFieldChangeHandler,
};

export default formUtils;
