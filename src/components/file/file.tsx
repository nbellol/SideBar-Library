'use client'
import { Document } from '../sidebar/sidebar';

import './file.css';

interface FileProps {
    document: Document;
  }
  
const File: React.FC<FileProps> = ({ document }) => {
    return (
        <div className="file">
            <p className='fileTittle'>{document.name}</p>
        </div>
    )

}
export default File;