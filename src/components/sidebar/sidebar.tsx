'use client'
import { useState } from 'react';
import { doclist } from './Lists/doclist';
import { simplelist } from './Lists/simplelist';
import {doublelist} from './Lists/doubleList';
import './sidebar.css';
import ParentFolder from '../folder/parentFolder';

export interface Document {
    type: string;
    name: string;
    id: string;
    parent: string|null;
    children: Document[];
    isSoftRoot: boolean;
}
export interface levelDocument extends Document{
  level: number;
  parentId: string
}
export const MAX_NUMBER_LEVELS = 6

const Sidebar: React.FC = () => {
    const root = "1QLSNL1QhMMHJmDVFyTXoQ2V6RBtc8mjx";
    const [maxLevel, setMaxLevel] = useState(1);
    const dict:Document[] = [];
    const hierarchy: Document = {
      type: "folder",
      name: "root",
      id: root,
      parent: null,
      children: [],
      isSoftRoot: false,
    }
    const [selected, setSelected] = useState<levelDocument|null>(null);
    const [softRoot, setSoftRoot] = useState<Document|null>(null);
    const hidden: number[] = [];
    const processList = () => {
      doublelist.map((doc) => {
            let document = {
              isSoftRoot: doc.name.includes('!'),
              type: doc.mimeType.split('google-apps.')[1],
              name: doc.name.includes('!')? doc.name.replace('!','') : doc.name,
              id: doc.id,
              parent: doc.parents[0], 
              children: [],
            };
            dict.push(document);
        });
    }
    const generateHierarchy = () => {
      processList();
      dict.forEach(document => {
        let parent = document.parent;
        if (parent === root) {
          hierarchy.children.push(document);
        } else {
          dict.find(doc => doc.id === parent)?.children.push(document);
        }
      });
    }
    generateHierarchy();
    return (
        <div className="mainSidebar">
          Hello
          {hierarchy.children.map((doc) => {
            return <ParentFolder 
                      document={doc}
                      selected={selected}
                      setSelected={setSelected}
                      hidden={hidden}
                      maxLevel={maxLevel}
                      setMaxLevel={setMaxLevel} 
                      softRoot={softRoot}
                      setSoftRoot={setSoftRoot} 
                    />;
          }) }
          {selected && selected.id + "-" + selected.name + "-" + selected.level}
        </div>
    )

}
export default Sidebar;
