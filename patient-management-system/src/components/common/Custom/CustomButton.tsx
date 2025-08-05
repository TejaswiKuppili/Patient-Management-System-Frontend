import { Button, SxProps, Theme } from '@mui/material';
import Spinner from '../Loader/Spinner';

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
      {loading ? <Spinner /> : children}
    </Button>
  );
};