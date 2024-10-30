import { fileFormat } from '@/utils/feature';
import { Box, Typography } from '@mui/material';
import moment from 'moment';
import React, { memo } from 'react'
import RenderAttachment from './RenderAttachment';

const MessageComponent = ({ message, user }) => {
    const { sender, attachments = [], content, createdAt } = message;
    const sameSender = sender?._id === user?.id;
    const timeAgo = moment(createdAt).fromNow();

    return (
        <div
            style={{
                alignSelf: sameSender ? 'flex-end' : 'flex-start',
                backgroundColor: sameSender ? 'cyan' : 'white',
                color: 'black',
                borderRadius: sameSender ? '10px 20px 0px 20px' : '0px 20px 10px 20px',
                padding: '0.5rem',
                width: 'fit-content'
            }}
        >
            {
                !sameSender && (<Typography color={'#2694ab'} fontWeight={'600'} variant='caption'>
                    {sender.name}
                </Typography>)
            }

            {
                content && <Typography>{content}</Typography>
            }


            {
                attachments.length > 0 && (
                    attachments.map((attachment, index) => {
                        const { url } = attachment;
                        const file = fileFormat(url);
                        return <Box key={index}>
                            <a href={url} target='_blank' download style={{
                                color: 'black'
                            }}>

                                {RenderAttachment(file, url)}
                            </a>
                        </Box>
                    })
                )
            }

            <Typography variant='caption' color={'text.secondary'} >{timeAgo}</Typography>

        </div>
    )
}

export default memo(MessageComponent);