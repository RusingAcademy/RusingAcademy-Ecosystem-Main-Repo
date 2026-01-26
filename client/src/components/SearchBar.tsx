import { useState, useRef, useEffect, useCallback } from "react";
import { Search, X, Loader2, User, FileText, HelpCircle, BookOpen } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import { useDebounce } from "@/hooks/useDebounce";

interface SearchResult {
  id: string;
  type: "coach" | "course" | "page" | "faq";
  title: string;
  description: string;
  url: string;
  imageUrl?: string;
  score: number;
}

interface SearchBarProps {
  className?: string;
  placeholder?: string;
  onClose?: () => void;
  autoFocus?: boolean;
  variant?: "default" | "header" | "modal";
}

const typeIcons = {
  coach: User,
  course: BookOpen,
  page: FileText,
  faq: HelpCircle,
};

const typeLabels = {
  coach: "Coach",
  course: "Course",
  page: "Page",
  faq: "FAQ",
};

export function SearchBar({
  className,
  placeholder = "Search coaches, courses, pages...",
  onClose,
  autoFocus = false,
  variant = "default",
}: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const [, setLocation] = useLocation();
  
  const debouncedQuery = useDebounce(query, 300);
  
  // Search query
  const { data: searchResults, isLoading } = trpc.search.query.useQuery(
    { query: debouncedQuery, limit: 10 },
    { enabled: debouncedQuery.length >= 2 }
  );
  
  const results = searchResults?.results || [];
  const suggestions = searchResults?.suggestions || [];
  
  // Handle keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!isOpen) return;
    
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < results.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0 && results[selectedIndex]) {
          navigateToResult(results[selectedIndex]);
        }
        break;
      case "Escape":
        e.preventDefault();
        setIsOpen(false);
        onClose?.();
        break;
    }
  }, [isOpen, results, selectedIndex, onClose]);
  
  // Navigate to result
  const navigateToResult = (result: SearchResult) => {
    setLocation(result.url);
    setQuery("");
    setIsOpen(false);
    onClose?.();
  };
  
  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        resultsRef.current &&
        !resultsRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  
  // Open dropdown when typing
  useEffect(() => {
    if (query.length >= 2) {
      setIsOpen(true);
      setSelectedIndex(-1);
    } else {
      setIsOpen(false);
    }
  }, [query]);
  
  // Auto focus
  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);
  
  const variantStyles = {
    default: "w-full max-w-md",
    header: "w-64 lg:w-80",
    modal: "w-full",
  };
  
  return (
    <div className={cn("relative", variantStyles[variant], className)}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => query.length >= 2 && setIsOpen(true)}
          placeholder={placeholder}
          className={cn(
            "pl-10 pr-10",
            variant === "header" && "h-9 bg-muted/50",
            variant === "modal" && "h-12 text-lg"
          )}
        />
        {query && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
            onClick={() => {
              setQuery("");
              inputRef.current?.focus();
            }}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
        {isLoading && (
          <Loader2 className="absolute right-10 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
        )}
      </div>
      
      {/* Results dropdown */}
      {isOpen && (
        <div
          ref={resultsRef}
          className={cn(
            "absolute top-full left-0 right-0 mt-2 bg-popover border rounded-lg shadow-lg z-50 overflow-hidden",
            variant === "modal" && "max-h-[60vh]",
            variant !== "modal" && "max-h-[400px]"
          )}
        >
          {results.length > 0 ? (
            <div className="overflow-y-auto">
              {/* Group results by type */}
              {["coach", "page", "faq", "course"].map((type) => {
                const typeResults = results.filter(r => r.type === type);
                if (typeResults.length === 0) return null;
                
                const Icon = typeIcons[type as keyof typeof typeIcons];
                
                return (
                  <div key={type}>
                    <div className="px-3 py-2 text-xs font-semibold text-muted-foreground bg-muted/50 sticky top-0">
                      {typeLabels[type as keyof typeof typeLabels]}s
                    </div>
                    {typeResults.map((result, idx) => {
                      const globalIndex = results.indexOf(result);
                      return (
                        <button
                          key={result.id}
                          className={cn(
                            "w-full px-3 py-2 flex items-start gap-3 hover:bg-accent text-left transition-colors",
                            selectedIndex === globalIndex && "bg-accent"
                          )}
                          onClick={() => navigateToResult(result)}
                          onMouseEnter={() => setSelectedIndex(globalIndex)}
                        >
                          {result.imageUrl ? (
                            <img
                              src={result.imageUrl}
                              alt=""
                              className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                              <Icon className="h-5 w-5 text-muted-foreground" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-sm truncate">
                              {result.title}
                            </div>
                            <div className="text-xs text-muted-foreground line-clamp-2">
                              {result.description}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          ) : query.length >= 2 && !isLoading ? (
            <div className="p-4 text-center text-muted-foreground">
              <p className="text-sm">No results found for "{query}"</p>
              {suggestions.length > 0 && (
                <div className="mt-3">
                  <p className="text-xs mb-2">Try searching for:</p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {suggestions.map((suggestion, idx) => (
                      <button
                        key={idx}
                        className="text-xs px-2 py-1 bg-muted rounded-full hover:bg-accent transition-colors"
                        onClick={() => setQuery(suggestion)}
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : null}
          
          {/* Keyboard hints */}
          {results.length > 0 && (
            <div className="px-3 py-2 border-t bg-muted/30 flex items-center gap-4 text-xs text-muted-foreground">
              <span><kbd className="px-1 py-0.5 bg-muted rounded text-[10px]">↑↓</kbd> Navigate</span>
              <span><kbd className="px-1 py-0.5 bg-muted rounded text-[10px]">Enter</kbd> Select</span>
              <span><kbd className="px-1 py-0.5 bg-muted rounded text-[10px]">Esc</kbd> Close</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default SearchBar;
