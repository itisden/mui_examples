import { Dialog, DialogProps, DialogTitle, DialogActions, Button } from '@mui/material';

interface Props extends DialogProps {
  onClose: VoidFunction;
}

export default function FiltersAndSortingDialog({ ...other }: Props) {
  return (
    <Dialog fullWidth maxWidth="lg" {...other}>
      <DialogTitle>Filters and Sorting</DialogTitle>
      <DialogActions>
        <Button variant="outlined" color="inherit" onClick={other.onClose}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}
