'use client'
import { useState } from 'react';
import { doclist } from './Lists/doclist';
import { simplelist } from './Lists/simplelist';
import './sidebar.css';
import Folder from '../folder/folder';

export interface Document {
    type: string;
    name: string;
    id: string;
    parent: string|null;
    children: Document[];
}

const Sidebar: React.FC = () => {
    const root = "1QLSNL1QhMMHJmDVFyTXoQ2V6RBtc8mjx";
    const dict:Document[] = []
    let level = 0;
    const [maxLevel, setMaxLevel] = useState(1);
    const [hidden, setHidden] = useState<string[]>([]);
    const hierarchy: Document = {
      type: "folder",
      name: "root",
      id: root,
      parent: null,
      children: [],
    }
    const processList = () => {
        simplelist.map((doc) => {
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
            return <Folder 
                      document={doc}
                      level={level+1}
                      hidden={hidden}
                      setHidden={setHidden}
                      maxLevel={maxLevel}
                      setmaxLevel={setMaxLevel}
                    />;
          }) }
        </div>
    )

}
export default Sidebar;
