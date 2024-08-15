'use client'
import { useEffect, useState } from 'react';
import { ExpandMore, ChevronRight} from '@mui/icons-material';
import { Document } from '../sidebar/sidebar';
import  Folder  from '../folder/folder';
import File from '../file/file';
import { MAX_NUMBER_LEVELS } from '../sidebar/sidebar';
import './folder.css';

interface ParentFolderProps {
    document: Document;
    selected: string;
    setSelected: (selected: string) => void;
    hidden: number[]
  }
  
const ParentFolder: React.FC<ParentFolderProps> = ({ document,selected, setSelected,hidden }) => {
    const [open, setOpen] = useState(false);
    let level = 1;
    const [maxLevel, setMaxLevel] = useState(1);
    const renderChildren = (doc: Document) => {
        return doc.children.map((doc) => {
            if(doc.type === 'document') {
                return <File 
                document={doc}
                selected={selected}
                setSelected={setSelected}
                />;
            }
            
            return <Folder 
                    document={doc}
                    level={level+1}
                    hidden={hidden}
                    maxLevel={maxLevel}
                    setmaxLevel={setMaxLevel}
                    selected={selected}
                    setSelected={setSelected}
                    />;
          });
    }

    
    const renderHide = () => {
        // if(hidden.indexOf(level)<0 ){
        //     hidden.push(level)
        // }
        console.log(hidden)
        if (level === 1) {
            const difference = maxLevel - MAX_NUMBER_LEVELS;
            return (
            <div className="hidden" onClick={() => setMaxLevel(difference)}>... </div>
            )
        }
        return null;
    }
    const handleFolderClick = (doc : Document) => {
        if(open){
            const difference = maxLevel - level;
            setMaxLevel(maxLevel - difference +  1);
            setSelected(doc.id+'-'+doc.name);
        } else {
            setSelected(doc.id+'-'+doc.name);
            setMaxLevel(maxLevel + 1)
            setOpen(true);
        }
         
        
    }

    const handleChevronClick = () => {
        if(open){
            const difference = maxLevel - level;
            setMaxLevel(maxLevel - difference);
        }else{
            setMaxLevel(maxLevel + 1)
        }
        setOpen(!open);

    } 

    const hideLevel = maxLevel - level >= MAX_NUMBER_LEVELS || hidden.indexOf(level) >=0;
    return (
        <>
        { hideLevel ?
        renderHide()
        :
        <div className="folder" >
            <div onClick={() => handleChevronClick()}>{open ?
            <ExpandMore/>
            : <ChevronRight/>}
            </div>
            <p className='folderTittle' onClick={() => handleFolderClick(document)}>{document.name}{"-"+level}{"-"+maxLevel}</p>
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