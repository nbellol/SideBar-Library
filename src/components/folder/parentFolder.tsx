'use client'
import { useEffect, useState } from 'react';
import { ExpandMore, ChevronRight} from '@mui/icons-material';
import { Document } from '../sidebar/sidebar';
import  Folder  from '../folder/folder';
import File from '../file/file';
import { MAX_NUMBER_LEVELS } from '../sidebar/sidebar';
import './folder.css';
import { render } from 'react-dom';

interface ParentFolderProps {
    document: Document;
    selected: string;
    setSelected: (selected: string) => void;
    hidden: number[]
  }
export interface hiddenOptions{
    level: number;
    name: string;
}

interface position {
    x: number;
    y: number;
}
  
const ParentFolder: React.FC<ParentFolderProps> = ({ document,selected, setSelected,hidden }) => {
    const [open, setOpen] = useState(false);
    let level = 1;
    const [maxLevel, setMaxLevel] = useState(1);
    const [hiddenOptions, setHiddenOptions] = useState<hiddenOptions[]>([]);
    const [position, setPosition] = useState<position>({x: 0, y: 0});
    const [openPopUp, setOpenPopUp] = useState(false);
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
                    hiddenOptions={hiddenOptions}
                    setHiddenOptions={setHiddenOptions}
                    />;
          });
    }

    
    const renderHide = () => {
        // if(hidden.indexOf(level)<0 ){
        //     hidden.push(level)
        // }
        if(hiddenOptions.find(option => option.name === document.name) === undefined){
            setHiddenOptions([...hiddenOptions, {level: level, name: document.name}])
        }

        if (level === 1) {
            const HandleHiddenClick = (e: React.MouseEvent<HTMLDivElement>) => {
                setPosition({x: e.clientX, y: e.clientY});
                setOpenPopUp(true);
                console.log(hiddenOptions);
            };
            return (
            <div className="hidden" onClick={(e) => HandleHiddenClick(e)}>... </div>
            )
        }
        return null;
    }
    const renderPopUp = () => {
        return (
            <div className='popUp' style={{top: position.y, left: position.x}}>
                {hiddenOptions.map(option => {
                    return <div className='popUpOption'>{option.name}</div>
                })}
            </div>
        )
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
        {openPopUp && renderPopUp()}
        </>
    )

}
export default ParentFolder;