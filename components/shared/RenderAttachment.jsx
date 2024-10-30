import { transformImage } from '@/utils/feature';
import { FileOpen as FileOpenIcon } from '@mui/icons-material';
import React from 'react'

const RenderAttachment = (file, url) => {
    switch (file) {
        case "video":
            return <video src={url} preload='none' width={'200px'} controls />
            break;
        case 'image':
            return <img src={transformImage(url, 200)} width={'200px'} height={'150px'} style={{
                objectFit: 'contain',
            }} alt="Attachment" />
            break;
        case "audio":
            return <audio src={url} preload='none' controls />
            break;
        default:
            return <FileOpenIcon />
            break;
    }
}

export default RenderAttachment