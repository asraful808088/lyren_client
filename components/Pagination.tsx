'use client';

import { FC } from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center gap-4 mt-12">
      <button 
        disabled={currentPage === 1}
        onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
        className="px-6 py-2 bg-white/5 text-white text-xs uppercase tracking-widest disabled:opacity-50 hover:bg-white/10 transition-colors"
      >
        Previous
      </button>
      <span className="text-white text-xs flex items-center">
        Page {currentPage} of {totalPages}
      </span>
      <button 
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
        className="px-6 py-2 bg-white/5 text-white text-xs uppercase tracking-widest disabled:opacity-50 hover:bg-white/10 transition-colors"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
