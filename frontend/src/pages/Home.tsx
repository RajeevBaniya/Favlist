import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useInfiniteEntries } from '../hooks/useInfiniteEntries';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';
import { useDebounce } from '../hooks/useDebounce';
import { apiClient } from '../api/client';
import { EntriesTable } from '../components/Table/EntriesTable';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { FormInput } from '@/components/ui/form-input';
import { FormSelect } from '@/components/ui/form-select';
import { EntryForm } from '../components/Forms/EntryForm';
import { DeleteConfirmModal } from '../components/Modals/DeleteConfirmModal';
import type { Entry, CreateEntryInput } from '../types';

export const Home = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  
  const [searchInput, setSearchInput] = useState('');
  const [filterType, setFilterType] = useState<'ALL' | 'MOVIE' | 'TV_SHOW'>('ALL');
  const debouncedSearch = useDebounce(searchInput, 500);
  
  const { entries, loading, error, hasMore, loadMore, refresh } = useInfiniteEntries({
    search: debouncedSearch,
    type: filterType,
  });
  const loadMoreRef = useInfiniteScroll({ onLoadMore: loadMore, hasMore, loading });

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<Entry | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleAdd = async (data: CreateEntryInput) => {
    await apiClient.createEntry(data);
    setIsAddModalOpen(false);
    refresh();
  };

  const handleEdit = async (data: CreateEntryInput) => {
    if (!selectedEntry) return;
    await apiClient.updateEntry(selectedEntry.id, data);
    setIsEditModalOpen(false);
    setSelectedEntry(null);
    refresh();
  };

  const handleDelete = async () => {
    if (!selectedEntry) return;
    setDeleteLoading(true);
    try {
      await apiClient.deleteEntry(selectedEntry.id);
      setIsDeleteModalOpen(false);
      setSelectedEntry(null);
      refresh();
    } finally {
      setDeleteLoading(false);
    }
  };

  const openEditModal = (entry: Entry) => {
    setSelectedEntry(entry);
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (entry: Entry) => {
    setSelectedEntry(entry);
    setIsDeleteModalOpen(true);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-blue-50">
      {/* decorative background */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -left-24 h-64 w-64 rounded-full bg-gradient-to-tr from-indigo-400/40 to-purple-400/40 blur-3xl" />
        <div className="absolute -bottom-32 -right-24 h-80 w-80 rounded-full bg-gradient-to-tr from-blue-400/40 to-cyan-400/40 blur-3xl" />
        {/* subtle radial highlight center */}
        <div className="absolute inset-x-0 top-24 mx-auto h-[420px] w-[920px] rounded-[48px] bg-white/20 blur-2xl shadow-[0_0_60px_0_rgba(99,102,241,0.12)]" />
      </div>
      <header className="sticky top-0 z-30 bg-white/60 backdrop-blur supports-[backdrop-filter]:bg-white/50 border-b border-white/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start sm:items-center gap-3">
            <div className="h-8 w-8 rounded-md bg-gradient-to-tr from-indigo-600 to-blue-600 text-white grid place-items-center shadow-md">🎬</div>
            <div>
              <h1 className="text-lg leading-tight sm:text-2xl font-semibold sm:leading-tight">Favorite Movies & TV Shows</h1>
              <p className="text-xs sm:text-sm text-muted-foreground">Welcome back, {user?.name || user?.email}</p>
            </div>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <Button onClick={() => setIsAddModalOpen(true)} className="flex-1 sm:flex-none bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 shadow">
              Add New Entry
            </Button>
            <Button onClick={handleLogout} variant="secondary" className="flex-1 sm:flex-none">
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Search and Filter */}
        <div className="mb-6 rounded-xl border border-white/60 bg-white/80 p-4 sm:p-5 shadow-lg shadow-indigo-100/40 ring-1 ring-black/5 backdrop-blur">
          <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
            <div className="flex-1">
              <FormInput
                label=""
                name="search"
                type="text"
                placeholder="Search by title, director, or location..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </div>
            <div className="w-full sm:w-48">
              <FormSelect
                label=""
                name="type"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as 'ALL' | 'MOVIE' | 'TV_SHOW')}
                options={[
                  { value: 'ALL', label: 'All Types' },
                  { value: 'MOVIE', label: 'Movies Only' },
                  { value: 'TV_SHOW', label: 'TV Shows Only' },
                ]}
              />
            </div>
            {(searchInput || filterType !== 'ALL') && (
              <Button
                variant="secondary"
                onClick={() => {
                  setSearchInput('');
                  setFilterType('ALL');
                }}
                className="w-full sm:w-auto"
              >
                Clear Filters
              </Button>
            )}
          </div>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {entries.length === 0 && !loading ? (
          <div className="text-center py-12 rounded-xl border border-white/60 bg-white/80 ring-1 ring-black/5 shadow-md backdrop-blur">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No entries</h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by adding a new movie or TV show.
            </p>
            <div className="mt-6">
              <Button onClick={() => setIsAddModalOpen(true)} className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500">Add New Entry</Button>
            </div>
          </div>
        ) : (
          <>
            <EntriesTable
              entries={entries}
              onEdit={openEditModal}
              onDelete={openDeleteModal}
            />

            <div ref={loadMoreRef} className="py-8 text-center">
              {loading && (
                <div className="flex items-center justify-center gap-2 text-gray-600">
                  <svg
                    className="animate-spin h-5 w-5"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Loading more...
                </div>
              )}
              {!hasMore && entries.length > 0 && (
                <p className="text-gray-500">No more entries to load</p>
              )}
            </div>
          </>
        )}
      </div>

      {/* Mobile FAB */}
      <div className="fixed right-4 bottom-4 sm:hidden z-40">
        <Button onClick={() => setIsAddModalOpen(true)} className="h-12 w-12 rounded-full p-0 bg-gradient-to-r from-indigo-600 to-blue-600 shadow-lg">
          +
        </Button>
      </div>

      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Entry</DialogTitle>
          </DialogHeader>
          <EntryForm
            onSubmit={handleAdd}
            onCancel={() => setIsAddModalOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog 
        open={isEditModalOpen} 
        onOpenChange={(open) => {
          setIsEditModalOpen(open);
          if (!open) setSelectedEntry(null);
        }}
      >
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Entry</DialogTitle>
          </DialogHeader>
          <EntryForm
            entry={selectedEntry || undefined}
            onSubmit={handleEdit}
            onCancel={() => {
              setIsEditModalOpen(false);
              setSelectedEntry(null);
            }}
          />
        </DialogContent>
      </Dialog>

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        entry={selectedEntry}
        onConfirm={handleDelete}
        onCancel={() => {
          setIsDeleteModalOpen(false);
          setSelectedEntry(null);
        }}
        loading={deleteLoading}
      />
    </div>
  );
};

