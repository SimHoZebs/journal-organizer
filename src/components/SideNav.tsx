import { useState, useEffect } from "react";
import { Link } from "react-router";
import { Button, SecondaryBtn } from "../comp/Button";

type Item = {
  id: string;
};

// Navigation link configuration
type Props<T extends Item> = {
  title?: string;
  placeholder?: string;
  items?: T[];
  onItemSelect: (item: T) => void;
  setItems?: React.Dispatch<React.SetStateAction<T[]>>;
  getDisplayName: (item: T) => string;
  createNewItem?: () => void;
  children?: React.ReactNode;
};

const SideNav = <T extends Item>(props: Props<T>) => {
  const [displayList, setDisplayList] = useState<T[]>(props.items || []);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    setDisplayList(props.items || []);
  }, [props.items]);

  const handleItemSelect = (item: T) => {
    setSelectedId(item.id);
    props.onItemSelect(item);
  };

  return (
    <nav className="flex h-20 w-full gap-y-2 border-r border-zinc-600 bg-zinc-900 p-3 sm:h-full sm:w-80 sm:flex-col sm:justify-between sm:px-0">
      <div className="flex items-center justify-between p-2 border-b border-zinc-600">
        <div className="flex gap-x-4">
          <Link to={"/notes"}>
            <span className="h-6 w-6 icon-[mdi--journal] bg-zinc-400 hover:bg-zinc-200" />
          </Link>
          <Link to={"/profile"}>
            <span className="h-6 w-6 icon-[mdi--account] bg-zinc-400 hover:bg-zinc-200" />
          </Link>
        </div>

        <SecondaryBtn
          className="p-1.5 rounded-lg cursor-pointer text-zinc-400 hover:bg-zinc-600"
          onClick={props.createNewItem}
        >
          <span className="icon-[mdi--add] h-4 w-4" />
        </SecondaryBtn>
      </div>

      <div className="grow flex flex-col pt-4 pb-3.5 gap-3.5 overflow-hidden">
        {props.children && <div className="mx-3.5">{props.children}</div>}

        <div className="grow flex flex-col gap-1 mx-3.5 overflow-y-auto">
          {displayList.map((item) => (
            <Button
              key={item.id}
              className={`text-left px-4 py-2 rounded-xl truncate shrink-0 text-zinc-100 ${
                selectedId === item.id ? "bg-zinc-500" : "hover:bg-zinc-600"
              }`}
              onClick={() => handleItemSelect(item)}
            >
              {props.getDisplayName(item)}
            </Button>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default SideNav;
