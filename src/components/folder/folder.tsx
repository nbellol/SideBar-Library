'use client'
import { useEffect, useState } from 'react';
import { ExpandMore, ChevronRight} from '@mui/icons-material';
import { Document, MAX_NUMBER_LEVELS } from '../sidebar/sidebar';
import File from '../file/file';

import './folder.css';
import { hiddenOptions } from './parentFolder';

interface FolderProps {
    document: Document;
    level: number;
    hidden: number[];
    maxLevel: number;
    setmaxLevel: (maxLevel: number) => void;
    selected: string;
    setSelected: (selected: string) => void;
    hiddenOptions: hiddenOptions[];
    setHiddenOptions: (hiddenOptions: hiddenOptions[]) => void;
  }

const Folder: React.FC<FolderProps> = ({ document,level,hidden, maxLevel,setmaxLevel, selected, setSelected, hiddenOptions, setHiddenOptions}) => {
    const [open, setOpen] = useState(false);
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
                    setmaxLevel={setmaxLevel}
                    selected={selected}
                    setSelected={setSelected}
                    hiddenOptions={hiddenOptions}
                    setHiddenOptions={setHiddenOptions} 
                    />;
          });
    }

    useEffect(() => {
        if(level >= maxLevel) {
            setOpen(false);
        }
    },[maxLevel]);



    const renderHide = () => {
        
        if(hiddenOptions.find(option => option.name === document.name) === undefined){
            setHiddenOptions([...hiddenOptions, {level: level, name: document.name}])
        }
        if (level === 1) {
            const difference = maxLevel - level;
            return (
            <div className="hidden" onClick={() => setmaxLevel(difference)}>... </div>
            )
        }
        return null;
    }
    const handleFolderClick = (doc: Document) => {
        if(level< maxLevel){
            setSelected(doc.id+'-'+doc.name);
        } else {
            setSelected(doc.id+'-'+doc.name);
            setmaxLevel(maxLevel + 1)

        }
        setOpen(true)


    }
    const handleChevronClick = () => {
        if(open){
            const difference = maxLevel - level;
            setmaxLevel(maxLevel - difference);
        }else{
            setmaxLevel(maxLevel + 1)
        }
        setOpen(!open);

    }
    const hideLevel = maxLevel - level >= MAX_NUMBER_LEVELS || hidden.indexOf(level)>0;


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
export default Folder;