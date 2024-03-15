import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

function AudioModal({ open, onClose, audioSrc }) {
    return (
      <Dialog onClose={onClose} open={open} sx={{
        '& .MuiDialog-paper': {
          width: '80%', // or any specific width
          maxWidth: 'none', // This can be set to ensure the dialog does not exceed a maximum width
        },
      }}>
        <DialogTitle>
          
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <audio controls autoPlay src={audioSrc} style={{ width: '100%', marginTop: 20 }}>
          Your browser does not support the audio element.
        </audio>
      </Dialog>
    );
  }
  
  export default AudioModal;