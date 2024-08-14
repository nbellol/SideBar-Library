'use client'
import { useState } from 'react';
import { ExpandMore, ChevronRight} from '@mui/icons-material';
import { Document } from '../sidebar/sidebar';
import  Folder  from '../folder/folder';
import File from '../file/file';

import './folder.css';

interface ParentFolderProps {
    document: Document;
  }
  
const ParentFolder: React.FC<ParentFolderProps> = ({ document }) => {
    const [open, setOpen] = useState(false);
    let level = 1;
    const [maxLevel, setMaxLevel] = useState(1);
    const [hidden, setHidden] = useState<string[]>([]);
    const renderChildren = (doc: Document) => {
        return doc.children.map((doc) => {
            if(doc.type === 'document') {
                return <File document={doc}/>;
            }
            
            return <Folder 
                    document={doc}
                    level={level+1}
                    hidden={hidden}
                    setHidden={setHidden}
                    maxLevel={maxLevel}
                    setmaxLevel={setMaxLevel}
                    />;
          });
    }

    const renderHide = () => { 
        if (level === 1) {
            return (
            <div className="hidden">... </div>
            )
        }
        return null;
    }
    const handleFolderClick = () => {
        if(open){
            const difference = maxLevel - level;
            setMaxLevel(maxLevel - difference);
        } else {
            setMaxLevel(maxLevel + 1)
        }
        setOpen(!open); 
        
    }
    const hideLevel = maxLevel - level > 5;


    return (
        <>
        { hideLevel ? 
        renderHide()
        :
        <div className="folder" onClick={() => handleFolderClick()}>
            {open ? 
            <ExpandMore/> 
            : <ChevronRight/>}
            <p className='folderTittle'>{document.name}{"-"+level}{"-"+maxLevel}</p>
        </div> 
        }
        <div style={{paddingLeft: hideLevel? '0' : '5%'}}>
            {open && renderChildren(document)
            } 
        </div>
        </>
    )

}
export default ParentFolder;