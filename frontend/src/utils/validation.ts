import type { CreateEntryInput } from '../types';

// Pure validation functions
const isRequired = (value: string): boolean => value.trim().length > 0;

const validateField = (value: string, fieldName: string): string | null =>
  isRequired(value) ? null : `${fieldName} is required`;

const validateTitle = (title: string): string | null =>
  validateField(title, 'Title');

const validateType = (type: string): string | null =>
  validateField(type, 'Type');

const validateDirector = (director: string): string | null =>
  validateField(director, 'Director');

const validateBudget = (budget: string): string | null =>
  validateField(budget, 'Budget');

const validateLocation = (location: string): string | null =>
  validateField(location, 'Location');

const validateDuration = (duration: string): string | null =>
  validateField(duration, 'Duration');

const validateYearTime = (yearTime: string): string | null =>
  validateField(yearTime, 'Year/Time');

// Compose validation functions
const validateEntryForm = (data: CreateEntryInput): Record<string, string> => {
  const validationRules = [
    { field: 'title', validator: validateTitle, value: data.title },
    { field: 'type', validator: validateType, value: data.type },
    { field: 'director', validator: validateDirector, value: data.director },
    { field: 'budget', validator: validateBudget, value: data.budget },
    { field: 'location', validator: validateLocation, value: data.location },
    { field: 'duration', validator: validateDuration, value: data.duration },
    { field: 'yearTime', validator: validateYearTime, value: data.yearTime },
  ];

  return validationRules.reduce((errors, { field, validator, value }) => {
    const error = validator(value);
    return error ? { ...errors, [field]: error } : errors;
  }, {} as Record<string, string>);
};

const isValidForm = (errors: Record<string, string>): boolean =>
  Object.keys(errors).length === 0;

// Export individual functions
export {
  validateEntryForm,
  isValidForm,
  validateTitle,
  validateType,
  validateDirector,
  validateBudget,
  validateLocation,
  validateDuration,
  validateYearTime,
};

// Default export object
const validation = {
  validateEntryForm,
  isValidForm,
  validateTitle,
  validateType,
  validateDirector,
  validateBudget,
  validateLocation,
  validateDuration,
  validateYearTime,
};

export default validation;
