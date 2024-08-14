'use client'
import { useState } from 'react';
import { ExpandMore, ChevronRight} from '@mui/icons-material';
import { Document } from '../sidebar/sidebar';
import File from '../file/file';

import './folder.css';

interface FolderProps {
    document: Document;
    level: number;
    hidden: string[];
    setHidden: (hidden: string[]) => void;
    maxLevel: number;
    setmaxLevel: (maxLevel: number) => void;
  }
  
const Folder: React.FC<FolderProps> = ({ document,level,hidden,setHidden, maxLevel,setmaxLevel }) => {
    const [open, setOpen] = useState(false);
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
                    setmaxLevel={setmaxLevel}
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
            setmaxLevel(maxLevel - 1);
        } else {
            setmaxLevel(maxLevel + 1)
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
export default Folder;