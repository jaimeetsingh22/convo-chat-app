import { NEW_ATTACHMENT } from '@/constants/events';
import { setIsFileMenu, setUploadingLoader } from '@/redux/reducers/miscSlice';
import { useSendAttachmentsMutation } from '@/redux/RTK-query/api/api';
import { getSocket } from '@/socket';
import { AudioFile as AudioFileIcon, Image as ImageIcon, UploadFile as UploadFileIcon, VideoFile as VideoFileIcon } from '@mui/icons-material';
import { Button, Dialog, DialogActions, DialogContent, ListItemText, Menu, MenuItem, MenuList, Tooltip, Typography } from '@mui/material';
import { useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';

const FileMenu = ({ anchorE1, chatId }) => {
  const { isFileMenu } = useSelector(state => state.misc);
  const [previewFile, setPreviewFile] = useState(null); // New state for file preview
  const [isOpen, setIsOpen] = useState(false);

  const socket = getSocket();
  const dispatch = useDispatch();

  const imageRef = useRef(null);
  const videoRef = useRef(null);
  const audioRef = useRef(null);
  const fileRef = useRef(null);

  const [sendAttachments] = useSendAttachmentsMutation();

  const handleClose = () => {
    dispatch(setIsFileMenu(false));
  }

  const selectImage = () => imageRef.current?.click();
  const selectVideo = () => videoRef.current?.click();
  const selectAudio = () => audioRef.current?.click();
  const selectFile = () => fileRef.current?.click();

  const fileChangeHandler = (e, key) => {
    const file = Array.from(e.target.files);

    if (file.length <= 0) return;
    if (file.length <= 5) {
      setIsOpen(true);
      setPreviewFile(file); // Set preview file to display in Chat component
    } else {
      return toast.error(`You can send only 5 ${key} at a time`);
    }
    handleClose();
  };

  // Close the file preview modal
  const handleClosePreview = () => {
    setIsOpen(false);
    setPreviewFile(null)
  };

  // "Send" the file (currently just clears the preview)
  const handleSendFile = async () => {
    dispatch(setUploadingLoader(true))
    const toastId = toast.loading("Sending...");
    setIsOpen(false);

    try {
      // fetching  API to send file
      const myForm = new FormData();
      myForm.append('chatId', chatId);
      previewFile.forEach(file => {
        myForm.append('files', file);
      });
      const res = await sendAttachments(myForm);
      if (res.data) {
        toast.success("File sent successfully", { id: toastId });
        console.log(res.data)
        socket.emit(NEW_ATTACHMENT, {
          chatId,
          members: res.data.members,
          message: res.data.message,
        })
        // socket.emit(NEW_MESSAGE,)

      } else {
        toast.error("Failed to send file", { id: toastId });
      }

    } catch (error) {
      toast.error(error.message, { id: toastId });
    } finally {
      dispatch(setUploadingLoader(false));
    }
  };

  return (
    <>
      {/* File Preview Modal */}
      <Dialog
        open={isOpen} // Opens the dialog when a file is selected
        onClose={handleClosePreview}
        maxWidth="sm"
        fullWidth
      >
        <DialogContent>
          {previewFile && (
            <Typography variant="body1">
            File: {previewFile && previewFile.map((i, idx) => (
              <span key={idx}>&quot;{i.name}&quot;, </span>
            ))}
          </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePreview} color="secondary">Remove</Button>
          <Button onClick={handleSendFile} color="primary">Send</Button>
        </DialogActions>
      </Dialog>
      {/* End of File Preview Modal */}
      <Menu anchorEl={anchorE1} open={isFileMenu} onClose={handleClose} >
        <div style={{
          width: "10rem"
        }}>

          <MenuList>
            <MenuItem onClick={selectImage}>
              <Tooltip title="Send Image">
                <ImageIcon />
              </Tooltip>
              <ListItemText sx={{ marginLeft: "0.5rem" }}>
                Image
              </ListItemText>
              <input type="file" multiple accept='image/png,image/jgp, image/jpeg,image/gif'
                style={{
                  display: "none",
                }}
                onChange={(e) => fileChangeHandler(e, "Images")}
                ref={imageRef}
              />
            </MenuItem>
            <MenuItem onClick={selectAudio}>
              <Tooltip title="Send Audio">
                <AudioFileIcon />
              </Tooltip>
              <ListItemText sx={{ marginLeft: "0.5rem" }}>
                Audio
              </ListItemText>
              <input type="file" multiple accept='audio/mpeg, audio/wav, audio/ogg, audio/mp3'
                style={{
                  display: "none",
                }}
                onChange={(e) => fileChangeHandler(e, "Audios")}
                ref={audioRef}
              />
            </MenuItem>
            <MenuItem onClick={selectVideo}>
              <Tooltip title="Send Videos">
                <VideoFileIcon />
              </Tooltip>
              <ListItemText sx={{ marginLeft: "0.5rem" }}>
                Videos
              </ListItemText>
              <input type="file" multiple accept='video/mp4, video/webm, video/ogg, video/mov,video/mkv'
                style={{
                  display: "none",
                }}
                onChange={(e) => fileChangeHandler(e, "Videos")}
                ref={videoRef}
              />
            </MenuItem>
            <MenuItem onClick={selectFile}>
              <Tooltip title="Send Files">
                <UploadFileIcon />
              </Tooltip>
              <ListItemText sx={{ marginLeft: "0.5rem" }}>
                File
              </ListItemText>
              <input type="file" multiple accept='*'
                style={{
                  display: "none",
                }}
                onChange={(e) => fileChangeHandler(e, "Files")}
                ref={fileRef}
              />
            </MenuItem>
          </MenuList>

        </div>
      </Menu>
    </>
  )
}

export default FileMenu