"use client";

import { useState, useMemo } from "react";
import { TreeNode } from "@/types/github";
import { ChevronRight, ChevronDown, FileCode, Folder } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface FileExplorerProps {
  tree: TreeNode[];
  searchTerm: string;
}

interface TreeFolder {
  name: string;
  type: "tree";
  path: string;
  children: (TreeFolder | TreeFile)[];
}

interface TreeFile {
  name: string;
  type: "blob";
  path: string;
  size?: number;
}

function buildNestedTree(nodes: TreeNode[]): (TreeFolder | TreeFile)[] {
  const root: TreeFolder = { name: "root", type: "tree", path: "", children: [] };
  
  const map = new Map<string, TreeFolder>();
  map.set("", root);

  nodes.forEach(node => {
    const parts = node.path.split('/');
    const name = parts.pop()!;
    const parentPath = parts.join('/');
    
    // Ensure parents exist
    let currentPath = "";
    for (const part of parts) {
      const nextPath = currentPath ? `${currentPath}/${part}` : part;
      if (!map.has(nextPath)) {
        const newFolder: TreeFolder = { name: part, type: "tree", path: nextPath, children: [] };
        map.set(nextPath, newFolder);
        map.get(currentPath)!.children.push(newFolder);
      }
      currentPath = nextPath;
    }

    if (node.type === "blob") {
      map.get(parentPath)!.children.push({ name, type: "blob", path: node.path, size: node.size });
    } else {
      if (!map.has(node.path)) {
        const newFolder: TreeFolder = { name, type: "tree", path: node.path, children: [] };
        map.set(node.path, newFolder);
        map.get(parentPath)!.children.push(newFolder);
      }
    }
  });

  return root.children;
}

function HighlightText({ text, search }: { text: string, search: string }) {
  if (!search) return <>{text}</>;
  const parts = text.split(new RegExp(`(${search})`, 'gi'));
  return (
    <>
      {parts.map((part, i) => 
        part.toLowerCase() === search.toLowerCase() ? (
          <span key={i} className="bg-yellow-500/30 text-yellow-200 rounded-sm px-0.5">{part}</span>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}

function NodeItem({ node, level, searchTerm }: { node: TreeFolder | TreeFile, level: number, searchTerm: string }) {
  const [isOpen, setIsOpen] = useState(level < 1);

  const isFolder = node.type === "tree";
  const matchesSearch = node.name.toLowerCase().includes(searchTerm.toLowerCase());
  
  let hasMatchingChildren = false;
  if (isFolder) {
    const checkChildren = (n: TreeFolder): boolean => {
      if (n.name.toLowerCase().includes(searchTerm.toLowerCase())) return true;
      for (const child of n.children) {
        if (child.type === "blob") {
          if (child.name.toLowerCase().includes(searchTerm.toLowerCase())) return true;
        } else {
          if (checkChildren(child as TreeFolder)) return true;
        }
      }
      return false;
    };
    hasMatchingChildren = checkChildren(node as TreeFolder);
  }

  if (searchTerm && !matchesSearch && !hasMatchingChildren) {
    return null;
  }

  const shouldBeOpen = searchTerm && hasMatchingChildren ? true : isOpen;

  return (
    <div className="flex flex-col">
      <div 
        className="flex items-center py-1.5 px-2 hover:bg-white/[0.04] rounded-md cursor-pointer transition-colors group"
        style={{ paddingLeft: `${level * 16 + 8}px` }}
        onClick={() => isFolder && setIsOpen(!isOpen)}
      >
        <div className="w-4 h-4 mr-1.5 flex items-center justify-center text-white/40 group-hover:text-white/70">
          {isFolder ? (
            shouldBeOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />
          ) : (
            <FileCode size={14} />
          )}
        </div>
        {isFolder && <Folder size={14} className="mr-2 text-[#4d4da8]/80 group-hover:text-[#4d4da8]" />}
        <span className="text-sm font-medium text-white/80 group-hover:text-white truncate">
          <HighlightText text={node.name} search={searchTerm} />
        </span>
        {!isFolder && node.size && (
          <span className="ml-auto text-xs text-white/30 hidden group-hover:inline-block">
            {(node.size / 1024).toFixed(1)} KB
          </span>
        )}
      </div>

      <AnimatePresence>
        {isFolder && shouldBeOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="overflow-hidden"
          >
            {(node as TreeFolder).children.map(child => (
              <NodeItem key={child.path} node={child} level={level + 1} searchTerm={searchTerm} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FileExplorer({ tree, searchTerm }: FileExplorerProps) {
  const nestedTree = useMemo(() => buildNestedTree(tree), [tree]);

  const hasMatches = useMemo(() => {
    if (!searchTerm) return true;
    const checkNodes = (nodes: (TreeFolder | TreeFile)[]): boolean => {
      for (const node of nodes) {
        if (node.name.toLowerCase().includes(searchTerm.toLowerCase())) return true;
        if (node.type === "tree" && checkNodes(node.children)) return true;
      }
      return false;
    };
    return checkNodes(nestedTree);
  }, [nestedTree, searchTerm]);

  return (
    <div className="flex flex-col h-full bg-[#111113] border border-white/[0.06] rounded-2xl overflow-hidden max-h-[600px]">
      <div className="flex-1 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
        {!hasMatches ? (
          <div className="text-center py-10 text-white/40">No matching files found.</div>
        ) : (
          nestedTree.map(node => (
            <NodeItem key={node.path} node={node} level={0} searchTerm={searchTerm} />
          ))
        )}
      </div>
    </div>
  );
}
