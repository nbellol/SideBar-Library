'use client'
import { useState } from 'react';
import { ExpandMore, ChevronRight} from '@mui/icons-material';
import { Document, levelDocument } from '../sidebar/sidebar';
import  Folder  from '../folder/folder';
import File from '../file/file';
import { MAX_NUMBER_LEVELS } from '../sidebar/sidebar';
import './folder.css';

interface ParentFolderProps {
    document: Document;
    selected: levelDocument|null;
    setSelected: (selected: levelDocument|null) => void;
    hidden: number[]
    maxLevel: number;
    setMaxLevel: (maxLevel: number) => void;
}

interface position {
    x: number;
    y: number;
}
  
const ParentFolder: React.FC<ParentFolderProps> = ({ document,selected, setSelected,hidden, maxLevel, setMaxLevel }) => {
    const [open, setOpen] = useState(false);
    let level = 1;
    const parentId = document.id;
    const [hiddenOptions, setHiddenOptions] = useState<levelDocument[]>([]);
    const [position, setPosition] = useState<position>({x: 0, y: 0});
    const [openPopUp, setOpenPopUp] = useState(false);
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
                    setmaxLevel={setMaxLevel}
                    selected={selected}
                    setSelected={setSelected}
                    hiddenOptions={hiddenOptions}
                    setHiddenOptions={setHiddenOptions}
                    parentId={parentId}
                    />;
          });
    }

    
    const renderHide = () => {
        if(hiddenOptions.find(option => option.id === document.id) === undefined){
            const levelDoc: levelDocument= {...document, 'level': level, 'parentId': parentId};
            setHiddenOptions([...hiddenOptions, levelDoc])
        }

        if (level === 1) {
            const HandleHiddenClick = (e: React.MouseEvent<HTMLDivElement>) => {
                setPosition({x: e.clientX, y: e.clientY});
                setOpenPopUp(true);
            };
            return (
            <div className="hidden" onClick={(e) => HandleHiddenClick(e)}>... </div>
            )
        }
        return null;
    }
    const renderPopUp = () => {
        const handelOptionClick = (option: levelDocument) => {
            setMaxLevel(MAX_NUMBER_LEVELS + (option.level-1));
            setSelected(option);
            const index = hiddenOptions.findIndex(opt => opt.name === option.name);
            const tempHiddenOptions = [...hiddenOptions].slice(0,index);
            setHiddenOptions(tempHiddenOptions);
            setOpenPopUp(false);
        }

        const handleMouseLeave = () => {
            setPosition({x: 0, y: 0}); 
            setOpenPopUp(false);
        }
        return (
            <div className='popUp' style={{top: position.y, left: position.x}} onMouseLeave={() => handleMouseLeave()}>
                {hiddenOptions.map(option => {
                    return <div className='popUpOption' onClick={() => handelOptionClick(option)}>{option.name}</div>
                })}
            </div>
        )
    }
    const renderHiddenChild = () => {
        const padding = maxLevel*10;
        const handleClick = () => {
            setMaxLevel(selected ? selected.level: 1);
        }

        return (
            <div className="hiddenChild" onClick={() => handleClick()} style={{paddingLeft: selected ? padding + 'px' : '20px'}}>... ({selected?.name}) </div>
        )
    }

    const handleFolderClick = (doc : Document) => {
        if(level< maxLevel){
            const levelDoc: levelDocument= {...doc, 'level': level, 'parentId': parentId};
            setSelected(levelDoc);
        } else {
            const levelDoc: levelDocument= {...doc, 'level': level, 'parentId': parentId};
            setSelected(levelDoc);
            setMaxLevel(maxLevel + 1)
        }
        setOpen(true);
    }

    const handleChevronClick = () => {
        if(open){
            setMaxLevel(level);
        }else if(level >= maxLevel){
            setMaxLevel(maxLevel + 1)
        }
        setOpen(!open);

    } 

    const hideLevel = maxLevel - level >= MAX_NUMBER_LEVELS || hidden.indexOf(level) >=0;
    const hiddenChild =  selected &&selected.level > maxLevel && selected.parentId === parentId; 
    console.log(maxLevel,selected)

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
        {(hiddenChild) 
            &&
            <div id='hiddenContainer' style={{paddingLeft:'5%'}}>
                {renderHiddenChild()}
            </div>
        } 
        </>
    )

}
export default ParentFolder;