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
    }
    const [selected, setSelected] = useState("");
    const hidden: number[] = [];
    const processList = () => {
      doublelist.map((doc) => {
            let document = {
              type: doc.mimeType.split('google-apps.')[1],
              name: doc.name,
              id: doc.id,
              parent: doc.parents[0], 
              children: []};
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
                    />;
          }) }
          {selected}
        </div>
    )

}
export default Sidebar;
