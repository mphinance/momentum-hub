import React from 'react';
import { WatchlistTag } from '../types/Stock';

interface TagFilterProps {
  tags: WatchlistTag[];
  selectedTags: string[];
  onTagToggle: (tagName: string) => void;
  onClearAll: () => void;
}

export default function TagFilter({ tags, selectedTags, onTagToggle, onClearAll }: TagFilterProps) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-[#AAAAAA] text-sm font-medium">Filter:</span>
      <button
        onClick={onClearAll}
        className="px-3 py-1 text-xs bg-[#383838] text-[#AAAAAA] rounded hover:bg-[#4A4A4A] transition-colors"
      >
        All
      </button>
      {tags.map((tag) => (
        <button
          key={tag.id}
          onClick={() => onTagToggle(tag.name)}
          className={`px-3 py-1 text-xs rounded transition-colors ${
            selectedTags.includes(tag.name)
              ? 'text-[#1A1A1A] font-medium'
              : 'text-[#F0F0F0] hover:text-[#1A1A1A]'
          }`}
          style={{
            backgroundColor: selectedTags.includes(tag.name) ? tag.color : '#383838',
            borderColor: tag.color,
            borderWidth: '1px',
          }}
        >
          {tag.name}
        </button>
      ))}
    </div>
  );
}