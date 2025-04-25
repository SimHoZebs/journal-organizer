import { useState } from "react";
import { Link } from "react-router";

// Generic item type that all displayed items must conform to
type Item = {
  id: string;
};

// Navigation link configuration
type Props<T extends Item> = {
  // Generic props
  title?: string;
  placeholder?: string;
  closeNav: React.Dispatch<React.SetStateAction<boolean>>;
  onItemSelect: (id: string) => void;

  // Item display props
  items?: T[];
  setItems?: React.Dispatch<React.SetStateAction<T[]>>;
  getDisplayName: (item: T) => string;

  // Optional actions
  createNewItem?: () => void;
  onSearch?: (query: string) => Promise<void>;

  // Navigation
  addButtonIcon?: string;
};

const SideNav = <T extends Item>(props: Props<T>) => {
  const {
    placeholder = "Search...",
    items = [],
    closeNav,
    onItemSelect,
    getDisplayName,
    createNewItem,
    onSearch,
  } = props;

  const [search, setSearch] = useState<string>("");
  const [displayList, setDisplayList] = useState<Item[]>(items);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Generic search handler
  const handleSearch = async (query: string) => {
    if (onSearch) {
      try {
        await onSearch(query);
      } catch (error) {
        console.error("Error searching:", error);
      }
    }
  };

  // Item selection handling
  const handleItemSelect = (id: string) => {
    setSelectedId(id);
    onItemSelect(id);
    if (globalThis.innerWidth < 640) {
      closeNav(false);
    }
  };

  return (
    <nav className="flex h-20 w-full gap-y-2 border-r border-zinc-600 bg-zinc-900 p-3 sm:h-full sm:w-56 sm:flex-col sm:justify-between sm:px-0">
      <div className="flex items-center justify-between p-2 border-b border-zinc-600">
        <div className="flex gap-x-4">
          <Link to={"/notes"}>
            <span className="h-6 w-6 icon-[mdi--journal] bg-zinc-400 hover:bg-zinc-200" />
          </Link>
          <Link to={"/profile"}>
            <span className="h-6 w-6 icon-[mdi--account] bg-zinc-400 hover:bg-zinc-200" />
          </Link>
        </div>

        <button
          type="button"
          className="p-1.5 rounded-lg cursor-pointer text-zinc-400 hover:bg-zinc-600"
          onClick={createNewItem}
        >
          <span className="icon-[mdi--add] h-4 w-4" />
        </button>
      </div>

      <div className="grow flex flex-col pt-4 pb-3.5 gap-3.5 overflow-hidden">
        <input
          className="px-2.5 py-1 rounded-lg border-[0.5px] border-zinc-100 mx-5 text-zinc-100"
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
            handleSearch(event.target.value);
          }}
          placeholder={placeholder}
        />

        <div className="grow flex flex-col gap-1 mx-3.5">
          {displayList.map((item) => (
            <button
              type="button"
              key={item.id}
              className={`text-left px-4 py-2 rounded-xl truncate shrink-0 text-zinc-100 ${
                selectedId === item.id ? "bg-zinc-500" : "hover:bg-zinc-600"
              }`}
              onClick={() => handleItemSelect(item.id)}
            >
              {getDisplayName(item)}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default SideNav;
