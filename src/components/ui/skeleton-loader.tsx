'use client'

export function DocumentSkeleton() {
  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-slate-100">
      {/* Preview header bar skeleton */}
      <div className="h-9 bg-white border-b border-gray-200 flex items-center px-4 gap-3 flex-shrink-0">
        <div className="h-3 w-24 bg-gray-200 rounded animate-pulse" />
        <div className="h-3 w-32 bg-gray-100 rounded animate-pulse" />
      </div>
      {/* Toolbar skeleton */}
      <div className="h-10 bg-white border-b border-gray-100 flex items-center px-4 gap-2 flex-shrink-0">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-6 w-6 bg-gray-100 rounded animate-pulse" />
        ))}
      </div>
      {/* Document canvas skeleton */}
      <div className="flex-1 overflow-auto p-6">
        <div className="mx-auto bg-white rounded-lg shadow-lg animate-pulse" style={{ width: 436, minHeight: 617 }}>
          {/* Header area */}
          <div className="p-8 space-y-4">
            <div className="flex items-center justify-between">
              <div className="h-10 w-20 bg-gray-200 rounded" />
              <div className="space-y-1 text-right">
                <div className="h-3 w-32 bg-gray-200 rounded ml-auto" />
                <div className="h-2 w-24 bg-gray-100 rounded ml-auto" />
              </div>
            </div>
            <div className="h-1 w-full bg-gray-200 rounded" />
          </div>
          {/* Body area */}
          <div className="px-8 space-y-3">
            <div className="h-3 w-3/4 bg-gray-200 rounded" />
            <div className="h-3 w-full bg-gray-100 rounded" />
            <div className="h-3 w-full bg-gray-100 rounded" />
            <div className="h-3 w-5/6 bg-gray-100 rounded" />
            <div className="h-6" />
            <div className="h-3 w-full bg-gray-100 rounded" />
            <div className="h-3 w-2/3 bg-gray-100 rounded" />
            <div className="h-3 w-full bg-gray-100 rounded" />
            <div className="h-3 w-4/5 bg-gray-100 rounded" />
          </div>
          {/* Footer area */}
          <div className="p-8 mt-8 space-y-2">
            <div className="h-px w-full bg-gray-200" />
            <div className="h-2 w-48 bg-gray-100 rounded mx-auto" />
          </div>
        </div>
      </div>
    </div>
  )
}

export function FormSkeleton() {
  return (
    <div className="p-4 space-y-4 animate-pulse">
      {/* Employee select */}
      <div className="space-y-2">
        <div className="h-2.5 w-20 bg-gray-200 rounded" />
        <div className="h-9 w-full bg-gray-100 rounded-md border border-gray-200" />
      </div>
      {/* Section header */}
      <div className="h-px w-full bg-gray-200" />
      <div className="space-y-3">
        <div className="h-2 w-16 bg-gray-200 rounded" />
        <div className="grid grid-cols-2 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-1.5">
              <div className="h-2 w-12 bg-gray-200 rounded" />
              <div className="h-8 bg-gray-100 rounded-md border border-gray-200" />
            </div>
          ))}
        </div>
      </div>
      {/* Section header */}
      <div className="h-px w-full bg-gray-200" />
      <div className="space-y-3">
        <div className="h-2 w-12 bg-gray-200 rounded" />
        <div className="grid grid-cols-2 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-1.5">
              <div className="h-2 w-14 bg-gray-200 rounded" />
              <div className="h-8 bg-gray-100 rounded-md border border-gray-200" />
            </div>
          ))}
        </div>
      </div>
      {/* Button */}
      <div className="h-9 w-full bg-gray-200 rounded-md" />
    </div>
  )
}

export function TableSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      {/* Search + button row */}
      <div className="flex items-center justify-between">
        <div className="h-9 w-80 bg-gray-100 rounded-md border border-gray-200" />
        <div className="h-9 w-40 bg-gray-200 rounded-md" />
      </div>
      {/* Table */}
      <div className="border rounded-lg overflow-hidden">
        {/* Header */}
        <div className="h-10 bg-gray-50 border-b border-gray-200 flex items-center px-4 gap-6">
          <div className="h-3 w-16 bg-gray-200 rounded" />
          <div className="h-3 w-24 bg-gray-200 rounded" />
          <div className="h-3 w-20 bg-gray-200 rounded" />
          <div className="h-3 w-20 bg-gray-200 rounded" />
          <div className="h-3 w-16 bg-gray-200 rounded ml-auto" />
        </div>
        {/* Rows */}
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="h-12 border-b border-gray-100 flex items-center px-4 gap-6"
          >
            <div className="h-3 w-14 bg-gray-100 rounded" />
            <div className="h-3 w-28 bg-gray-100 rounded" />
            <div className="h-3 w-20 bg-gray-100 rounded" />
            <div className="h-3 w-16 bg-gray-100 rounded" />
            <div className="h-5 w-14 bg-gray-100 rounded-full ml-auto" />
          </div>
        ))}
      </div>
      {/* Footer count */}
      <div className="h-3 w-28 bg-gray-100 rounded" />
    </div>
  )
}
