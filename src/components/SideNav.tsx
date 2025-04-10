import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import closeSideNav from "../assets/icons/close-nav-icon.svg";

// Generic item type that all displayed items must conform to
type Item = {
  id: string;
  [key: string]: unknown;
};

// Navigation link configuration
type NavLink = {
  to: string;
  icon: string;
  altText: string;
  isActive: boolean;
};

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
  setErrorMessage?: React.Dispatch<React.SetStateAction<string>>;
  
  // Navigation
  navLinks: NavLink[];
  addButtonIcon?: string;
};

const SideNav = <T extends Item>(props: Props<T>) => {
  const {
    title,
    placeholder = "Search...",
    items = [],
    closeNav,
    onItemSelect,
    getDisplayName,
    createNewItem,
    onSearch,
    navLinks,
    addButtonIcon,
  } = props;

  const [search, setSearch] = useState<string>("");
  const [displayList, setDisplayList] = useState<T[]>(items);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const navModal = useRef<HTMLDivElement>(null);

  // Generic search handler
  const handleSearch = async (query: string) => {
    if (onSearch) {
      try {
        await onSearch(query);
      } catch (error) {
        console.error("Error searching:", error);
        if (props.setErrorMessage) {
          props.setErrorMessage(
            error instanceof Error
              ? `Search failed: ${error.message}`
              : "An error occurred while searching"
          );
        }
      }
    }
  };

  // Update display list when items change
  useEffect(() => {
    if (items) {
      setDisplayList(items);
    }
  }, [items]);

  // Item selection handling
  const handleItemSelect = (id: string) => {
    setSelectedId(id);
    onItemSelect(id);
    if (window.innerWidth < 640) {
      closeNav(false);
    }
  };

  return (
    <>
      <div
        ref={navModal}
        className="z-10 absolute top-0 left-0 w-dvw opacity-75 h-dvh sm:hidden bg-black"
        onClick={(event) => {
          if (event.target === event.currentTarget) {
            closeNav(false);
          }
        }}
      />
      <div className="shrink-0 border-r border-neutral-50 z-20 absolute top-0 left-0 w-[300px] h-dvh overflow-hidden flex flex-col bg-neutral-800 sm:static">
        {/* Top Nav */}
        <div className="flex items-center justify-between py-2 pl-2 pr-2.5 border-b border-neutral-50">
          {/* Close Navbar Button */}
          <button
            type="button"
            className="p-1 rounded-lg hover:bg-neutral-600 cursor-pointer"
            onClick={() => closeNav(false)}
          >
            <img
              className="w-[25px] h-[25px] invert brightness-0"
              src={closeSideNav}
              alt="Close Side Nav Icon"
            />
          </button>

          {/* Page Navigation */}
          <div className="flex items-center justify-between gap-3">
            {createNewItem && addButtonIcon && (
              <button
                type="button"
                className="p-1.5 rounded-lg cursor-pointer hover:bg-neutral-600"
                onClick={createNewItem}
              >
                <img
                  className="w-[25px] h-[25px]"
                  src={addButtonIcon}
                  alt="Add New Item"
                />
              </button>
            )}
            
            {/* Nav Links */}
            {navLinks.map((link, index) => (
              <Link key={index} to={link.to}>
                <button
                  type="button"
                  className={`p-1.5 rounded-lg cursor-pointer ${
                    link.isActive
                      ? "bg-neutral-500"
                      : "hover:bg-neutral-600"
                  }`}
                >
                  <img
                    className="w-[25px] h-[25px] invert brightness-0"
                    src={link.icon}
                    alt={link.altText}
                  />
                </button>
              </Link>
            ))}
          </div>
        </div>

        {/* Search and Display List */}
        <div className="grow flex flex-col pt-4 pb-3.5 gap-3.5 overflow-hidden">
          {title && (
            <h2 className="text-neutral-50 font-medium text-lg px-5">{title}</h2>
          )}
          
          {/* Search Bar */}
          <input
            className="px-2.5 py-1 rounded-lg border-[0.5px] border-neutral-50 mx-5 text-neutral-50"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              handleSearch(event.target.value);
            }}
            placeholder={placeholder}
          />

          {/* Display List */}
          <div className="grow flex flex-col gap-1 overflow-auto mx-3.5">
            {displayList.map((item) => (
              <button
                type="button"
                key={item.id}
                className={`text-left px-4 py-2 rounded-xl truncate shrink-0 text-neutral-50 ${
                  selectedId === item.id
                    ? "bg-neutral-500"
                    : "hover:bg-neutral-600"
                }`}
                onClick={() => handleItemSelect(item.id)}
              >
                {getDisplayName(item)}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default SideNav;
