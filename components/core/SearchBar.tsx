"use client";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from "@/components/ui/command";
import { DialogTitle } from "@/components/ui/search-dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import algoliasearch from "algoliasearch/lite";
import {
  ClipboardCheck,
  FileText,
  Library,
  SearchIcon,
  Youtube,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type HighlightMatch = {
  value: string;
  matchLevel: "none" | "partial" | "full";
  matchedWords: string[];
};
type HighlightResult<T> = { [K in keyof T]?: HighlightMatch };
type BaseHit = {
  objectID: string;
  title: string;
  abbreviation?: string;
};
type AlgoliaHit =
  | (BaseHit & { type: "subject"; code: string; path: string })
  | (BaseHit & { type: "note"; description: string; path: string })
  | (BaseHit & { type: "quiz"; url: string })
  | (BaseHit & { type: "youtube"; path: string });
type AppHit = AlgoliaHit & { _highlightResult?: HighlightResult<AlgoliaHit> };

const searchClient = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID!,
  process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY!
);
const index = searchClient.initIndex(
  process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME!
);

const Highlight = ({
  hit,
  attribute,
}: {
  hit: AppHit;
  attribute: keyof BaseHit;
}) => {
  const highlightedValue = hit._highlightResult?.[attribute]?.value;
  const originalValue = hit[attribute];
  if (!highlightedValue) {
    return <span>{originalValue}</span>;
  }
  return <span dangerouslySetInnerHTML={{ __html: highlightedValue }} />;
};

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export default function SearchBar() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [hits, setHits] = useState<AppHit[]>([]);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const fetchResults = useCallback(async (q: string) => {
    if (!q.trim()) {
      setHits([]);
      return;
    }
    setLoading(true);
    try {
      const result = await index.search<AlgoliaHit>(q, { hitsPerPage: 6 });
      setHits(result.hits as AppHit[]);
    } catch (err) {
      console.error("Algolia search error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!query.trim()) {
      setHits([]);
      return;
    }
    debounceRef.current = setTimeout(() => fetchResults(query), 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, fetchResults]);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const handleSelect = (hit: AlgoliaHit) => {
    setOpen(false);
    setQuery("");
    switch (hit.type) {
      case "subject":
      case "note":
      case "youtube":
        router.push(hit.path);
        break;
      case "quiz":
        window.open(hit.url, "_blank", "noopener,noreferrer");
        break;
    }
  };

  const groupedHits = useMemo(() => {
    return hits.reduce(
      (acc, hit) => {
        const { type } = hit;
        if (!acc[type]) {
          acc[type] = [];
        }
        acc[type].push(hit);
        return acc;
      },
      {} as Record<AlgoliaHit["type"], AppHit[]>
    );
  }, [hits]);

  const renderHitContent = (hit: AppHit) => {
    switch (hit.type) {
      case "subject":
        return (
          <>
            <Library
              className="mr-3 h-4 w-4 text-muted-foreground"
              aria-hidden="true"
            />
            <span className="flex-grow">
              <Highlight hit={hit} attribute="title" />
            </span>
            <CommandShortcut>Code: {hit.code}</CommandShortcut>
          </>
        );
      case "note":
        return (
          <>
            <FileText
              className="mr-3 h-4 w-4 text-muted-foreground"
              aria-hidden="true"
            />
            <span className="flex-grow truncate">
              <Highlight hit={hit} attribute="title" />
            </span>
            <CommandShortcut>{hit.abbreviation}</CommandShortcut>
          </>
        );
      case "quiz":
        return (
          <>
            <ClipboardCheck
              className="mr-3 h-4 w-4 text-muted-foreground"
              aria-hidden="true"
            />
            <span className="flex-grow">
              <Highlight hit={hit} attribute="title" />
            </span>
          </>
        );
      case "youtube":
        return (
          <>
            <Youtube
              className="mr-3 h-4 w-4 text-muted-foreground"
              aria-hidden="true"
            />
            <span className="flex-grow">
              <Highlight hit={hit} attribute="title" />
            </span>
            <CommandShortcut>
              Video in {hit.abbreviation?.toUpperCase()}
            </CommandShortcut>
          </>
        );
    }
  };

  return (
    <>
      <button
        className="hidden lg:inline-flex bg-background items-center text-foreground placeholder:text-muted-foreground/70 focus-visible:border-ring focus-visible:ring-ring/50 h-9 rounded-md border border-neutral-300 dark:border-neutral-800 px-3 py-2 text-sm shadow-xs outline-none focus-visible:ring-[3px]"
        onClick={() => setOpen(true)}
      >
        <SearchIcon className="text-muted-foreground/80 -ms-1 me-3" size={16} />
        <span className="text-muted-foreground/70">Search</span>
        <kbd className="bg-background text-muted-foreground/70 ms-7 -me-1 inline-flex h-5 items-center rounded border border-neutral-300 dark:border-neutral-800 px-1 font-[inherit] text-[0.625rem] font-medium">
          ⌘ K
        </kbd>
      </button>

      <button className="lg:hidden" onClick={() => setOpen(true)}>
        <SearchIcon className="text-muted-foreground/80" size={16} />
      </button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <VisuallyHidden>
          <DialogTitle>Search</DialogTitle>
        </VisuallyHidden>
        <CommandInput
          placeholder="Search for subjects, notes, quizzes..."
          value={query}
          onValueChange={setQuery}
        />
        <CommandList>
          <CommandEmpty>
            {loading
              ? "Scanning the index..."
              : query.trim()
                ? `No results found for "${query}".`
                : "Search for subjects, notes, quizzes, and more."}
          </CommandEmpty>

          {Object.entries(groupedHits).map(([type, items]) => (
            <CommandGroup key={type} heading={`${capitalize(type)}s`}>
              {items.map((hit) => (
                <CommandItem
                  key={hit.objectID}
                  value={hit.title}
                  onSelect={() => handleSelect(hit)}
                  className="items-center"
                >
                  {renderHitContent(hit)}
                </CommandItem>
              ))}
            </CommandGroup>
          ))}
        </CommandList>
      </CommandDialog>
    </>
  );
}
