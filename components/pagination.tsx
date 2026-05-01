'use client'

import { Button } from '@/components/ui/button'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const pageNumbers = []
  const maxPagesToShow = 5

  let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2))
  let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1)

  if (endPage - startPage + 1 < maxPagesToShow) {
    startPage = Math.max(1, endPage - maxPagesToShow + 1)
  }

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i)
  }

  return (
    <div className="flex items-center justify-center gap-2 py-8">
      <Button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        variant="outline"
        className="bg-secondary border-border text-foreground hover:bg-secondary/80 disabled:opacity-50"
      >
        Previous
      </Button>

      {startPage > 1 && (
        <>
          <Button
            onClick={() => onPageChange(1)}
            variant="outline"
            className="bg-secondary border-border text-foreground hover:bg-secondary/80"
          >
            1
          </Button>
          {startPage > 2 && <span className="text-foreground">...</span>}
        </>
      )}

      {pageNumbers.map((page) => (
        <Button
          key={page}
          onClick={() => onPageChange(page)}
          className={
            page === currentPage
              ? 'bg-primary text-primary-foreground'
              : 'bg-secondary border-border text-foreground hover:bg-secondary/80'
          }
        >
          {page}
        </Button>
      ))}

      {endPage < totalPages && (
        <>
          {endPage < totalPages - 1 && <span className="text-foreground">...</span>}
          <Button
            onClick={() => onPageChange(totalPages)}
            variant="outline"
            className="bg-secondary border-border text-foreground hover:bg-secondary/80"
          >
            {totalPages}
          </Button>
        </>
      )}

      <Button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        variant="outline"
        className="bg-secondary border-border text-foreground hover:bg-secondary/80 disabled:opacity-50"
      >
        Next
      </Button>
    </div>
  )
}
