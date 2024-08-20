'use client'
import { useEffect, useState } from 'react';
import { ExpandMore, ChevronRight} from '@mui/icons-material';
import { Document, MAX_NUMBER_LEVELS } from '../sidebar/sidebar';
import File from '../file/file';

import './folder.css';
import { levelDocument } from '../sidebar/sidebar';

interface FolderProps {
    document: Document;
    level: number;
    hidden: number[];
    maxLevel: number;
    setmaxLevel: (maxLevel: number) => void;
    selected: levelDocument|null;
    setSelected: (selected: levelDocument|null) => void;
    hiddenOptions: levelDocument[];
    setHiddenOptions: (hiddenOptions: levelDocument[]) => void;
    parentId: string;
  }

const Folder: React.FC<FolderProps> = ({ document,level,hidden, maxLevel,setmaxLevel, selected, setSelected, hiddenOptions, setHiddenOptions, parentId}) => {
    const [open, setOpen] = useState(false);
    const renderChildren = (doc: Document) => {
        return doc.children.map((doc) => {
            if(doc.type === 'document') {
                return <File
                document={doc}
                selected={selected}
                setSelected={setSelected}
                level={level+1}
                parentId={parentId}
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
                    parentId={parentId}
                    />;
          });
    }

    useEffect(() => {
        if(level >= maxLevel) {
            setOpen(false);
        }
    },[maxLevel]);



    const renderHide = () => {
        
        if(hiddenOptions.find(option => option.id === document.id) === undefined){
            const levelDoc: levelDocument= {...document, 'level': level, 'parentId': parentId};
            setHiddenOptions([...hiddenOptions, levelDoc])
        }
        return null;
    }
    const handleFolderClick = (doc: Document) => {
        if(level< maxLevel){
            const levelDoc: levelDocument= {...doc, 'level': level, 'parentId': parentId};
            setSelected(levelDoc);
        } else {
            const levelDoc: levelDocument= {...doc, 'level': level, 'parentId': parentId};
            setSelected(levelDoc);
            setmaxLevel(maxLevel + 1)
        }
        setOpen(true)
    }
    const handleChevronClick = () => {
        if(open){
            setmaxLevel(level);
        }else if(level >= maxLevel){
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