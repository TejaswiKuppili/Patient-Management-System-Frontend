import { Button, CircularProgress, SxProps, Theme } from '@mui/material';

interface CustomButtonProps {
  loading?: boolean;
  children: React.ReactNode;
  className?: string;
  sx?: SxProps<Theme>; // ✅ allow sx prop
  [key: string]: any;  // allow other props like onClick, disabled, etc.
}

export const CustomButton = ({
  loading,
  children,
  className,
  sx,
  ...props
}: CustomButtonProps) => {
  return (
    <Button
      className={className}
      sx={sx}
      disabled={props.disabled || loading}
      {...props}
    >
      {loading ? <CircularProgress size={24} color="inherit" /> : children}
    </Button>
  );
};