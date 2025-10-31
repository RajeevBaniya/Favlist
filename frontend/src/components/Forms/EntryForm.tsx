import { useState, FormEvent } from 'react';
import type { Entry, CreateEntryInput } from '../../types';
import { FormInput } from '@/components/ui/form-input';
import { FormSelect } from '@/components/ui/form-select';
import { Button } from '@/components/ui/button';

interface EntryFormProps {
  entry?: Entry;
  onSubmit: (data: CreateEntryInput) => Promise<void>;
  onCancel: () => void;
}

export const EntryForm = ({ entry, onSubmit, onCancel }: EntryFormProps) => {
  const [formData, setFormData] = useState<CreateEntryInput>({
    title: entry?.title || '',
    type: entry?.type || 'MOVIE',
    director: entry?.director || '',
    budget: entry?.budget || '',
    location: entry?.location || '',
    duration: entry?.duration || '',
    yearTime: entry?.yearTime || '',
    posterUrl: entry?.posterUrl || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.type) newErrors.type = 'Type is required';
    if (!formData.director.trim()) newErrors.director = 'Director is required';
    if (!formData.budget.trim()) newErrors.budget = 'Budget is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.duration.trim()) newErrors.duration = 'Duration is required';
    if (!formData.yearTime.trim()) newErrors.yearTime = 'Year/Time is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!validate()) return;

    setLoading(true);
    try {
      await onSubmit(formData);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Failed to submit');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {submitError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {submitError}
        </div>
      )}

      <FormInput
        label="Title"
        name="title"
        value={formData.title}
        onChange={handleChange}
        error={errors.title}
        required
        placeholder="e.g., Inception"
      />

      <FormSelect
        label="Type"
        name="type"
        value={formData.type}
        onChange={handleChange}
        error={errors.type}
        required
        options={[
          { value: 'MOVIE', label: 'Movie' },
          { value: 'TV_SHOW', label: 'TV Show' },
        ]}
      />

      <FormInput
        label="Director"
        name="director"
        value={formData.director}
        onChange={handleChange}
        error={errors.director}
        required
        placeholder="e.g., Christopher Nolan"
      />

      <FormInput
        label="Budget"
        name="budget"
        value={formData.budget}
        onChange={handleChange}
        error={errors.budget}
        required
        placeholder="e.g., $160 million"
      />

      <FormInput
        label="Location"
        name="location"
        value={formData.location}
        onChange={handleChange}
        error={errors.location}
        required
        placeholder="e.g., Los Angeles, Paris"
      />

      <FormInput
        label="Duration"
        name="duration"
        value={formData.duration}
        onChange={handleChange}
        error={errors.duration}
        required
        placeholder="e.g., 148 min or 50 min/episode"
      />

      <FormInput
        label="Year/Time"
        name="yearTime"
        value={formData.yearTime}
        onChange={handleChange}
        error={errors.yearTime}
        required
        placeholder="e.g., 2010 or 2016-present"
      />

      <FormInput
        label="Poster URL (Optional)"
        name="posterUrl"
        type="url"
        value={formData.posterUrl}
        onChange={handleChange}
        placeholder="https://example.com/poster.jpg"
      />

      <div className="flex gap-3 pt-4">
        <Button type="submit" className="flex-1">
          {entry ? 'Update Entry' : 'Add Entry'}
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
      </div>
    </form>
  );
};

