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
    softRoot: levelDocument|null;
    setSoftRoot: (softRoot: levelDocument|null) => void;
}

interface position {
    x: number;
    y: number;
}
  
const ParentFolder: React.FC<ParentFolderProps> = ({ 
    document,
    selected, 
    setSelected,
    hidden, 
    maxLevel, 
    setMaxLevel,
    softRoot,
    setSoftRoot, 
    }) => {
    // ----------------------------------------------
    // ---------------  STATE MANAGEMENT ------------
    // ----------------------------------------------
    const [open, setOpen] = useState(false);
    let level = 1;
    const parentId = document.id;
    // Manage and stores the hidden folders based on maximum level shown
    const [hiddenOptions, setHiddenOptions] = useState<levelDocument[]>([]);
    // Manage and stores the breadcrumb of the selected folder
    const [breadcrumb, setBreadcrumb] = useState<levelDocument[]>([]);
    // Help separate the max level currently open per parent folder
    const [localMaxLevel, setLocalMaxLevel] = useState(1);
    // Pop Up configuration to manage the position of the pop up and its visibility
    const [position, setPosition] = useState<position>({x: 0, y: 0});
    const [openPopUp, setOpenPopUp] = useState(false);
    // Manage and stores the opened children of the parent folder
    // so navigation is independant pero child 
    const [openedChildren, setOpenedChildren] = useState<levelDocument[]>([]);  

    // ----------------------------------------------
    // ---------------  RENDER FUNCTIONS ------------
    // ----------------------------------------------
    // Render the children depending on the tipe of document (folder or file)
    const renderChildren = (doc: Document) => {
        if(breadcrumb.find(option => option.id === document.id) === undefined){
            const levelDoc: levelDocument= {...document, 'level': level, 'parentId': parentId};
            setBreadcrumb([...breadcrumb, levelDoc])
        }
        return doc.children.map((doc) => {
            if(doc.type === 'document') {
                return <File 
                document={doc}
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
                    softRoot={softRoot}
                    setSoftRoot={setSoftRoot}
                    localMaxLevel={localMaxLevel}
                    setLocalMaxLevel={setLocalMaxLevel}
                    breadcrumb={breadcrumb}
                    setBreadcrumb={setBreadcrumb}
                    openedChildren={openedChildren}
                    setOpenedChildren={setOpenedChildren}
                    />;
          });
    }

    // Render the ... and manage the lists of hidden folders 
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

    // Render the pop up with the hidden folders
    // Manages the states based on the selection of a folder
    const renderPopUp = () => {
        // Handles States so local max level, the max level, selected files, hidden, and opened children to match the selection
        const handelOptionClick = (option: levelDocument) => {
            setLocalMaxLevel(breadcrumb.length < MAX_NUMBER_LEVELS ? option.level+1 : MAX_NUMBER_LEVELS + (option.level-1));
            setMaxLevel(1);
            setSelected(option);
            const index = hiddenOptions.findIndex(opt => opt.name === option.name);
            const tempHiddenOptions = [...hiddenOptions].slice(0,index);
            setHiddenOptions(tempHiddenOptions);
            setOpenPopUp(false);
            setSoftRoot(null);
            const tempOpenedChildren = [...openedChildren].filter(opt => opt.level <= (MAX_NUMBER_LEVELS ? option.level+1 : MAX_NUMBER_LEVELS + (option.level-1)));    
            setOpenedChildren([...tempOpenedChildren]);
        }   
        // Closes the popUp when the mouse leaves
        const handleMouseLeave = () => {
            setPosition({x: 0, y: 0}); 
            setOpenPopUp(false);
        }
        return (
            <div className='popUp' style={{top: position.y, left: position.x}} onMouseLeave={() => handleMouseLeave()}>
                {hiddenOptions.sort((a,b) => a.name.localeCompare(b.name)).map(option => {
                    return <div className='popUpOption' onClick={() => handelOptionClick(option)}>{option.name}</div>
                })}
            </div>
        )
    }
    // Render the tittle of a selected Child that is no longer visible by navigation
    // E.G selected document is level 7 but navigation is only up to level 3 
    // This will shoe ... Tittle (selected document)
    const renderHiddenChild = () => {
        const padding = localMaxLevel*10;
        const handleClick = () => {
            setLocalMaxLevel(selected ? selected.level: 1);
            setMaxLevel(selected ? selected.level: 1);
        }
        return (
            <div className="hiddenChild" onClick={() => handleClick()} style={{paddingLeft: selected ? padding + 'px' : '20px'}}>... ({selected?.name}) </div>
        )
    }

    // ----------------------------------------------
    // ---------------  HANDLER FUNCTIONS -----------
    // ----------------------------------------------
    // On click of the folder tittle, the folder is selected and it is open to show its children
    // If the folder is not in the opened children, it is added to the list
    const handleFolderClick = (doc : Document) => {
        if(level< localMaxLevel){
            const levelDoc: levelDocument= {...doc, 'level': level, 'parentId': parentId};
            setSelected(levelDoc);
        } else {
            const levelDoc: levelDocument= {...doc, 'level': level, 'parentId': parentId};
            setSelected(levelDoc);
            setLocalMaxLevel(localMaxLevel + 1)
        }
        if(openedChildren.find(option => option.id === doc.id) === undefined){
            setOpenedChildren([...openedChildren, {...doc, 'level': level, 'parentId': parentId}])
        }
        setOpen(true);
    }

    // On click of the chevron, if the folder is closed,it will open and show its children
    // If the folder is open, it will close and remove its children from the opened
    // children list
    // The click in the chevron updates the max level shown but does not select the current folder
    const handleChevronClick = () => {
        if(open){
            setLocalMaxLevel(level);
            const index = breadcrumb.findIndex(opt => opt.name === document.name);
            const tempBreadcrums = [...breadcrumb].slice(0,index);
            setBreadcrumb(tempBreadcrums);
            const idxOC = openedChildren.findIndex(opt => opt.name === document.name);
            const tempOpenedChildren = [...openedChildren].slice(0,idxOC);
            setOpenedChildren(tempOpenedChildren);
        }else if(level >= maxLevel){
            setLocalMaxLevel(localMaxLevel + 1)
        }
        if(!open){
            if(openedChildren.find(option => option.id === document.id) === undefined){
                setOpenedChildren([...openedChildren, {...document, 'level': level, 'parentId': parentId}])
            }
        }
        setOpen(!open);

    } 

    // ----------------------------------------------
    // -------  MANAGE HIDDING CONDITIONS -----------
    // ----------------------------------------------
    if(maxLevel !== localMaxLevel && localMaxLevel - level >= MAX_NUMBER_LEVELS){
        setMaxLevel(localMaxLevel);
    } 
    const levelcondition = maxLevel - level >= MAX_NUMBER_LEVELS;
    const hideLevel = levelcondition ||(softRoot !== null && document.id !== softRoot.id)
    const hiddenChild =  selected &&selected.level > localMaxLevel && selected.parentId === parentId; 

    return (
        <>
        { hideLevel  ?
        renderHide()
        :
        <div className="folder" >
            <div onClick={() => handleChevronClick()}>{open ?
            <ExpandMore/>
            : <ChevronRight/>}
            </div>
            <p className='folderTittle' onClick={() => handleFolderClick(document)}>{document.name}{"-"+localMaxLevel}{"-"+maxLevel}</p>
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