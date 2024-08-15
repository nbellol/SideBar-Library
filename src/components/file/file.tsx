'use client'
import { Document } from '../sidebar/sidebar';

import './file.css';

interface FileProps {
    document: Document;
    selected: string;
    setSelected: (selected: string) => void;
  }
  
const File: React.FC<FileProps> = ({ document,selected,setSelected }) => {
    const handleClick = (doc: Document) => {
        setSelected(doc.id+'-'+doc.name)
    }
    return (
        <div className="file" onClick={() => handleClick(document)}>
            <p className='fileTittle'>{document.name}</p>
        </div>
    )

}
export default File;