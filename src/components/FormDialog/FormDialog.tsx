import { Button, Dialog, DialogContent, DialogTitle } from '@mui/material';
import React from 'react';

interface FormDialogProps {
  title: string;
  buttonText: string;
  children: React.ReactNode;
  open: boolean;
  handleClose: () => void;
  handleClickOpen: () => void;
}

const FormDialog: React.FC<FormDialogProps> = ({
  children,
  title,
  buttonText,
  open,
  handleClose,
  handleClickOpen,
}) => {


  return (
    <div>
      <Button variant='outlined' color='primary' onClick={handleClickOpen}>
        {buttonText}
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby='form-dialog-title'
      >
        <DialogTitle id='form-dialog-title'>{title}</DialogTitle>
        <DialogContent>{children}</DialogContent>
      </Dialog>
    </div>
  );
};

export default FormDialog;