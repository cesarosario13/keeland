import { Toaster as Sonner, type ToasterProps } from 'sonner';

export const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      className="toaster group"
      {...props}
    />
  );
};
