import { transformImage } from '@/utils/feature';
import { FileOpen as FileOpenIcon } from '@mui/icons-material';

import React from 'react'

const RenderAttachment = (file, url) => {
    switch (file) {
        case "video":
            return <video src={url} preload='none' width={'200px'} controls />

        case 'image':
            return <img src={transformImage(url, 200)} style={{
                width: '200px',
                height: '150px',
                objectFit: 'contain',
            }} alt="Attachment" />

        case "audio":
            return <audio src={url} preload='none' controls />

        default:
            return <FileOpenIcon />

    }
}

export default RenderAttachment