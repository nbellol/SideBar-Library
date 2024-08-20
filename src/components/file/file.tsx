'use client'
import { Document, levelDocument } from '../sidebar/sidebar';

import './file.css';

interface FileProps {
    document: Document;
    selected: levelDocument|null;
    setSelected: (selected: levelDocument|null) => void;
    level: number;
    parentId: string;
  }
  
const File: React.FC<FileProps> = ({ document,selected,setSelected, level, parentId }) => {
    const handleClick = (doc: Document) => {
        const levelDoc: levelDocument= {...doc, 'level': level, 'parentId': parentId};
        setSelected(levelDoc);
    }
    return (
        <div className="file" onClick={() => handleClick(document)}>
            <p className='fileTittle'>{document.name}</p>
        </div>
    )

}
export default File;